import Skill from '../models/Skill.js';

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    next(error);
  }
};
