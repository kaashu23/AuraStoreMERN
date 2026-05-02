const express = require('express');
const {
  trackView,
  getRecentViews,
  getPopularProducts,
} = require('../controllers/trackingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:productId', trackView);
router.get('/recent', protect, getRecentViews);
router.get('/popular', protect, admin, getPopularProducts);

module.exports = router;
