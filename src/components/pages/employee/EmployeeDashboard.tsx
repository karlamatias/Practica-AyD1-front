"use client";
import { useEffect, useState } from "react";
import WorkProgressForm from "../../organisms/WorkProgressForm";
import EmployeeLayout from "../../templates/EmployeeLayout";
import { jobsService } from "../../../services/jobsService";
import type { Job } from "../../../types/jobs";
import type { Work, WorkStatus} from "../../../types/works";
import WorkList from "../../templates/WorkList";
import { useJobsSocket } from "../../../hooks/useJobsSocket";

export default function EmployeeDashboard() {
    const [works, setWorks] = useState<Work[]>([]);
    const [currentWork, setCurrentWork] = useState<Work | null>(null);

    const { subscribeToUserJobs } = useJobsSocket();

    // Obtener userId desde sesión
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    function getEstimatedTime(startDate: string, endDate: string) {
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
    }

    // Mapear Job del backend a Work
    const mapJobToWork = (job: Job): Work => ({
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
    });

    // Fetch inicial de trabajos
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobsService.getMyJobs();
                const mappedWorks = data.content.map(mapJobToWork);
                setWorks(mappedWorks);
            } catch (err) {
                console.error("Error al cargar trabajos", err);
            }
        };

        fetchJobs();
    }, []);

    // Suscribirse a cambios de trabajos del usuario
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToUserJobs(userId, ({ action, job }) => {
            const mappedJob = mapJobToWork(job);

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

        return () => {
            unsubscribe();
        };

    }, [userId, subscribeToUserJobs]);

    const handleStart = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "INPROGRESS");
            setWorks((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, status: "En curso" as WorkStatus } : w
                )
            );
        } catch (err) {
            console.error("Error al iniciar trabajo", err);
        }
    };

    const handleProgress = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "INPROGRESS");
            setWorks((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, status: "En curso" as WorkStatus } : w
                )
            );
        } catch (err) {
            console.error("Error al marcar en curso", err);
        }
    };

    const handleFinish = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "COMPLETED");
            setWorks((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, status: "Finalizado" as WorkStatus } : w
                )
            );
        } catch (err) {
            console.error("Error al finalizar trabajo", err);
        }
    };

    const handleReportDamage = (id: number) => console.log("Reportar daños", id);
    const handleRequestSupport = (id: number) => console.log("Solicitar apoyo", id);
    const handleUseSparePart = (id: number) => console.log("Usar repuesto", id);
    const handleNotifyMaintenance = (id: number) =>
        console.log("Notificar mantenimiento", id);

    const historyWorks = works.filter((w) => w.status === "Finalizado");

    return (
        <EmployeeLayout>
            <h2 className="text-2xl font-bold mb-6">Mis Trabajos</h2>

            <WorkList
                works={works}
                onStart={handleStart}
                onFinish={handleFinish}
                onReportDamage={handleReportDamage}
                onRequestSupport={handleRequestSupport}
                onUseSparePart={handleUseSparePart}
                onNotifyMaintenance={handleNotifyMaintenance}
                onRegister={setCurrentWork}
            />

            {currentWork && (
                <WorkProgressForm
                    work={currentWork}
                    onSave={(updatedWork) =>
                        setWorks((prev) =>
                            prev.map((w) => (w.id === updatedWork.id ? updatedWork : w))
                        )
                    }
                    onCancel={() => setCurrentWork(null)}
                />
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Historial</h2>
            <WorkList works={historyWorks} />
        </EmployeeLayout>
    );
}
