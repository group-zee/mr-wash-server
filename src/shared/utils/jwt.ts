import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};
