const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  exportOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/export').get(admin, exportOrders);
router.route('/').get(admin, getOrders).post(createOrder);
router.route('/my').get(getMyOrders);
router.route('/:id').get(getOrder);
router.route('/:id/status').put(admin, updateOrderStatus);

module.exports = router;
