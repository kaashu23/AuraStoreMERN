const Sentry = require("@sentry/node");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Handle Stripe payment success webhook
// @route   POST /api/stripe/webhook
// @access  Public (Stripe)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    Sentry.captureException(err);
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findById(orderId).populate('user', 'email name');
      if (!order) {
        console.error(`Order ${orderId} not found in webhook`);
        return res.status(404).json({ success: false });
      }

      // Update order status
      order.paymentStatus = 'Paid';
      await order.save();

      // Reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        });
      }

      // Send confirmation email
      const emailHtml = `
        <h1>Order Confirmation</h1>
        <p>Hi ${order.user.name},</p>
        <p>Thank you for your order! Your payment was successful.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
        <p>We will notify you when your order is shipped.</p>
      `;

      await sendEmail({
        email: order.user.email,
        subject: 'Order Confirmation - E-Commerce',
        html: emailHtml,
      });

      order.emailSent = true;
      await order.save();

    } catch (error) {
      Sentry.captureException(error);
      console.error('Error processing successful payment:', error.message);
    }
  }

  res.json({ received: true });
};
