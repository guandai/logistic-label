// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: (msg) => logger.info(msg), // Use logger for logging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Import models
import { User } from '../models/User';
import { Package } from '../models/Package';
import { Transaction } from '../models/Transaction';
import logger from './logger';

// Initialize model relationships if needed
Transaction.belongsTo(Package, { foreignKey: 'packageId' });

// Connect to the database and synchronize models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
    // sequelize.sync();
    logger.info('Database synchronized successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
