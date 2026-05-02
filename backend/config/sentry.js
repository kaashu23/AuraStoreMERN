const Sentry = require('@sentry/node');

const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Performance Monitoring
    tracesSampleRate: 1.0, 
  });
};

module.exports = initSentry;
