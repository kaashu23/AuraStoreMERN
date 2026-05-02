const ImageKit = require('@imagekit/nodejs');

// Initialize ImageKit with Private Key
// The new SDK automatically picks up IMAGEKIT_PRIVATE_KEY from .env
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

module.exports = imagekit;
