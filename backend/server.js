import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import vocabularyRoutes from './routes/vocabularyRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/review', reviewRoutes);
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});