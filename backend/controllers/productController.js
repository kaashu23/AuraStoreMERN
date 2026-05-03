const Sentry = require("@sentry/node");
const Product = require('../models/Product');
const imagekit = require('../config/imagekit');
const { uploadToImageKit } = require('../utils/imagekit');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludeFields = ['select', 'sort', 'page', 'limit', 'search'];
    excludeFields.forEach(el => delete queryObj[el]);

    // Properly transform bracketed query params (e.g., price[lte]=100)
    // into Mongoose-friendly nested objects (e.g., { price: { $lte: 100 } })
    Object.keys(queryObj).forEach(key => {
      if (key.includes('[') && key.includes(']')) {
        const [field, op] = key.split(/[\[\]]/).filter(Boolean);
        if (!queryObj[field]) queryObj[field] = {};
        // Add $ prefix only if missing
        const operator = op.startsWith('$') ? op : `$${op}`;
        queryObj[field][operator] = queryObj[key];
        delete queryObj[key];
      }
    });

    // Handle traditional JSON-style filters by adding $ prefix to operators
    let queryStr = JSON.stringify(queryObj);
    // Only prefix if it's NOT already prefixed (avoiding $$lte)
    queryStr = queryStr.replace(/"(gt|gte|lt|lte|in)":/g, '"$$$1":');
    
    let parsedQuery = JSON.parse(queryStr);
    
    // Explicitly handle Category filtering
    if (parsedQuery.category === '') delete parsedQuery.category;

    // Build the query
    let mongoQuery = Product.find(parsedQuery);

    // Search functionality (Text index search)
    if (req.query.search) {
      const searchFilter = { $text: { $search: req.query.search } };
      mongoQuery = Product.find({ ...parsedQuery, ...searchFilter });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      mongoQuery = mongoQuery.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      mongoQuery = mongoQuery.sort(sortBy);
    } else {
      mongoQuery = mongoQuery.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    mongoQuery = mongoQuery.skip(skip).limit(limit);

    // Executing query
    const products = await mongoQuery.populate('category', 'name');
    
    const countFilter = req.query.search 
      ? { ...parsedQuery, $text: { $search: req.query.search } } 
      : parsedQuery;
    const total = await Product.countDocuments(countFilter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const imageUrls = [];
    const categoryName = req.body.categoryName || 'misc';
    const folderName = categoryName.toLowerCase().replace(/\s+/g, '-');
    const folderPath = `/ecommerce/products/${folderName}`;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToImageKit(file.buffer, file.originalname, folderPath);
        imageUrls.push(url);
      }
    }
    const productData = { ...req.body, images: imageUrls };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const imageUrls = [...(product.images || [])];
    const categoryName = req.body.categoryName || 'misc';
    const folderName = categoryName.toLowerCase().replace(/\s+/g, '-');
    const folderPath = `/ecommerce/products/${folderName}`;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToImageKit(file.buffer, file.originalname, folderPath);
        imageUrls.push(url);
      }
    }
    const productData = { ...req.body, images: imageUrls };
    product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.bulkDeleteProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdateProducts = async (req, res, next) => {
  try {
    const { ids, update } = req.body;
    await Product.updateMany({ _id: { $in: ids } }, { $set: update });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
