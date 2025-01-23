import { Request, Response } from 'express';
import ImageService from '../services/image';
import { PrismaClient, Prisma } from "@prisma/client";

import {
    NotFoundError,
    InternalServerError,
    BadRequestError,
  } from "../http_code/error-code";

import verifyToken from "../middleware/auth";

export default class ImageController  {

  static async getAllImages(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const images = await ImageService.getAllImages();
        res.status(200).json(images);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }
}