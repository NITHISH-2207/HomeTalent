import ProviderProfile from '../models/ProviderProfile.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';

/**
 * @desc    Get all provider profiles with filters
 * @route   GET /api/providers
 * @access  Public
 */
export const getProviders = async (req, res, next) => {
  try {
    const { skill, city, area, search, keyword } = req.query;

    // 1. Build User query for location/name search
    let userQuery = {};
    if (city) {
      userQuery['location.city'] = new RegExp(city.trim(), 'i');
    }
    if (area) {
      userQuery['location.area'] = new RegExp(area.trim(), 'i');
    }
    if (search) {
      userQuery['$or'] = [
        { name: new RegExp(search.trim(), 'i') },
        { 'location.city': new RegExp(search.trim(), 'i') },
        { 'location.area': new RegExp(search.trim(), 'i') }
      ];
    }

    // Find users matching search criteria
    const matchingUsers = await User.find(userQuery).select('_id');
    const userIds = matchingUsers.map(u => u._id);

    // 2. Build Provider profile query
    let profileQuery = { userId: { $in: userIds } };

    if (skill) {
      // If skill is passed, let's see if it's an ObjectId or a skill name
      if (skill.match(/^[0-9a-fA-F]{24}$/)) {
        profileQuery.skills = skill;
      } else {
        // Find skill by name and query
        const foundSkill = await Skill.findOne({ name: new RegExp(skill.trim(), 'i') });
        if (foundSkill) {
          profileQuery.skills = foundSkill._id;
        } else {
          // If no matching skill, return empty list
          return res.json([]);
        }
      }
    }

    // Add keyword search parameter (searches user name and provider headline)
    const activeKeyword = keyword || search;
    if (activeKeyword) {
      const keywordUsers = await User.find({ name: new RegExp(activeKeyword.trim(), 'i') }).select('_id');
      const keywordUserIds = keywordUsers.map(u => u._id);

      profileQuery['$or'] = [
        { userId: { $in: keywordUserIds } },
        { headline: new RegExp(activeKeyword.trim(), 'i') }
      ];
    }

    const profiles = await ProviderProfile.find(profileQuery)
      .populate('userId', 'name phone location profileImage hasProviderProfile')
      .populate('skills');

    res.json(profiles);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single provider profile by profile ID or userId
 * @route   GET /api/providers/:id
 * @access  Public
 */
export const getProviderById = async (req, res, next) => {
  try {
    const id = req.params.id;

    let profile;
    // Check if ID is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // First try to find by ProviderProfile _id, otherwise try by userId
      profile = await ProviderProfile.findById(id)
        .populate('userId', 'name phone location profileImage hasProviderProfile')
        .populate('skills');

      if (!profile) {
        profile = await ProviderProfile.findOne({ userId: id })
          .populate('userId', 'name phone location profileImage hasProviderProfile')
          .populate('skills');
      }
    }

    if (!profile) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create provider profile
 * @route   POST /api/providers/profile
 * @access  Private
 */
export const createProviderProfile = async (req, res, next) => {
  try {
    const { headline, bio, skills, availability, pricing } = req.body;

    // Check if profile already exists for user
    const existingProfile = await ProviderProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      res.status(400);
      throw new Error('Provider profile already exists. Use PUT to update.');
    }

    // Create provider profile
    const profile = new ProviderProfile({
      userId: req.user.id,
      headline: headline || '',
      bio: bio || '',
      skills: skills || [],
      availability: availability || {
        monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false
      },
      pricing: pricing || { minPrice: 0, maxPrice: 0, unit: 'negotiable' }
    });

    const savedProfile = await profile.save();

    // Crucial rule: update user hasProviderProfile boolean
    await User.findByIdAndUpdate(req.user.id, { hasProviderProfile: true });

    res.status(201).json(savedProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update provider profile
 * @route   PUT /api/providers/profile
 * @access  Private (Provider only)
 */
export const updateProviderProfile = async (req, res, next) => {
  try {
    const { headline, bio, skills, availability, pricing } = req.body;

    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    // Update fields if provided
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (availability !== undefined) profile.availability = availability;
    if (pricing !== undefined) profile.pricing = pricing;

    const updatedProfile = await profile.save();
    
    // Just in case, ensure User flag is updated as well
    await User.findByIdAndUpdate(req.user.id, { hasProviderProfile: true });

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload portfolio images
 * @route   POST /api/providers/portfolio
 * @access  Private (Provider only)
 */
export const uploadPortfolioImages = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user.id });
    if (!profile) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('Please upload at least one image');
    }

    // Get the relative file paths of uploaded files
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    
    // Add paths to profile portfolio images list
    profile.portfolioImages.push(...filePaths);
    await profile.save();

    res.json({
      message: 'Portfolio images uploaded successfully',
      portfolioImages: profile.portfolioImages
    });
  } catch (error) {
    next(error);
  }
};
