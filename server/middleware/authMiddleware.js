import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_hometalent_jwt_key');

      // Fetch user from DB to ensure they still exist and check current hasProviderProfile status
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach user details to request
      req.user = {
        id: user._id.toString(),
        hasProviderProfile: user.hasProviderProfile
      };

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * Stub for future administrator checking middleware.
 */
export const requireAdmin = (req, res, next) => {
  // Staging logic for Phase 2 admin panel
  // Currently permits and proceeds, or checks if req.user is an admin (if field existed)
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator privileges required' });
  }
};
