import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";
import { useState, useEffect } from "react";
import InputText from "../../atoms/InputText";

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    plate: string;
    service: string;
    description?: string;
}

export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        { id: 1, brand: "Toyota", model: "Corolla", plate: "P1234", service: "Preventivo" },
        { id: 2, brand: "Honda", model: "Civic", plate: "H5678", service: "Correctivo" },
    ]);

    // Estado formulario
    const [form, setForm] = useState<Omit<Vehicle, "id">>({
        brand: "",
        model: "",
        plate: "",
        service: "",
        description: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const original = vehicles.find((v) => v.id === editingId);
            setHasChanges(
                original?.brand !== form.brand ||
                original?.model !== form.model ||
                original?.plate !== form.plate ||
                original?.service !== form.service ||
                original?.description !== form.description
            );
        }
    }, [form, editingId, vehicles]);

    const handleAddOrUpdateVehicle = () => {
        if (!form.brand || !form.model || !form.plate || !form.service) return;

        if (editingId !== null) {
            // Actualizar
            setVehicles(vehicles.map((v) => v.id === editingId ? { ...v, ...form } : v));
            setEditingId(null);
        } else {
            // Agregar
            const newVehicle: Vehicle = { id: Date.now(), ...form };
            setVehicles([...vehicles, newVehicle]);
        }

        setForm({ brand: "", model: "", plate: "", service: "", description: "" });
        setHasChanges(false);
    };

    const handleEditClick = (v: Vehicle) => {
        setEditingId(v.id);
        setForm({
            brand: v.brand,
            model: v.model,
            plate: v.plate,
            service: v.service,
            description: v.description || "",
        });
    };

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Vehículos</h2>

            {/* Formulario */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">
                    {editingId !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InputText label="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                    <InputText label="Modelo" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                    <InputText label="Placa" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
                    <InputText label="Servicio" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
                    <InputText label="Descripción problema" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <Button
                    onClick={handleAddOrUpdateVehicle}
                    variant="primary"
                    disabled={editingId !== null && !hasChanges}
                >
                    {editingId !== null ? "Actualizar" : "Agregar vehículo"}
                </Button>
            </div>

            {/* Tabla */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Marca</th>
                            <th className="px-4 py-2 text-left">Modelo</th>
                            <th className="px-4 py-2 text-left">Placa</th>
                            <th className="px-4 py-2 text-left">Servicio</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vehicles.map((v) => (
                            <tr key={v.id}>
                                <td className="px-4 py-2">{v.brand}</td>
                                <td className="px-4 py-2">{v.model}</td>
                                <td className="px-4 py-2">{v.plate}</td>
                                <td className="px-4 py-2">{v.service}</td>
                                <td className="px-4 py-2">
                                    <Button
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                                        onClick={() => handleEditClick(v)}
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
