const Order = require('../models/Order');

const autoProcessLogistics = async () => {
  try {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // 1. Auto-Ship: Pending -> Shipped (after 12 hours)
    const shipResult = await Order.updateMany(
      {
        status: 'Pending',
        paymentStatus: 'Paid',
        createdAt: { $lte: twelveHoursAgo }
      },
      { $set: { status: 'Shipped' } }
    );
    if (shipResult.modifiedCount > 0) {
      console.log(`[Logistics] Protocol: ${shipResult.modifiedCount} orders automatically dispatched to Shipped.`);
    }

    // 2. Auto-Deliver: Shipped -> Delivered (after 2 days)
    // Note: We check against createdAt as a baseline, but in a real app we might track 'shippedAt'
    const deliverResult = await Order.updateMany(
      {
        status: 'Shipped',
        createdAt: { $lte: twoDaysAgo }
      },
      { $set: { status: 'Delivered' } }
    );
    if (deliverResult.modifiedCount > 0) {
      console.log(`[Logistics] Protocol: ${deliverResult.modifiedCount} orders automatically finalized to Delivered.`);
    }

  } catch (error) {
    console.error('[Logistics Error] Protocol sync failed:', error.message);
  }
};

// Run the logistics automation every hour
const initLogisticsAutomation = () => {
  console.log('[Aura Store] Logistics Automation Protocol Initialized.');
  // Initial run on startup
  autoProcessLogistics();
  // Set interval (1 hour = 3600000ms)
  setInterval(autoProcessLogistics, 3600000);
};

module.exports = initLogisticsAutomation;
