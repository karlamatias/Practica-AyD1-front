import type { JobAdvice } from "../types/jobAdvice";
import apiClient from "../utils/apiClient";

export const JobAdviceService = {
    getAllJobAdvice: async (): Promise<JobAdvice[]> => {
        const data = await apiClient("/job-advice");
        return data.content || [];
    },

    requestSupport: (maintenanceJobId: number, description: string) =>
        apiClient("/job-advice", {
            method: "POST",
            body: JSON.stringify({ maintenanceJobId, description }),
        }),

    updateJobAdvice: (id: number, data: Partial<JobAdvice>) =>
        apiClient(`/job-advice/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    reviewJobAdvice: (id: number, notes: string) =>
        apiClient(`/job-advice/review/${id}`, {
            method: "PUT",
            body: JSON.stringify({ notes }),
        }),
};
