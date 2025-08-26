import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export interface CreateJobDTO {
    vehicleId: number
    employeeAssignedId: number;
    description: string;
    startDate: string;
    endDate: string;
    jobType: string;
}

export interface Specialization {
    id: number;
    name: string;
    createdAt: string;
}

export interface EmployeeAssigned {
    id: number;
    user: User;
    specialization: Specialization;
    status: "BUSY" | "AVAILABLE" | "OFFLINE";
}

export interface JobForm {
    id: number
    vehicleId: number
    employeeAssignedId: number;
    description: string;
    startDate: string;
    endDate: string;
    jobType: string;
};


export interface Job {
    id: number;
    vehicle: Vehicle;
    employeeAssigned: EmployeeAssigned;
    description: string;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    jobType: "CORRECTIVE" | "PREVENTIVE";
    createdAt: string;
    createdBy: User;
}