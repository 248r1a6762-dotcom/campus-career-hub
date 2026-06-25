import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import counselingRoutes from './routes/counselingRoutes.js';
import campusRoutes from './routes/campusRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/campus', campusRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Campus Career Hub Server is active and healthy.' });
});

// Start Server Function
const startServer = async () => {
  // Connect to DB (will automatically fallback to JSON database if URI is missing/fails)
  await connectDB();
  
  // Seed Database (verifies collections are populated with sample data)
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Error starting server:', err);
});
