import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRoutes } from './routes/userRoutes';
import { graphRoutes } from './routes/graph';
import connectDB from './config/db';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();

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

app.use('*', (req, res) => {
  return res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} `);
});

export default app;