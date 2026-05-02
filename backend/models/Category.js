const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create category slug from the name
CategorySchema.pre('save', async function() {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
});

module.exports = mongoose.model('Category', CategorySchema);
