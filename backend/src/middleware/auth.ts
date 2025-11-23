import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in production environment.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-DO-NOT-USE-IN-PRODUCTION';

export interface AuthRequest extends Request {
  companyId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { companyId: number };
    req.companyId = decoded.companyId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(companyId: number): string {
  return jwt.sign({ companyId }, JWT_SECRET, { expiresIn: '24h' });
}
