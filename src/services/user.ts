import { NotFoundError, InternalServerError,BadRequestError } from "../http_code/error-code";
import { User, CreateUserDTO, UpdateUserDTO } from "../entity/user";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isError(obj: unknown): obj is Error {
  return obj instanceof Error;
}

export default class UserService {

  private static async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    return existingUser !== null;
    }

  // Obtenir tous les utilisateurs
  static async getAllUsers(): Promise<User[]> {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw new InternalServerError(
        `Failed to retrieve users: ${(error as Error).message}`
      );
    }
  }

  // Obtenir un utilisateur par ID (UUID)
  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      return user;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      throw new InternalServerError(
        `Failed to retrieve user: ${(error as Error).message}`
      );
    }
  }

  // Créer un utilisateur
  static async createUser(data: CreateUserDTO): Promise<User> {
    try {
      // Vérifie si l'email existe déjà
      const emailExists = await this.isEmailTaken(data.email);
      if (emailExists) {
        throw new BadRequestError("EMAIL_ALREADY_EXISTS");
      }

      // Si l'email n'existe pas, créer l'utilisateur
      return await prisma.user.create({ data });
    } catch (error) {
      throw new InternalServerError(
        error instanceof Error ? error.message : "Unknown error while creating user"
      );
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw new InternalServerError(
        isError(error) ? error.message : "Unknown error while updating user"
      );
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id: string): Promise<string> {
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      await prisma.user.delete({ where: { id } });
      return `User with ID ${id} deleted successfully`;
    } catch (error) {
      throw new InternalServerError(
        isError(error) ? error.message : "Unknown error while deleting user"
      );
    }
  }

}
