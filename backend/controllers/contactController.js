const sendEmail = require('../utils/sendEmail');
const Sentry = require('@sentry/node');

// @desc    Send contact form email to admin
// @route   POST /api/contact
// @access  Public
exports.sendContactEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    const emailHtml = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail({
      email: process.env.EMAIL_USER, // Admin email
      subject: `New Inquiry from ${name} - Aura Store`,
      html: emailHtml,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    Sentry.captureException(error);
    next(error);
  }
};
