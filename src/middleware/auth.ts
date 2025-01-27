import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../http_code/error-code';

interface UserPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token.length === 0) {
    const error = new UnauthorizedError("Unauthorized");
    return res.status(error.statusCode).json({ error: error.message });
  } 


  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const error = new UnauthorizedError("JWT secret is not configured");
    return res.status(error.statusCode).json({ error: error.message });
  }

  try {

    const decoded = jwt.verify(token || '', process.env.JWT_SECRET!) as UserPayload;
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ error: error.message });
    } else 
    return res.status(500).json({ error: error });

  }
};

export default verifyToken;