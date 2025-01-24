import { Request, Response } from 'express';
import ImageService from '../services/image';
import ImageVoteService from '../services/imageVote';

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
        const userId = req.user.id;
        const imageId = +req.params.id;

        const existingVote = await ImageVoteService.getVote(userId, imageId);

        if (existingVote) {
          if (existingVote.like) {
            await ImageVoteService.deleteVote(userId, imageId);
            return res.status(200).json({ message: "Vote removed." });
          } else {
            // Si l'utilisateur avait disliké, mettre à jour le vote pour un like
            const updatedVote = await ImageVoteService.updateVote({
              userId,
              imageId,
              like: true, // Changer le dislike en like
            });
            return res.status(200).json(updatedVote);
          }
        } else {
          // Si aucun vote n'existe, créer un nouveau vote avec like = true
          const newVote = await ImageVoteService.voteForImage({
            userId,
            imageId,
            like: true,
          });
          return res.status(201).json(newVote);
        }
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
        const userId = req.user.id;
        const imageId = +req.params.id;

        const existingVote = await ImageVoteService.getVote(userId, imageId);

        if (existingVote) {
          if (!existingVote.like) {
            // Si l'utilisateur a déjà disliké, supprimer le vote
            await ImageVoteService.deleteVote(userId, imageId);
            return res.status(200).json({ message: "Vote removed." });
          } else {
            // Si l'utilisateur avait liké, mettre à jour le vote pour un dislike
            const updatedVote = await ImageVoteService.updateVote({
              userId,
              imageId,
              like: false, // Changer le like en dislike
            });
            return res.status(200).json(updatedVote);
          }
        } else {
          // Si aucun vote n'existe, créer un nouveau vote avec like = false
          const newVote = await ImageVoteService.voteForImage({
            userId,
            imageId,
            like: false,
          });
          return res.status(201).json(newVote);
        }
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