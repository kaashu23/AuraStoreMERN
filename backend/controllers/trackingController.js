const Sentry = require("@sentry/node");
const ProductView = require('../models/ProductView');

// @desc    Log product view
// @route   POST /api/track/:productId
// @access  Public
exports.trackView = async (req, res) => {
  try {
    const userId = req.headers['x-clerk-user-id'] || 'anonymous';
    
    await ProductView.create({
      userId,
      productId: req.params.productId,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get recently viewed products
// @route   GET /api/track/recent
// @access  Private
exports.getRecentViews = async (req, res) => {
  try {
    const views = await ProductView.find({ userId: req.user.clerkId })
      .sort('-viewedAt')
      .limit(20)
      .populate('productId');

    // Filter out duplicates and nulls
    const uniqueProducts = [];
    const productIds = new Set();

    for (const view of views) {
      if (view.productId && !productIds.has(view.productId._id.toString())) {
        uniqueProducts.push(view.productId);
        productIds.add(view.productId._id.toString());
      }
      if (uniqueProducts.length >= 10) break;
    }

    res.status(200).json({ success: true, data: uniqueProducts });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get popular products (admin analytics)
// @route   GET /api/track/popular
// @access  Admin
exports.getPopularProducts = async (req, res) => {
  try {
    const popular = await ProductView.aggregate([
      {
        $group: {
          _id: '$productId',
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ]);

    res.status(200).json({ success: true, data: popular });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
