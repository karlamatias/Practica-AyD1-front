import type { CreateJobDTO, Job, JobForm } from "../types/jobs";
import apiClient from "../utils/apiClient";

export const jobsService = {

    createJobs: (data: CreateJobDTO) => apiClient("/jobs", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getAllJobs: async () => {
        const data = await apiClient("/jobs");
        return data.content || [];
    },
    updateJobs: (id: number, data: Partial<JobForm>) => apiClient(`/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    deleteJobs: (id: number) => apiClient(`/jobs/${id}`, { method: "DELETE" }),
}