const express = require('express');
const {
  getStats,
  getSalesData,
  getLowStockProducts,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/sales', getSalesData);
router.get('/low-stock', getLowStockProducts);

module.exports = router;
