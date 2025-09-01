"use client";

import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import { useState, useEffect } from "react";

import { jobsService } from "../../services/jobsService";
import Alert from "../atoms/Alert";
import type { WorkWithProgress } from "../pages/employee/EmployeeJobs";

interface Props {
    work: WorkWithProgress;
    onSave: (updatedProgress: WorkWithProgress["progress"]) => void;
    onDelete?: () => void;
    onCancel: () => void;
}

export default function WorkProgressForm({ work, onSave, onDelete, onCancel }: Props) {
    const [observations, setObservations] = useState(work.progress?.notes || "");
    const [hoursWorked, setHoursWorked] = useState<string>(
        work.progress?.hoursWorked.toString() || ""
    );
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Sincronizar inputs si cambia el progreso desde afuera
    useEffect(() => {
        setObservations(work.progress?.notes || "");
        setHoursWorked(work.progress?.hoursWorked.toString() || "");
    }, [work.progress]);

    // Guardar o actualizar progreso
    const handleSave = async () => {
        setLoading(true);
        try {
            const hours = Number(hoursWorked) || 0;

            let updatedProgress;
            if (work.progress) {
                updatedProgress = await jobsService.updateJobProgress(work.progress.id, {
                    notes: observations,
                    hoursWorked: hours,
                });
            } else {

                updatedProgress = await jobsService.registerProgress({
                    maintenanceJobId: work.id,
                    notes: observations,
                    hoursWorked: hours,
                });
            }

            onSave(updatedProgress);
            setAlert({ type: "success", message: "Progreso guardado correctamente" });
        } catch (err) {
            console.error("Error al registrar progreso", err);
            setAlert({ type: "error", message: "No se pudo guardar el progreso" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!work.progress || !onDelete) return;
        setLoading(true);
        try {
            await jobsService.deleteJobProgress(work.progress.id);
            onDelete();
            setAlert({ type: "success", message: "Progreso eliminado correctamente" });
        } catch (err) {
            console.error("Error al eliminar progreso", err);
            setAlert({ type: "error", message: "No se pudo eliminar el progreso" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">Avance de trabajo - {work.vehicle}</h3>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <InputText
                    label="Observaciones"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                />
                <InputText
                    label="Horas trabajadas"
                    type="number"
                    value={hoursWorked}
                    placeholder="Ingrese horas..."
                    onChange={(e) => setHoursWorked(e.target.value)}
                />

                <div className="col-span-1 mt-2 flex gap-2">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Guardando..." : work.progress ? "Actualizar" : "Guardar"}
                    </Button>
                    {work.progress && onDelete && (
                        <Button onClick={handleDelete} disabled={loading}>
                            {loading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    )}
                    <Button onClick={onCancel} variant="secondary">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
