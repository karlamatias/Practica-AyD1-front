import type { Specialization } from "../types/specialization";
import apiClient from "../utils/apiClient";

export const SpecializationService = {
    createSpecialization: (data: Specialization) => apiClient("/specializations", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getAllSpecialization: async () => {
        const data = await apiClient("/specializations");
        return data.content || [];
    },
    updateSpecializations: (id: number, data: Partial<Specialization>) => apiClient(`/specializations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    deleteSpecializations: (id: number) => apiClient(`/specializations/${id}`, { method: "DELETE" }),
};
