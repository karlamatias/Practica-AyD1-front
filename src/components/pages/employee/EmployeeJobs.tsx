"use client";

import { useEffect, useState } from "react";
import WorkProgressForm from "../../organisms/WorkProgressForm";
import EmployeeLayout from "../../templates/EmployeeLayout";
import { jobsService } from "../../../services/jobsService";
import type { Job } from "../../../types/jobs";
import type { Work, WorkStatus } from "../../../types/works";
import WorkList from "../../templates/WorkList";
import { useJobsSocket } from "../../../hooks/useJobsSocket";

export type WorkWithProgress = Work & {
    progress?: {
        id: number;
        maintenanceJobId: number;
        createdBy: {
            id: number;
            firstname: string;
            lastname: string;
            email: string;
            phoneNumber: string;
        };
        notes: string;
        hoursWorked: number;
        createdAt: string;
    };
};

export default function EmployeeJobs() {
    const [works, setWorks] = useState<WorkWithProgress[]>([]);
    const [currentWork, setCurrentWork] = useState<WorkWithProgress | null>(null);

    const { subscribeToUserJobs } = useJobsSocket();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    const getEstimatedTime = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime();
        const diffMinutes = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return hours > 0 && minutes > 0
            ? `${hours}h ${minutes}m`
            : hours > 0
                ? `${hours}h`
                : `${minutes}m`;
    };

    // Mapear Job a Work + progreso
    const mapJobToWork = async (job: Job): Promise<WorkWithProgress> => {
        let rawProgress;
        try {
            rawProgress = await jobsService.getJobProgress(job.id);
        } catch {
            rawProgress = undefined;
        }

        // Normalizar progreso: tomar el primer item si existe, sino undefined
        const progress =
            rawProgress && "content" in rawProgress && rawProgress.content.length > 0
                ? rawProgress.content[0]
                : undefined;

        return {
            id: job.id,
            vehicle: `${job.vehicle.brand} ${job.vehicle.model} (${job.vehicle.licensePlate})`,
            type: job.jobType === "CORRECTIVE" ? "Correctivo" : "Preventivo",
            status:
                job.status === "PENDING"
                    ? "Asignado"
                    : job.status === "INPROGRESS"
                        ? "En curso"
                        : "Finalizado",
            estimatedTime: getEstimatedTime(job.startDate, job.endDate),
            observations: job.description,
            progress,
        };
    };

    // Fetch inicial de trabajos
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobsService.getMyJobs();
                const mappedWorks = await Promise.all(data.content.map(mapJobToWork));
                setWorks(mappedWorks);
            } catch (err) {
                console.error("Error al cargar trabajos", err);
            }
        };
        fetchJobs();
    }, []);

    // Suscripción a cambios en tiempo real
    useEffect(() => {
        if (!userId) return;
        const unsubscribe = subscribeToUserJobs(userId, async ({ action, job }) => {
            const mappedJob = await mapJobToWork(job);
            setWorks((prev) => {
                switch (action) {
                    case "created":
                        if (prev.some((w) => w.id === mappedJob.id)) return prev;
                        return [...prev, mappedJob];
                    case "updated":
                        return prev.map((w) => (w.id === mappedJob.id ? mappedJob : w));
                    case "deleted":
                        return prev.filter((w) => w.id !== mappedJob.id);
                    default:
                        return prev;
                }
            });
        });
        return () => unsubscribe();
    }, [userId, subscribeToUserJobs]);

    const handleStart = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "INPROGRESS");
            setWorks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: "En curso" as WorkStatus } : w))
            );
        } catch (err) {
            console.error("Error al iniciar trabajo", err);
        }
    };

    const handleFinish = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "COMPLETED");
            setWorks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: "Finalizado" as WorkStatus } : w))
            );
        } catch (err) {
            console.error("Error al finalizar trabajo", err);
        }
    };

    const handleEditProgress = (updatedProgress: WorkWithProgress["progress"]) => {
        if (!updatedProgress) return;
        setWorks((prev) =>
            prev.map((w) =>
                w.id === updatedProgress.maintenanceJobId ? { ...w, progress: updatedProgress } : w
            )
        );
    };

    const handleDeleteProgress = async (progressId: number) => {
        try {
            await jobsService.deleteJobProgress(progressId);
            setWorks((prev) =>
                prev.map((w) =>
                    w.progress?.id === progressId ? { ...w, progress: undefined } : w
                )
            );
        } catch (err) {
            console.error("Error al eliminar progreso", err);
        }
    };

    const historyWorks = works.filter((w) => w.status === "Finalizado");

    const handleRequestSupport = (id: number) => { };
    const handleReportDamage = (id: number) => { };
    
    return (
        <EmployeeLayout>
            <h2 className="text-2xl font-bold mb-6">Mis Trabajos</h2>

            <WorkList
                works={works}
                onStart={handleStart}
                onFinish={handleFinish}
                onRegister={setCurrentWork}
                onRequestSupport={handleRequestSupport}
                onReportDamage={handleReportDamage}
            />

            {currentWork && (
                <WorkProgressForm
                    work={currentWork}
                    onSave={handleEditProgress}
                    onDelete={() =>
                        currentWork.progress ? handleDeleteProgress(currentWork.progress.id) : undefined
                    }
                    onCancel={() => setCurrentWork(null)}
                />
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Historial</h2>
            <WorkList works={historyWorks} />
        </EmployeeLayout>
    );
}
