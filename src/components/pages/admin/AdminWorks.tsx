import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";
import InputText from "../../atoms/InputText";
import { useState, useEffect } from "react";

interface Work {
    id: number;
    vehicle: string;
    type: string;
    status: string;
    assignedTo: string;
}

export default function AdminWorks() {
    const [works, setWorks] = useState<Work[]>([
        { id: 1, vehicle: "Toyota Corolla", type: "Preventivo", status: "Activo", assignedTo: "Juan Pérez" },
        { id: 2, vehicle: "Honda Civic", type: "Correctivo", status: "Finalizado", assignedTo: "María López" },
    ]);

    const [newWork, setNewWork] = useState<Omit<Work, "id" | "status">>({
        vehicle: "",
        type: "",
        assignedTo: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const original = works.find((w) => w.id === editingId);
            setHasChanges(
                original?.vehicle !== newWork.vehicle ||
                original?.type !== newWork.type ||
                original?.assignedTo !== newWork.assignedTo
            );
        }
    }, [newWork, editingId, works]);

    const handleAddOrUpdateWork = () => {
        if (!newWork.vehicle || !newWork.type || !newWork.assignedTo) return;

        if (editingId !== null) {
            // Actualizar trabajo existente
            setWorks(
                works.map((w) =>
                    w.id === editingId ? { ...w, ...newWork } : w
                )
            );
            setEditingId(null);
        } else {
            // Agregar nuevo trabajo
            const nextId = works.length > 0 ? Math.max(...works.map((w) => w.id)) + 1 : 1;
            setWorks([...works, { id: nextId, status: "Activo", ...newWork }]);
        }

        setNewWork({ vehicle: "", type: "", assignedTo: "" });
        setHasChanges(false);
    };

    const handleEditClick = (work: Work) => {
        setEditingId(work.id);
        setNewWork({
            vehicle: work.vehicle,
            type: work.type,
            assignedTo: work.assignedTo,
        });
    };

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Trabajos</h2>

            {/* Formulario */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    {editingId !== null ? "Editar trabajo" : "Agregar nuevo trabajo"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputText
                        label="Vehículo"
                        value={newWork.vehicle}
                        onChange={(e) => setNewWork({ ...newWork, vehicle: e.target.value })}
                    />
                    <InputText
                        label="Tipo de servicio"
                        value={newWork.type}
                        onChange={(e) => setNewWork({ ...newWork, type: e.target.value })}
                    />
                    <InputText
                        label="Asignado a"
                        value={newWork.assignedTo}
                        onChange={(e) => setNewWork({ ...newWork, assignedTo: e.target.value })}
                    />
                    <Button
                        onClick={handleAddOrUpdateWork}
                        variant="primary"
                        disabled={editingId !== null && !hasChanges}
                    >
                        {editingId !== null ? "Actualizar" : "Agregar"}
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Vehículo</th>
                            <th className="px-4 py-2 text-left">Tipo</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                            <th className="px-4 py-2 text-left">Asignado a</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {works.map((w) => (
                            <tr key={w.id}>
                                <td className="px-4 py-2">{w.vehicle}</td>
                                <td className="px-4 py-2">{w.type}</td>
                                <td className="px-4 py-2">{w.status}</td>
                                <td className="px-4 py-2">{w.assignedTo}</td>
                                <td className="px-4 py-2">
                                    <Button
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                                        onClick={() => handleEditClick(w)}
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
