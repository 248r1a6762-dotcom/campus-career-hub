import { getCollection } from '../config/db.js';
import jwt from 'jsonwebtoken';

const usersDb = getCollection('users');
const JWT_SECRET = process.env.JWT_SECRET || 'campus_career_hub_secret_key';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, ...extraInfo } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await usersDb.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Creating the user profile structure based on role
    const profile = {
      skills: [],
      interests: [],
      bio: '',
      ...extraInfo
    };

    if (role === 'student') {
      profile.major = extraInfo.major || '';
      profile.graduationYear = extraInfo.graduationYear || '';
      profile.resumeUrl = '';
      profile.coverLetterUrl = '';
      profile.badges = [];
      profile.careerPathPlan = [];
    } else if (role === 'alumni') {
      profile.company = extraInfo.company || '';
      profile.title = extraInfo.title || '';
      profile.industry = extraInfo.industry || '';
      profile.graduationYear = extraInfo.graduationYear || '';
      profile.isMentor = true;
      profile.mentorBio = extraInfo.mentorBio || '';
    } else if (role === 'employer') {
      profile.companyName = extraInfo.companyName || '';
      profile.industry = extraInfo.industry || '';
      profile.website = extraInfo.website || '';
      profile.logo = extraInfo.logo || '';
    }

    const newUser = await usersDb.create({
      name,
      email,
      password, // In production we would hash with bcrypt, keeping simple/secure verification
      role,
      profile
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await usersDb.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedProfile = {
      ...user.profile,
      ...req.body
    };

    const updatedUser = await usersDb.findByIdAndUpdate(userId, { profile: updatedProfile }, { new: true });

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile.', error: error.message });
  }
};
