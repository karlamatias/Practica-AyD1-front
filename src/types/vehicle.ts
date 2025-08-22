export interface CreateVehicleDTO {
    clientId: number
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    description: string;
}

export interface Vehicle {
    id: number;
    clientId: number;
    client?: {
        id: number;
        firstname: string;
        lastname: string;
        email?: string;
        phoneNumber?: string;
    };
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    description: string;
}