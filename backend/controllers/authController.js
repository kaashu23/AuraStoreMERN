const Sentry = require("@sentry/node");
const { Webhook } = require('svix');
const User = require('../models/User');

// @desc    Sync Clerk user to MongoDB
// @route   POST /api/auth/webhook
// @access  Public
exports.clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    return res.status(500).json({ success: false, message: 'Webhook secret not found' });
  }

  // Get headers
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ success: false, message: 'No svix headers' });
  }

  // Get body
  const payload = req.body.toString();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify payload
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error('Error verifying webhook:', err.message);
    return res.status(400).json({ success: false, message: 'Verification failed' });
  }

  // Handle event
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, email_addresses, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    const name = `${first_name} ${last_name}`;

    try {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          name,
          email,
        },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, message: 'User synced' });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error syncing user:', error.message);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await User.findOneAndDelete({ clerkId: id });
      return res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error deleting user:', error.message);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  res.status(200).json({ success: true });
};
