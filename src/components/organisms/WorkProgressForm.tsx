import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import { useState } from "react";
import type { Work } from "../../types/works";
import { jobsService } from "../../services/jobsService";
import Alert from "../atoms/Alert";

interface Props {
    work: Work;
    onSave: (updatedWork: Work) => void;
    onCancel: () => void;
}

export default function WorkProgressForm({ work, onSave, onCancel }: Props) {
    const [observations, setObservations] = useState("");
    const [hoursWorked, setHoursWorked] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const hours = Number(hoursWorked) || 0;

            await jobsService.registerProgress({
                maintenanceJobId: work.id,
                notes: observations,
                hoursWorked: hours,
            });

            onSave({ ...work, observations, estimatedTime: `${hours}h` });

            setAlert({ type: "success", message: "Progreso registrado correctamente" });
            setObservations("");
            setHoursWorked("");
        } catch (err) {
            console.error("Error al registrar progreso", err);
            setAlert({ type: "error", message: "No se pudo registrar el progreso" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">Registrar Avance - {work.vehicle}</h3>

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
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button onClick={onCancel} variant="secondary">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
