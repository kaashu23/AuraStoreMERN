const mongoose = require('mongoose');

const ProductViewSchema = new mongoose.Schema({
  userId: {
    type: String, // clerkId
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProductView', ProductViewSchema);
