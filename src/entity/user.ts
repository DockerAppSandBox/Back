export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
  }
  
  export interface CreateUserDTO {
    email: string;
    password: string;
  }
  
  export interface UpdateUserDTO {
    password: string;
  }
  