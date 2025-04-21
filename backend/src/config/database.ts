// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger';

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
  host: process.env.MYSQL_TCP_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // logging: (msg) => logger.info(msg), // Use logger for logging
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Connect to the database and synchronize models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.info('Connection has been established successfully.');
    // sequelize.sync();
    console.info('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
