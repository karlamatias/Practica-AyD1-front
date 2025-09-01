
export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface ClientVehicle {
    id: number;
    brand: string;
    model: string;
    licensePlate: string;
    year: number;
    jobs: ClientJob[];
}

export interface ClientJob {
    id: number;
    description: string;
    jobType: "PREVENTIVE" | "CORRECTIVE";
    status: "PENDING" | "INPROGRESS" | "COMPLETED";
    startDate: string;
    endDate: string;
    rating: {
        createdAt: string | null;
        ratingId: number | null;
        ratingValue: number | null;
        comment: string | null;
    };
    usages: any[];
}
