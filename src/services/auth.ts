import prisma from '../config/database';
import { RegisterUserDTO, LoginUserDTO, AuthResponse } from '../entity/auth';
import UserService from './user';
import generateToken from '../utils/auth';
import { NotFoundError, BadRequestError } from '../http_code/error-code';
import { hashPassword, verifyPassword } from '../utils/security';

export class AuthService {
  static async register(data: RegisterUserDTO): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new BadRequestError('Email already in use');

    const hashedPassword = await hashPassword(data.password)
    const newUser = await UserService.createUser({
      email: data.email,
      password: hashedPassword,
    });
    const token = generateToken({ id: newUser.id});
    return { user: { id: newUser.id, email: newUser.email }, token };
  }

  static async login(data: LoginUserDTO): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new NotFoundError('Invalid email or password');

    const isValidPassword = await verifyPassword(data.password, user.password)
    if (!isValidPassword) throw new BadRequestError('Invalid email or password');

    const token = generateToken({ id: user.id});
    return { user: { id: user.id, email: user.email }, token };
  }
}
