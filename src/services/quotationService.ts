import type { CreateQuotationDTO } from "../types/quotation";
import apiClient from "../utils/apiClient";

export const quotationService = {

    getAllQuotation: async () => {
        const data = await apiClient("/quotation_requests");
        return data.content || [];
    },
    createQuotation: (data: CreateQuotationDTO) => apiClient("/quotation_requests", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    closeProvider: (id: number) => apiClient(`/quotation_requests/close/${id}`, { method: "PUT" }),
    cancelProvider: (id: number) => apiClient(`/quotation_requests/cancel/${id}`, { method: "PUT" }),
}