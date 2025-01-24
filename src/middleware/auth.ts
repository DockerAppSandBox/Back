import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../http_code/error-code';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    const error = new UnauthorizedError("Unauthorized");
    res.status(error.statusCode).json({ error: error.message });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const error = new UnauthorizedError("JWT secret is not configured");
    return res.status(error.statusCode).json({ error: error.message });
  }
  try {
    const decoded = jwt.verify(jwtSecret, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({ error: error.message });
    }
  }
};

export default verifyToken;