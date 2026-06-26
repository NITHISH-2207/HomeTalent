import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id, hasProviderProfile) => {
  return jwt.sign(
    { id, hasProviderProfile },
    process.env.JWT_SECRET || 'super_secret_hometalent_jwt_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, phone, password, location } = req.body;

    if (!name || !phone || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, phone, password)');
    }

    // Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      res.status(400);
      throw new Error('Phone number already registered');
    }

    // Create user (password is auto-hashed via schema pre-save middleware)
    const user = await User.create({
      name,
      phone,
      password,
      location: location || { city: '', area: '' }
    });

    res.status(201).json({
      message: 'User registered successfully. Please log in.',
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400);
      throw new Error('Please provide both phone number and password');
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(401);
      throw new Error('Invalid phone number or password');
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid phone number or password');
    }

    // Return user details + JWT token
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      hasProviderProfile: user.hasProviderProfile,
      location: user.location,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.hasProviderProfile)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};
