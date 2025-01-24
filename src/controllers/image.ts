import { Request, Response } from 'express';
import ImageService from '../services/image';
import { PrismaClient, Prisma } from "@prisma/client";

import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../http_code/error-code";

import verifyToken from "../middleware/auth";

export default class ImageController {

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

  static async getImageById(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageService.getImageById(+req.params.id);
        res.status(200).json(image);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async createImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const newImage = await ImageService.createImage(req.body);
        res.status(201).json(newImage);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async updateImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageService.updateImage(+req.params.id, req.body);
        res.status(200).json(image);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async deleteImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageService.deleteImage(+req.params.id);
        res.status(200).json(image);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async likeImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageService.likeImage(+req.params.id);
        res.status(200).json(image);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async dislikeImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageService.dislikeImage(+req.params.id);
        res.status(200).json(image);
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