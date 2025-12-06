import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/database.js';
import userRoutes from './routes/users.js';
import portfolioRoutes from './routes/portfolio.js';
import webhookRoutes from './routes/webhooks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running ✅',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zyvox AI Backend Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      portfolio: '/api/portfolio',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
🚀 Zyvox AI Backend Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://localhost:${PORT}
📊 API Base: http://localhost:${PORT}/api
💾 Database: MongoDB Connected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📴 Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

startServer();
