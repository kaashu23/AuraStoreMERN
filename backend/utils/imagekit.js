const ImageKit = require('@imagekit/nodejs');
const { toFile } = ImageKit;
const imagekit = require('../config/imagekit');

const uploadToImageKit = async (fileBuffer, fileName, folderPath = '/ecommerce') => {
  try {
    const response = await imagekit.files.upload({
      file: await toFile(fileBuffer, fileName),
      fileName: fileName,
      folder: folderPath,
    });
    return response.url;
  } catch (error) {
    console.error('ImageKit Detail Error:', error);
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

module.exports = { uploadToImageKit };
