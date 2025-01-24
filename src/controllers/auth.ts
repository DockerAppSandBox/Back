import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import {
  InternalServerError,
  BadRequestError
} from "../http_code/error-code";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(error.statusCode).json({ error: error.message });
      }
      else if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({ error: error.message });
      }
      else if (error instanceof BadRequestError) {
        res.status(error.statusCode).json({ error: error.message });
      }
      else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  }
}
