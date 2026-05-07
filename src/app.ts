import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { stream } from './shared/utils/logger';
import { errorHandler } from './shared/middlewares/errorHandler';

const app: Application = express();
// Server Refresh滋

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));

// Routes
import userRoutes from './modules/user/infrastructure/UserRoutes';
import authRoutes from './modules/auth/infrastructure/AuthRoutes';

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
