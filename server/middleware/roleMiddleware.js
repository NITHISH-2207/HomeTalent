/**
 * Middleware to restrict route access to users with active Provider Profiles.
 */
export const requireProvider = (req, res, next) => {
  if (req.user && req.user.hasProviderProfile === true) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied. You must set up a Provider Profile first.'
    });
  }
};
