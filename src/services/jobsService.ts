import type { CreateJobDTO, JobForm, JobsResponse } from "../types/jobs";
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

    getMyJobs: async (): Promise<JobsResponse> => {
        const data = await apiClient("/jobs/me");
        return data as JobsResponse;
    },

    changeStatus: (id: number, status: "PENDING" | "INPROGRESS" | "COMPLETED") =>
        apiClient(`/jobs/change-status/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),

    registerProgress: (data: { maintenanceJobId: number; notes: string; hoursWorked: number }) =>
        apiClient("/job-progress", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getJobProgress: async (jobId: number) => {
        const data = await apiClient(`/jobs/${jobId}/progress`);
        return data;
    },

    updateJobProgress: (id: number, data: { notes: string; hoursWorked: number }) =>
        apiClient(`/job-progress/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    deleteJobProgress: (id: number) =>
        apiClient(`/job-progress/${id}`, { method: "DELETE" }),

}