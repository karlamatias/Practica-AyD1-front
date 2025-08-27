import type { Specialization } from "./specialization";
import type { User } from "./user";

export interface EmployeeAssigned {
    id: number;
    user: User;
    specialization: Specialization;
    status: "BUSY" | "AVAILABLE" | "OFFLINE";
}