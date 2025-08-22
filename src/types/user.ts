import type { Role } from "./role";

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleId: number;
}


export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password?: string;
    roleId?: number;
    role?: Role;
}
