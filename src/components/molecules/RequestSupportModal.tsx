"use client";
import { useState } from "react";
import Button from "../atoms/Button";
import { SpecializationService } from "../../services/specializationService";

interface RequestSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    maintenanceJobId: number;
    onSuccess?: (message: string) => void;
}

export default function RequestSupportModal({
    isOpen,
    onClose,
    onSuccess,
    maintenanceJobId,
}: RequestSupportModalProps) {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {

        setLoading(true);
        try {
            await SpecializationService.useSparePart(maintenanceJobId, description);
            onSuccess?.("Solicitud de apoyo registrada correctamente");
            onClose();
        } catch (err) {
            console.error(err);
            onSuccess?.("No se pudo registrar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Solicitar apoyo</h2>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
                    rows={4}
                    placeholder="Describe la asistencia que necesitas..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <Button color="gray" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="purple"
                        onClick={handleSubmit}
                    >
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
}
