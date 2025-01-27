import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { AuthResponse } from '../entity/auth';
import {
  InternalServerError,
  BadRequestError,
  NotFoundError
} from "../http_code/error-code";

export default class AuthController {

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

  static async login(
    req: Request,
    res: Response
  ) : Promise<any>{
    try {
      const result = await AuthService.login(req.body);
       return res.status(200).json(result);
    } catch (error) {
      if(error instanceof NotFoundError ){
        return res.status(error.statusCode).json({error: error.message})
      }
      else if (error instanceof InternalServerError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      else if (error instanceof BadRequestError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      else {
        return res.status(500).json({ error: "Unknown error" });
      }
    }
  }

  static async test(req:Request, res:Response) {
    res.status(200).json({hello:"Helllo world"});
  }


}
