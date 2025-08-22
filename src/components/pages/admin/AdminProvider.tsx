import { useEffect, useState } from "react";
import type { CreateProviderDTO, Providers } from "../../../types/provider";
import { providerService } from "../../../services/providerService";
import AdminLayout from "../../templates/AdminLayout";
import Alert from "../../atoms/Alert";
import InputText from "../../atoms/InputText";
import Button from "../../atoms/Button";
import { FaPlus, FaSave } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../molecules/ConfirmModal";


export default function AdminProvider() {
    const [providers, setProvider] = useState<Providers[]>([]);
    const [form, setForm] = useState<Omit<Providers, "id">>({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Cargar proveedores
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const allProvideres = await providerService.getAllProverdes();
                setProvider(allProvideres);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los proveedores." });
            }
        };
        fetchProviders();
    }, []);

    // Detectar cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = providers.find(p => p.id === editingId);
            setHasChanges(original ? JSON.stringify(original) !== JSON.stringify(form) : false);
        }
    }, [form, editingId, providers]);

    // Validación
    const validateForm = (form: Omit<Providers, "id">, isEditing: boolean): string | null => {
        if (!form.name) return "El nombre es un campo obligatorio";
        if (!form.contactName) return "El campo Contacto es obligatorio.";
        if (!form.email) return "El campo Email es obligatorio.";
        if (!form.phone) return "El campo Telefono es obligatorio.";
        if (!form.address) return "El campo Direccion es obligatorio.";
        return null;
    };

    // Crear o actualizar proveedor
    const handleAddOrUpdateProvider = async () => {
        const errorMsg = validateForm(form, editingId !== null);
        if (errorMsg) {
            setAlert({ type: "error", message: errorMsg });
            return;
        }

        try {
            let provider: Providers;

            if (editingId !== null) {
                provider = await providerService.updateProvider(editingId, form);
                setProvider(providers.map(p => p.id === editingId ? provider : p));
                setAlert({ type: "success", message: `Proveedor "${provider.name}" actualizado correctamente.` });
                setEditingId(null);
            } else {
                provider = await providerService.createProvider(form as CreateProviderDTO);
                setProvider([...providers, provider]);
                setAlert({ type: "success", message: `Proveedor "${provider.name}" creado correctamente.` });
            }
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        } finally {
            setForm({ name: "", contactName: "", email: "", phone: "", address: "" });
            setHasChanges(false);
        }
    };

    // Eliminar proveedor
    const handleDeleteProvider = async () => {
        if (confirmDeleteId === null) return;
        try {
            await providerService.deleteProvider(confirmDeleteId);
            setProvider(providers.filter(p => p.id !== confirmDeleteId));
            setAlert({ type: "success", message: "Proveedor eliminado correctamente." });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error al eliminar el proveedor." });
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // Editar proveedor
    const handleEditClick = (provider: Providers) => {
        setEditingId(provider.id);
        setForm({
            name: provider.name,
            contactName: provider.contactName,
            email: provider.email,
            phone: provider.phone,
            address: provider.address
        });
    };

    // Función para limpiar formulario
    const resetForm = () => {
        setForm({ name: "", contactName: "", email: "", phone: "", address: "" });
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
            <h2 className="text-2xl font-bold mb-4">Proveedores</h2>

            {/* ALERTA */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}


            {/* FORMULARIO */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">
                    {editingId !== null ? "Editar proveedor" : "Agregar nuevo proveedor"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InputText label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <InputText label="Nombre del Contacto" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                    <InputText label="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputText label="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <InputText label="Direccion" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <Button
                    onClick={handleAddOrUpdateProvider}
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

            {/* TABLA DE PROVEEDORES */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Contacto</th>
                            <th className="px-4 py-2 text-left">Correo</th>
                            <th className="px-4 py-2 text-left">Telefono</th>
                            <th className="px-4 py-2 text-left">Direccion</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {providers.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2">{p.contactName}</td>
                                <td className="px-4 py-2">{p.email}</td>
                                <td className="px-4 py-2">{p.phone}</td>
                                <td className="px-4 py-2">{p.address}</td>
                                <td className="px-4 py-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditClick(p)}
                                        className="p-1 rounded hover:bg-yellow-200 text-yellow-600"
                                        title="Editar"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    {/*<button
                                        onClick={() => setConfirmDeleteId(p.id)}
                                        className="p-1 rounded hover:bg-red-200 text-red-600"
                                        title="Eliminar"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>*/}

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmDeleteId !== null && (
                <ConfirmModal
                    title="Eliminar proveedor"
                    subtitle="Esta acción no se puede deshacer"
                    message="¿Estás seguro que deseas eliminar este proveedor?"
                    onConfirm={handleDeleteProvider}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </AdminLayout>
    );
}
