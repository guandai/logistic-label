import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';
import shippingRateRoutes from './routes/shippingRateRoutes';
import postalZoneRoutes from './routes/postalZoneRoutes';
import compression from 'compression';
import dotenv from 'dotenv';
import logger from './config/logger';
import zipCodeRoutes from './routes/zipCodeRoutes';
import { UserAttributes } from '@ddlabel/shared';
import { authenticate } from './middleware/auth';

declare global {
  namespace Express {
    interface Request {
      io: import('socket.io').Server;
      user?: UserAttributes;
    }
  }
}

const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/socket.io/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
    credentials: true,
  },
});

const socketIoMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.io = io;
  next();
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(compression());

// Routes
app.use('/api/zipcodes/', zipCodeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shipping_rates', shippingRateRoutes);
app.use('/api/postal_zones', postalZoneRoutes);
app.use('/api/packages', authenticate, socketIoMiddleware, packageRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5100;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});

io.on('connection', (socket) => {
  logger.info(`User connected from referer: ${JSON.stringify(socket.handshake.headers.referer)}`);
  logger.info(`User connected from x-real-ip: ${socket.handshake.headers['x-real-ip']}`);
  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
});
