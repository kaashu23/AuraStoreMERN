const Sentry = require('@sentry/node');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const exportToCsv = require('../utils/csvExport');

// @desc    Export orders as CSV
// @route   GET /api/orders/export
// @access  Admin
exports.exportOrders = async (req, res, next) => {
  try {
    const { status, from, to } = req.query;
    let query = {};

    if (status) query.status = status;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const orders = await Order.find(query).populate('user', 'name email');

    const fields = [
      { label: 'Order ID', value: '_id' },
      { label: 'Customer', value: 'user.name' },
      { label: 'Email', value: 'user.email' },
      { label: 'Total Amount', value: 'totalAmount' },
      { label: 'Status', value: 'status' },
      { label: 'Payment', value: 'paymentStatus' },
      { label: 'Date', value: 'createdAt' },
    ];

    const csv = exportToCsv(orders, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('aura-orders.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Place order + trigger Stripe checkout session
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  const { items, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Item ${item.product} not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient vault stock for ${product.name}` });
      }

      totalAmount += product.price * item.qty;
      orderItems.push({
        product: product._id,
        qty: item.qty,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      address,
    });

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const line_items = items.map((item) => ({
      price_data: {
        currency: process.env.STRIPE_CURRENCY || 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      customer_email: req.user.email,
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order detail
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
