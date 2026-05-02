const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const initSentry = require('./config/sentry');
const errorHandler = require('./middleware/errorHandler');
const { clerkMiddleware } = require('@clerk/express');
const initLogisticsAutomation = require('./utils/logisticsAutomation');

// Load env vars
dotenv.config();

// Initialize Sentry
initSentry();

// Connect to database
connectDB().then(() => {
  // Initialize Background Automation Protocols
  initLogisticsAutomation();
});

const app = express();

app.use(clerkMiddleware());

// Webhook routes (MUST be before express.json body parser for raw body access)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stripe', require('./routes/stripeRoutes'));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/track', require('./routes/trackingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Error handler (must be after routes)
app.use(errorHandler);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
