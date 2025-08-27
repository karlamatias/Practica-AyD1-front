"use client";
import { useEffect, useState } from "react";
import WorkProgressForm from "../../organisms/WorkProgressForm";
import EmployeeLayout from "../../templates/EmployeeLayout";
import { jobsService } from "../../../services/jobsService";
import type { Job } from "../../../types/jobs";
import type { Work } from "../../../types/works";
import WorkList from "../../templates/WorkList";

export default function EmployeeDashboard() {
    const [works, setWorks] = useState<Work[]>([]);
    const [currentWork, setCurrentWork] = useState<Work | null>(null);

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

    // 🔹 Fetch inicial
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobsService.getMyJobs();
                const mappedWorks: Work[] = data.content.map((job: Job) => ({
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
                }));
                setWorks(mappedWorks);
            } catch (err) {
                console.error("Error al cargar trabajos", err);
            }
        };

        fetchJobs();
    }, []);

    // 🔹 Handlers que llaman al endpoint /change-status/:id
    const handleStart = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "INPROGRESS");
            setWorks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: "En curso" } : w))
            );
        } catch (err) {
            console.error("Error al iniciar trabajo", err);
        }
    };

    const handleProgress = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "INPROGRESS");
            setWorks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: "En curso" } : w))
            );
        } catch (err) {
            console.error("Error al marcar en curso", err);
        }
    };

    const handleFinish = async (id: number) => {
        try {
            await jobsService.changeStatus(id, "COMPLETED");
            setWorks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: "Finalizado" } : w))
            );
        } catch (err) {
            console.error("Error al finalizar trabajo", err);
        }
    };

    // Otros handlers de acciones adicionales
    const handleReportDamage = (id: number) => console.log("Reportar daños", id);
    const handleRequestSupport = (id: number) => console.log("Solicitar apoyo", id);
    const handleUseSparePart = (id: number) => console.log("Usar repuesto", id);
    const handleNotifyMaintenance = (id: number) => console.log("Notificar mantenimiento", id);

    const assignedWorks = works.filter((w) => w.status !== "Finalizado");
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
