import type { CreateVehicleDTO, Vehicle } from "../types/vehicle";
import apiClient from "../utils/apiClient";

export const vehicleService = {

    createVehicle: (data: CreateVehicleDTO) => apiClient("/vehicles", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getAllVehicle: async () => {
        const data = await apiClient("/vehicles");
        return data.content || [];
    },
    updateVehicle: (id: number, data: Partial<Vehicle>) => apiClient(`/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    deleteVehicle: (id: number) => apiClient(`/vehicles/${id}`, { method: "DELETE" }),
}