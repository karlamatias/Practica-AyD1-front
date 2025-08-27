import type { EmployeeAssigned } from "./employee";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface CreateJobDTO {
    vehicleId: number
    employeeAssignedId: number;
    description: string;
    startDate: string;
    endDate: string;
    jobType: string;
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
    startDate: string;
    endDate: string;
    status: "PENDING" | "INPROGRESS" | "COMPLETED";
    jobType: "CORRECTIVE" | "PREVENTIVE";
    createdAt: string;
    createdBy: User;
}
// Response del back
export type JobsResponse = PaginatedResponse<Job>;