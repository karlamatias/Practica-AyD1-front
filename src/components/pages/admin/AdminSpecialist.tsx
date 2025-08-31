import { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import Alert from "../../atoms/Alert";
import AdminLayout from "../../templates/AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../molecules/ConfirmModal";
import { FaPlus, FaSave } from "react-icons/fa";
import { SpecializationService } from "../../../services/specializationService";
import type { Specialization } from "../../../types/specialization";

export default function AdminSpecialist() {
    const [specializations, setSpecialization] = useState<Specialization[]>([]);

    const [form, setForm] = useState<Omit<Specialization, "id">>({
        name: ""
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Validación de formulario
    const validateForm = (form: Omit<Specialization, "id">, isEditing: boolean): string | null => {
        if (!form.name) return "El campo Nombre es obligatorio.";
        return null;
    };

    // Cargar especialidad
    useEffect(() => {
        const fetchSpecialization = async () => {
            try {
                const allSpecialization = await SpecializationService.getAllSpecialization();
                setSpecialization(allSpecialization);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar las especialidades." });
            }
        };
        fetchSpecialization();
    }, []);

    // Detecta cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = specializations.find(s => s.id === editingId);
            setHasChanges(original ? JSON.stringify(original) !== JSON.stringify(form) : false);
        }
    }, [form, editingId, specializations]);

    // Crear o actualizar especializacion
    const handleAddOrUpdateSpecializations = async () => {
        const errorMsg = validateForm(form, editingId !== null);
        if (errorMsg) {
            setAlert({ type: "error", message: errorMsg });
            return;
        }

        try {
            let specialization: Specialization;

            if (editingId !== null) {
                specialization = await SpecializationService.updateSpecializations(editingId, form);
                setSpecialization(specializations.map(s => s.id === editingId ? specialization : s));
                setAlert({ type: "success", message: `Especialidad "${specialization.name}" actualizada correctamente.` });
                setEditingId(null);
            } else {
                specialization = await SpecializationService.createSpecialization(form as Specialization);
                setSpecialization([...specializations, specialization]);
                setAlert({ type: "success", message: `Especialidad "${specialization.name}" creada correctamente.` });
            }
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        } finally {
            setForm({ name: "" });
            setHasChanges(false);
        }
    };


    const handleDeleteSpecialization = async () => {
        if (confirmDeleteId === null) return;
        try {
            await SpecializationService.deleteSpecializations(confirmDeleteId);
            setSpecialization(specializations.filter(s => s.id !== confirmDeleteId));
            setAlert({ type: "success", message: "Especialidad eliminada correctamente." });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error al eliminar la especialidad." });
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleEditClick = (specialization: Specialization) => {
        setEditingId(specialization.id ?? null);
        setForm({
            name: specialization.name,
        });
    };

    const resetForm = () => {
        setForm({ name: "" });
        setEditingId(null);
        setHasChanges(false);
    };

    // Alerta automática
    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 2000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">{editingId !== null ? "Editar usuario" : "Agregar usuario"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    <InputText label="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                </div>

                <br />

                <Button
                    onClick={handleAddOrUpdateSpecializations}
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

            {/* Lista de especialidades */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Lista de especialidades</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nombre</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {specializations.map(specialization => (
                                <tr key={specialization.id}>
                                    <td className="px-4 py-2 text-sm text-gray-700">{specialization.name}</td>

                                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                                        <button onClick={() => handleEditClick(specialization)} className="p-1 rounded hover:bg-yellow-200 text-yellow-600" title="Editar">
                                            <FiEdit size={18} />
                                        </button>
                                        <button onClick={() => setConfirmDeleteId(specialization.id ?? null)} className="p-1 rounded hover:bg-red-200 text-red-600" title="Eliminar">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {confirmDeleteId !== null && (
                <ConfirmModal
                    title="Eliminar especialidad"
                    subtitle="Esta acción no se puede deshacer"
                    message="¿Estás seguro que deseas eliminar esta especialidad?"
                    onConfirm={handleDeleteSpecialization}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </AdminLayout>
    );
}
