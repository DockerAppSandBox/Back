export interface RegisterUserDTO {
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string };
  token: string;
}