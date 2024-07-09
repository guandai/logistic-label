// backend/src/server.ts
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';
import shippingRateRoutes from './routes/shippingRateRoutes';
import postalZoneRoutes from './routes/postalZoneRoutes';

import dotenv from 'dotenv';

// Load environment variables from .env file
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shipping_rates', shippingRateRoutes); // Add this line
app.use('/api/postal_zones', postalZoneRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5100;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
