import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../shared/utils/logger';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
