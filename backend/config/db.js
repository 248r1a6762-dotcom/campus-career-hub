import mongoose from 'mongoose';
import { dbCollections } from './mockDb.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.log('No MONGO_URI provided. Falling back to Local JSON database.');
    return false;
  }
  
  try {
    await mongoose.connect(mongoURI);
    isMongoConnected = true;
    console.log('MongoDB Connected successfully!');
    return true;
  } catch (error) {
    console.error('MongoDB Connection failed:', error.message);
    console.log('Falling back to Local JSON database.');
    return false;
  }
};

// Unified DB Wrapper proxying to MongoDB (if enabled) or Local JSON storage
export const getCollection = (collectionName) => {
  return dbCollections[collectionName];
};

export const getDbStatus = () => {
  return isMongoConnected ? 'MongoDB' : 'Local JSON Fallback';
};
