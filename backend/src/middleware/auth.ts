import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../types';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return void 0;
    // throw new Error('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return void 0;
      // throw new Error('User not found.');
    }
    req.user = user;
    next();
    
  } catch (error) {
    res.status(400).json(error || { message: 'Invalid token.' });
    return void 0;
    // next(error || { message: 'Invalid token.' });
  }
};
