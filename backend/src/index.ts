import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

// Import routes
import authRoutes from './routes/authRoutes';
import cheeseRoutes from './routes/cheeseRoutes';
import questionnaireRoutes from './routes/questionnaireRoutes';
import responseRoutes from './routes/responseRoutes';
import webhookRoutes from './routes/webhookRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cheeses', cheeseRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/webhooks', webhookRoutes);

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-company', (companyId: number) => {
    socket.join(`company-${companyId}`);
    console.log(`Client ${socket.id} joined company-${companyId}`);
  });

  socket.on('join-questionnaire', (questionnaireId: number) => {
    socket.join(`questionnaire-${questionnaireId}`);
    console.log(`Client ${socket.id} joined questionnaire-${questionnaireId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in other modules
export { io };

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server ready for real-time connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
