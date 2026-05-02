const express = require('express');
const { clerkWebhook } = require('../controllers/authController');

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), clerkWebhook);

module.exports = router;
