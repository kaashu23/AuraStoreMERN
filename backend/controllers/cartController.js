const Sentry = require("@sentry/node");
const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, qty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ product: productId, qty });
      }

      cart.updatedAt = Date.now();
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { qty } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].qty = qty;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
