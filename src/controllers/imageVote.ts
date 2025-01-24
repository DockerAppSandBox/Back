import { Request, Response } from 'express';
import ImageVoteService from '../services/imageVote';

import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../http_code/error-code";

import verifyToken from "../middleware/auth";

export default class ImageVoteController  {

  static async voteForImage(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const imageVote  = await ImageVoteService.voteForImage(req.body);
        res.status(200).json(imageVote);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async getVotesByImageId(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const votes  = await ImageVoteService.getVotesByImageId(+req.params.imageId);
        res.status(200).json(votes);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  static async updateVote(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const image = await ImageVoteService.updateVote(req.body);
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

  static async deleteVote(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        await ImageVoteService.deleteVote(req.body, req.body);
        res.status(204).send();
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