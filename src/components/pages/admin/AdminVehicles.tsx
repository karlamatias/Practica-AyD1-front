import { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import AdminLayout from "../../templates/AdminLayout";
import ConfirmModal from "../../molecules/ConfirmModal";
import type { Vehicle, CreateVehicleDTO } from "../../../types/vehicle";
import { vehicleService } from "../../../services/vehicleService";
import { UserService } from "../../../services/userService";
import type { User } from "../../../types/user";
import { UserRoleId } from "../../../constants/roles";
import Select from "react-select";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSave } from "react-icons/fa";
import Alert from "../../atoms/Alert";

export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [form, setForm] = useState<Omit<Vehicle, "id"> & { clientId: number }>({
        clientId: 0,
        brand: "",
        model: "",
        year: 0,
        licensePlate: "",
        description: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const allUsers: User[] = await UserService.getAll();

                // Filtrar solo los clientes
                const clientsOnly = allUsers.filter(u => u.role?.id === UserRoleId.CUSTOMER);
                console.log("Clientes filtrados:", clientsOnly);

                setClients(clientsOnly);
            } catch (error: any) {
                console.error("Error al cargar clientes:", error.message || error);
            }
        };
        fetchClients();
    }, []);

    // Cargar vehículos
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const allVehicles = await vehicleService.getAllVehicle();
                setVehicles(allVehicles);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los vehículos." });
            }
        };
        fetchVehicles();
    }, []);

    // Detectar cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = vehicles.find(v => v.id === editingId);
            setHasChanges(original ? JSON.stringify(original) !== JSON.stringify(form) : false);
        }
    }, [form, editingId, vehicles]);

    // Validación
    const validateForm = (form: Omit<Vehicle, "id">, isEditing: boolean): string | null => {
        if (!form.clientId) return "Debes seleccionar un cliente.";
        if (!form.brand) return "El campo Marca es obligatorio.";
        if (!form.model) return "El campo Modelo es obligatorio.";
        if (!form.year) return "El campo Año es obligatorio.";
        if (!form.licensePlate) return "El campo Placa es obligatorio.";
        if (!form.description) return "El campo Descripción es obligatorio.";
        return null;
    };

    // Crear o actualizar vehículo
    const handleAddOrUpdateVehicle = async () => {
        const errorMsg = validateForm(form, editingId !== null);
        if (errorMsg) {
            setAlert({ type: "error", message: errorMsg });
            return;
        }

        try {
            let vehicle: Vehicle;

            if (editingId !== null) {
                vehicle = await vehicleService.updateVehicle(editingId, form);
                setVehicles(vehicles.map(v => v.id === editingId ? vehicle : v));
                setAlert({ type: "success", message: `Vehículo "${vehicle.brand}" actualizado correctamente.` });
                setEditingId(null);
            } else {
                vehicle = await vehicleService.createVehicle(form as CreateVehicleDTO);
                setVehicles([...vehicles, vehicle]);
                setAlert({ type: "success", message: `Vehículo "${vehicle.brand}" creado correctamente.` });
            }
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        } finally {
            setForm({ clientId: 0, brand: "", model: "", year: 0, licensePlate: "", description: "" });
            setHasChanges(false);
        }
    };

    // Eliminar vehículo
    const handleDeleteVehicle = async () => {
        if (confirmDeleteId === null) return;
        try {
            await vehicleService.deleteVehicle(confirmDeleteId);
            setVehicles(vehicles.filter(v => v.id !== confirmDeleteId));
            setAlert({ type: "success", message: "Vehículo eliminado correctamente." });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error al eliminar el vehículo." });
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // Editar vehículo
    const handleEditClick = (vehicle: Vehicle) => {
        setEditingId(vehicle.id);
        setForm({
            clientId: vehicle.client?.id || 0,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
            description: vehicle.description
        });
    };

    // Función para limpiar formulario
    const resetForm = () => {
        setForm({ clientId: 0, brand: "", model: "", year: 0, licensePlate: "", description: "" });
        setEditingId(null);
        setHasChanges(false);
    };

    // Al mostrar la alerta, la cerramos automáticamente
    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 2000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Vehículos</h2>

            {/* ALERTA */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}


            {/* FORMULARIO */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">
                    {editingId !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InputText label="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                    <InputText label="Modelo" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                    <InputText
                        label="Año"
                        value={form.year === 0 ? "" : form.year}
                        type="number"
                        onChange={(e) =>
                            setForm({ ...form, year: e.target.value ? Number(e.target.value) : 0 })
                        }
                    />
                    <InputText label="Placa" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} />
                    <InputText label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <div className="col-span-1 md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <Select
                            options={clients.map(c => ({
                                value: c.id,
                                label: `${c.firstname} ${c.lastname}`
                            }))}
                            value={clients
                                .filter(c => c.id === form.clientId)
                                .map(c => ({ value: c.id, label: `${c.firstname} ${c.lastname}` }))[0] || null
                            }
                            onChange={(selected) => setForm({ ...form, clientId: selected?.value || 0 })}
                            placeholder="Selecciona un cliente"
                            isClearable
                        />
                    </div>
                </div>
                <Button
                    onClick={handleAddOrUpdateVehicle}
                    disabled={editingId !== null && !hasChanges}
                    className={`
                        flex items-center gap-2 px-5 py-2 rounded-lg
                        text-white font-semibold shadow-md
                        transition-all duration-200
                        ${editingId !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    {editingId !== null ? <FaSave /> : <FaPlus />}
                    {editingId !== null ? "Actualizar" : "Agregar"}
                </Button>

                {editingId !== null && (
                    <Button
                        onClick={resetForm}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black font-semibold shadow-md transition-all duration-200"
                    >
                        Cancelar
                    </Button>
                )}
            </div>

            {/* TABLA DE VEHÍCULOS */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Cliente</th>
                            <th className="px-4 py-2 text-left">Marca</th>
                            <th className="px-4 py-2 text-left">Modelo</th>
                            <th className="px-4 py-2 text-left">Placa</th>
                            <th className="px-4 py-2 text-left">Año</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vehicles.map(v => (
                            <tr key={v.id}>
                                <td className="px-4 py-2">
                                    {v.client ? `${v.client.firstname} ${v.client.lastname}` : "-"}
                                </td>
                                <td className="px-4 py-2">{v.brand}</td>
                                <td className="px-4 py-2">{v.model}</td>
                                <td className="px-4 py-2">{v.licensePlate}</td>
                                <td className="px-4 py-2">{v.year}</td>
                                <td className="px-4 py-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditClick(v)}
                                        className="p-1 rounded hover:bg-yellow-200 text-yellow-600"
                                        title="Editar"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(v.id)}
                                        className="p-1 rounded hover:bg-red-200 text-red-600"
                                        title="Eliminar"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmDeleteId !== null && (
                <ConfirmModal
                    title="Eliminar vehículo"
                    subtitle="Esta acción no se puede deshacer"
                    message="¿Estás seguro que deseas eliminar este vehículo?"
                    onConfirm={handleDeleteVehicle}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </AdminLayout>
    );
}
