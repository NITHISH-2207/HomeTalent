import mongoose from 'mongoose';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Skill from '../models/Skill.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

const initialSkills = [
  { name: 'Tailoring', category: 'Crafts & Design', icon: '✂️' },
  { name: 'Home Baking', category: 'Food & Cooking', icon: '🍰' },
  { name: 'Tutoring', category: 'Education', icon: '📚' },
  { name: 'Spoken English', category: 'Education', icon: '💬' },
  { name: 'Craft Making', category: 'Crafts & Design', icon: '🎨' },
  { name: 'Language Teaching', category: 'Education', icon: '🗣️' },
  { name: 'Music Lessons', category: 'Music & Art', icon: '🎵' },
  { name: 'Cooking Classes', category: 'Food & Cooking', icon: '🍳' },
  { name: 'Yoga & Fitness', category: 'Health & Wellness', icon: '🧘' },
  { name: 'Mehendi / Art', category: 'Music & Art', icon: '✍️' }
];

export const seedDatabase = async () => {
  try {
    // 1. Seed Skills if database has none
    const skillCount = await Skill.countDocuments();
    let skills = [];
    if (skillCount === 0) {
      console.log('Seeding skills database...');
      skills = await Skill.insertMany(initialSkills);
      console.log(`${skills.length} skills successfully seeded.`);
    } else {
      skills = await Skill.find({});
      console.log('Skills database already populated.');
    }

    // 2. Seed Test Users if database has none
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding test users and provider profiles...');

      // Create Customer (User 1)
      const customer = await User.create({
        name: 'Anita Sharma (Customer)',
        phone: '1234567890',
        password: 'password123',
        location: {
          city: 'Mumbai',
          area: 'Bandra'
        },
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
      });

      // Create Provider (User 2)
      const providerUser = await User.create({
        name: 'Rajesh Patel (Provider)',
        phone: '9876543210',
        password: 'password123',
        hasProviderProfile: true,
        location: {
          city: 'Mumbai',
          area: 'Khar'
        },
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });

      // Map seeded skills
      const tutoringSkill = skills.find(s => s.name === 'Tutoring') || skills[2];
      const cookingSkill = skills.find(s => s.name === 'Cooking Classes') || skills[7];
      const bakingSkill = skills.find(s => s.name === 'Home Baking') || skills[1];

      // Create Provider Profile for User 2
      const providerProfile = await ProviderProfile.create({
        userId: providerUser._id,
        headline: 'Retired High School Math Teacher & Expert Home Cook',
        bio: 'I taught mathematics for 30 years and now offer tutoring sessions for students. I also conduct home cooking classes for traditional Indian dishes and bake fresh breads weekly.',
        skills: [tutoringSkill._id, cookingSkill._id, bakingSkill._id],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        pricing: {
          minPrice: 300,
          maxPrice: 800,
          unit: 'per hour'
        },
        portfolioImages: [
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500', // Study/Tutoring
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500'  // Cooking
        ],
        averageRating: 0,
        totalReviews: 0,
        completedBookings: 1, // Will seed 1 completed booking
        communityVerified: true
      });

      // Create Bookings
      // Booking 1: Pending
      await Booking.create({
        customerId: customer._id,
        providerId: providerProfile._id,
        skillId: tutoringSkill._id,
        message: 'Hello Mr. Rajesh, I would like to book tutoring lessons for my daughter in Grade 10 math.',
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        budget: 500,
        status: 'pending'
      });

      // Booking 2: Accepted
      await Booking.create({
        customerId: customer._id,
        providerId: providerProfile._id,
        skillId: bakingSkill._id,
        message: 'Looking for a baking session on sourdough breads this Wednesday.',
        preferredDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        budget: 600,
        status: 'accepted'
      });

      // Booking 3: Completed
      const completedBooking = await Booking.create({
        customerId: customer._id,
        providerId: providerProfile._id,
        skillId: cookingSkill._id,
        message: 'Interested in learning standard Punjabi curries. Let me know if we can do this on Friday.',
        preferredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        budget: 800,
        status: 'completed'
      });

      console.log('Test users, provider profiles, and bookings successfully seeded.');
    } else {
      console.log('Users already exist in database. Skipping seed.');
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};
