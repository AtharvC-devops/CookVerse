const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// MongoDB connection caching for serverless environment
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cookverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = client;
  console.log('✅ Connected to MongoDB');
  return cachedDb;
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/recipes', require('../routes/recipes'));
app.use('/api/user', require('../routes/user'));
app.use('/api/subscriptions', require('../routes/subscriptions'));
app.use('/api/notifications', require('../routes/notifications'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CookVerse API is running!',
    timestamp: new Date().toISOString(),
    environment: 'Vercel Serverless'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export the Express app as a serverless function
module.exports = app;