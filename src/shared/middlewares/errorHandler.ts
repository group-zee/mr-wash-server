import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { HttpStatus } from '../constants/HttpStatus';
import { ResponseMessages } from '../constants/ResponseMessages';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = ResponseMessages.INTERNAL_SERVER_ERROR;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(`[Error] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error(err.stack);
  }
  
  res.status(statusCode).json({
    status: ResponseMessages.ERROR,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
