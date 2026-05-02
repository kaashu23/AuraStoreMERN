const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

// Middleware to protect routes and verify Clerk session
exports.protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      console.log('Auth failed: No userId found in request headers/cookies');
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    // 1. Find user in MongoDB
    let user = await User.findOne({ clerkId: userId });

    // 2. Fallback: If user not in DB (webhooks missing), auto-sync from Clerk on the fly
    if (!user) {
      console.log(`[AUTH] User ${userId} not found in MongoDB. Triggering auto-sync...`);
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Aura Member';
        const image = clerkUser.imageUrl;
        const role = clerkUser.publicMetadata?.role || 'user';

        if (!email) {
          throw new Error('No email address found in Clerk profile');
        }

        // Use findOneAndUpdate with upsert for atomicity
        user = await User.findOneAndUpdate(
          { clerkId: userId },
          {
            clerkId: userId,
            name,
            email,
            role,
          },
          { upsert: true, new: true, runValidators: true }
        );
        
        console.log(`[AUTH] Successfully synced user: ${email} (${user.role})`);
      } catch (clerkError) {
        console.error(`[AUTH] Clerk Sync Failed for ${userId}:`, clerkError.message);
        return res.status(401).json({ 
          success: false, 
          message: 'Your account is being synced. Please refresh in a moment.',
          error: clerkError.message 
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('General Auth Middleware Error:', error.message);
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
