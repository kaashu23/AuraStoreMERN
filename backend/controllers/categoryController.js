const Sentry = require("@sentry/node");
const Category = require('../models/Category');
const imagekit = require('../config/imagekit');
const { uploadToImageKit } = require('../utils/imagekit');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname, '/ecommerce/categories');
    }

    const categoryData = { ...req.body, image: imageUrl };
    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let imageUrl = category.image;
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname, '/ecommerce/categories');
    }

    const categoryData = { ...req.body, image: imageUrl };

    category = await Category.findByIdAndUpdate(req.params.id, categoryData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
