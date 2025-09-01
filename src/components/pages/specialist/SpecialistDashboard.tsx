
import { useState, useEffect } from "react";
import type { JobAdvice } from "../../../types/jobAdvice";
import { JobAdviceService } from "../../../services/JobAdviceService";
import Button from "../../atoms/Button";
import ReviewJobModal from "../../molecules/ReviewJobModal";
import SpecialistLayout from "../../templates/SpecialistLayout";


export default function SpecialistDashboard() {
    const [jobs, setJobs] = useState<JobAdvice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<JobAdvice | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchJobs = async () => {
        try {
            const data = await JobAdviceService.getAllJobAdvice();
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (notes: string) => {
        if (!selectedJob) return;
        try {
            await JobAdviceService.reviewJobAdvice(selectedJob.id, notes);
            alert("Nota enviada correctamente");
            fetchJobs();
        } catch (error) {
            console.error(error);
            alert("Error al enviar la nota");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    if (loading) return <p className="text-center mt-10">Cargando solicitudes...</p>;

    return (
        <SpecialistLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Solicitudes de Apoyo</h1>

                {jobs.length === 0 && <p className="text-gray-600">No hay solicitudes pendientes.</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-lg transition-shadow">
                            <h2 className="font-semibold text-lg mb-1">
                                {job.maintenanceJob.vehicle.brand} {job.maintenanceJob.vehicle.model} ({job.maintenanceJob.vehicle.year})
                            </h2>
                            <p className="text-gray-600 text-sm mb-2">
                                Cliente: {job.maintenanceJob.vehicle.client.firstname} {job.maintenanceJob.vehicle.client.lastname}
                            </p>
                            <p className="text-gray-700 mb-2">Descripción: {job.description}</p>
                            <p className="text-gray-500 text-sm mb-2">
                                Estado: <span className="font-medium">{job.status}</span>
                            </p>
                            <div className="flex justify-end">
                                <Button
                                    color="primary"
                                    className="px-3 py-1 text-sm"
                                    onClick={() => {
                                        setSelectedJob(job);
                                        setModalOpen(true);
                                    }}
                                    disabled={job.status === "FINISH"}
                                >
                                    Atender
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <ReviewJobModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleReviewSubmit}
                />
            </div>
        </SpecialistLayout>
    );
}
