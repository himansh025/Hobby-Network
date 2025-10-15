import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRoutes } from './routes/userRoutes';
import { graphRoutes } from './routes/graph';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybernauts';

// Database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDatabase();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes());
app.use('/api/graph', graphRoutes());

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      error: Object.values(error.errors).map((err: any) => err.message).join(', ')
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid ID format' 
    });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({ 
      success: false,
      error: 'Duplicate entry' 
    });
  }
  
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} `);
});

export default app;