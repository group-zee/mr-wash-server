import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export const generateToken = (payload: object, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): object | string => {
  return jwt.verify(token, config.jwtSecret);
};
