const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

// Middleware to protect routes and verify Clerk session
exports.protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    // 1. Find user in MongoDB
    let user = await User.findOne({ clerkId: userId });

    // 2. Fallback: If user not in DB (webhooks missing), auto-sync from Clerk on the fly
    if (!user) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Aura Member';
        const role = clerkUser.publicMetadata?.role || 'user';

        user = await User.create({
          clerkId: userId,
          name,
          email,
          role,
        });
        
        console.log(`Auto-synced user ${email} to MongoDB`);
      } catch (clerkError) {
        console.error('Clerk Fetch Error:', clerkError.message);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Middleware to restrict access to admins
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'User role not authorized' });
  }
};
