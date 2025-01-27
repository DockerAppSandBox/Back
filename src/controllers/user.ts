import { Request, Response } from 'express';
import UserService from "../services/user";
import {
    NotFoundError,
    InternalServerError,
    BadRequestError,
  } from "../http_code/error-code";
import verifyToken from "../middleware/auth";

export default class UserController {

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
  static async getUserById(req: Request, res: Response): Promise<void> {
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
  static async createUser(req: Request, res: Response): Promise<void> {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).json({ error: "L'email est requis" });
      }

      try {
        const newUser = await UserService.createUser({ email, password });
        res.status(201).json(newUser);
      } catch (error: any) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          res.status(400).json({ error: "L'email est déjà utilisé" });
        }

        res.status(500).json({ error: "Erreur interne du serveur" });
      };
  }

  // Mettre à jour un utilisateur
  static async updateUser(req: Request, res: Response): Promise<void> {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        throw new BadRequestError("Le champ 'password' est requis");
      }

      try {
        const updatedUser = await UserService.updateUser(id, { password });
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
  static async deleteUser(req: Request, res: Response): Promise<void> {
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