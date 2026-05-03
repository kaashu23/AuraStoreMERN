const Sentry = require("@sentry/node");
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.qty' },
          totalRevenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
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

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
        ordersCount,
        usersCount,
        productsCount,
        topProducts,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get sales data for chart
// @route   GET /api/admin/sales
// @access  Admin
exports.getSalesData = async (req, res) => {
  try {
    const { group = 'day' } = req.query;
    let format = '%Y-%m-%d';

    if (group === 'week') {
      format = '%Y-W%V';
    } else if (group === 'month') {
      format = '%Y-%m';
    }

    const sales = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Admin
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
    const products = await Product.find({ stock: { $lt: threshold } }).populate('category', 'name');

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
