import type { CreateProviderDTO } from "../types/provider";
import apiClient from "../utils/apiClient";

export const providerService = {

    createProvider: (data: CreateProviderDTO) => apiClient("/providers", {
        method: "POST",
        body: JSON.stringify(data),
    }),

    getAllProverdes: async () => {
        const data = await apiClient("/providers");
        return data.content || [];
    },

    updateProvider: (id: number, data: Partial<CreateProviderDTO>) => apiClient(`/providers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    deleteProvider: (id: number) => apiClient(`/providers/${id}`, { method: "DELETE" }),
}