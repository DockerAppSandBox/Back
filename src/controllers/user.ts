import { Request, Response } from 'express';
import UserService from "../services/user";
import { PrismaClient, Prisma } from "@prisma/client";

import {
    NotFoundError,
    InternalServerError,
    BadRequestError,
  } from "../http_code/error-code";

import { CreateUserDTO, UpdateUserDTO } from "../entity/user";
import verifyToken from "../middleware/auth";

export default class UserController {

static async GetTest(req: Request, res: Response): Promise<void> {
    try {
      const getTest = await UserService.getTests();
      res.status(200).json(getTest);
    } catch (error) {
      res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
      } catch (error) {
        if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  // Obtenir un utilisateur par ID
  static async getUserById(req: Request<{ id: string }>, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) throw new NotFoundError("Utilisateur non trouvé");
        res.status(200).json(user);
      } catch (error) {
        if (error instanceof NotFoundError) {
          res.status(error.statusCode).json({ error: error.message });
        } else if (error instanceof InternalServerError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  // Créer un utilisateur
  static async createUser(req: Request<{}, {}, CreateUserDTO>, res: Response): Promise<void> {
      const { email, name } = req.body;

      if (!email) {
        res.status(400).json({ error: "L'email est requis" });
      }

      try {
        const newUser = await UserService.createUser({ email, name });
        res.status(201).json(newUser);
      } catch (error: any) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        res.status(500).json({ error: "Erreur interne du serveur" });
      };
  }

  // Mettre à jour un utilisateur
  static async updateUser(req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        throw new BadRequestError("Le champ 'name' est requis");
      }

      try {
        const updatedUser = await UserService.updateUser(id, { name });
        if (!updatedUser) throw new NotFoundError("Utilisateur non trouvé");
        res.status(200).json(updatedUser);
      } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }

  // Supprimer un utilisateur
  static async deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      try {
        const deletedUser = await UserService.deleteUser(req.params.id);
        if (!deletedUser) throw new NotFoundError("Utilisateur non trouvé");
        res.status(204).send();
      } catch (error) {
        if (error instanceof NotFoundError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Unknown error" });
        }
      }
    });
  }
  
}