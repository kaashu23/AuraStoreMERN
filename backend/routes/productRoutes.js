const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
} = require('../controllers/productController');
const upload = require('../middleware/multer');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.array('images', 5), createProduct);
router.route('/bulk-delete').post(protect, admin, bulkDeleteProducts);
router.route('/bulk-update').put(protect, admin, bulkUpdateProducts);
router.route('/:id').get(getProduct).put(protect, admin, upload.array('images', 5), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
