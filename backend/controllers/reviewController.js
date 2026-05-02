const Sentry = require("@sentry/node");
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Add review
// @route   POST /api/reviews/:productId
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // 1. Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // 2. Check if user has a delivered order with this product
    const order = await Order.findOne({
      user: req.user.id,
      status: 'Delivered',
      'items.product': productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased and received',
      });
    }

    // 3. Create review
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    Sentry.captureException(error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
