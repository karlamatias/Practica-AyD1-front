import type { Role } from "./role";

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleId: number;
  providerId: number
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
  providerId: number
}


export interface Specialization {
  id: number;
  name: string;
  createdAt: string; // ISO string
}

export type EmployeeStatus = "AVAILABLE" | "BUSY" | "OFF"; // según posibles estados

export interface Employee {
  id: number;
  user: User;
  specialization: Specialization;
  status: EmployeeStatus;
}