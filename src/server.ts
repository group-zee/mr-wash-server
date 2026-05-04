import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { logger } from './shared/utils/logger';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port} in ${config.env} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
