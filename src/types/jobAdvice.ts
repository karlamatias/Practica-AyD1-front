export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Employee {
  id: number;
  user: User;
  specialization: Specialization;
  status: string;
}

export interface Specialization {
  id: number;
  name: string;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  client: User;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  description: string;
  createdAt: string;
  createdBy: User;
}

export interface MaintenanceJob {
  id: number;
  vehicle: Vehicle;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: User;
  employeeAssigned?: Employee;
  status: string;
  jobType: string;
  parentJob?: string;
}

export interface JobAdvice {
  id: number;
  maintenanceJob: MaintenanceJob;
  requestedBy: Employee;
  reviewedBy?: Employee;
  description: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
