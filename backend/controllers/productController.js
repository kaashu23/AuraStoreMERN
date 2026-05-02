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

    // Handle price range if it exists
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let parsedQuery = JSON.parse(queryStr);
    
    // Explicitly handle Category filtering
    if (parsedQuery.category === '') delete parsedQuery.category;

    // Build the query
    let query = Product.find(parsedQuery);

    // Search functionality (Text index search)
    if (req.query.search) {
      query = Product.find({ 
        $text: { $search: req.query.search } 
      });
      
      // If other filters exist, merge them
      if (Object.keys(parsedQuery).length > 0) {
        query = Product.find({
           ...parsedQuery,
           $text: { $search: req.query.search }
        });
      }
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default limit for high performance
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Executing query
    const products = await query.populate('category', 'name');
    const total = await Product.countDocuments(req.query.search ? { $text: { $search: req.query.search }, ...parsedQuery } : parsedQuery);

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
