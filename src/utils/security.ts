import bcrypt from 'bcryptjs';
import {
    InternalServerError,
  } from "../http_code/error-code";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
      } catch (error) {
        throw new InternalServerError("Error hashing password");
      }
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new InternalServerError("Error verifying password");
    }
};