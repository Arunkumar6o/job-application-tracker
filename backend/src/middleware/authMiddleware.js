const { supabase } = require('../services/supabaseClient');

/**
 * Middleware to authenticate requests using Supabase JWT.
 * Validates the Bearer token against Supabase Auth service.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Bearer token missing in Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Empty token provided.',
      });
    }

    // Validate the token against Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    // Attach authenticated user information to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate user session.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

module.exports = { requireAuth };
