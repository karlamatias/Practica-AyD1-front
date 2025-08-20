import { useState, useEffect } from "react";
import { UserRoleId } from "../../../constants/roles";
import { UserService, type CreateUserDTO } from "../../../services/userService";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import Alert from "../../atoms/Alert";
import AdminLayout from "../../templates/AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../molecules/ConfirmModal";
import { FaPlus, FaSave } from "react-icons/fa";

interface Role {
    id: number;
    name: string;
    description?: string;
}

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password?: string;
    roleId?: number;
    role?: Role;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState<Omit<User, "id">>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleId: UserRoleId.EMPLOYEE,
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Cargar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await UserService.getAll();
                setUsers(allUsers);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los usuarios." });
            }
        };
        fetchUsers();
    }, []);


    // Detecta cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = users.find((u) => u.id === editingId);
            setHasChanges(
                original?.firstname !== form.firstname ||
                original?.lastname !== form.lastname ||
                original?.email !== form.email ||
                original?.phoneNumber !== form.phoneNumber ||
                original?.password !== form.password ||
                original?.roleId !== form.roleId
            );
        }
    }, [form, editingId, users]);

    const handleAddOrUpdateUser = async () => {
        // Validar campos requeridos y mostrar alerta específica
        if (!form.firstname) {
            setAlert({ type: "error", message: "El campo Nombre es obligatorio." });
            return;
        }
        if (!form.lastname) {
            setAlert({ type: "error", message: "El campo Apellido es obligatorio." });
            return;
        }
        if (!form.email) {
            setAlert({ type: "error", message: "El campo Email es obligatorio." });
            return;
        }
        if (!form.phoneNumber) {
            setAlert({ type: "error", message: "El campo Teléfono es obligatorio." });
            return;
        }
        if (!form.password && editingId === null) {
            setAlert({ type: "error", message: "El campo Contraseña es obligatorio para un nuevo usuario." });
            return;
        }
        if (!form.roleId) {
            setAlert({ type: "error", message: "El campo Rol es obligatorio." });
            return;
        }

        try {
            if (editingId !== null) {
                const payload: any = {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    roleId: form.roleId,
                };
                if (form.password) payload.password = form.password;

                // Llamada al backend
                const updatedUser = await UserService.update(editingId, payload);

                // Actualizar tabla solo con la respuesta real
                setUsers(users.map(u =>
                    u.id === editingId ? updatedUser : u
                ));

                setAlert({ type: "success", message: `Usuario "${updatedUser.firstname} ${updatedUser.lastname}" actualizado correctamente.` });
                setEditingId(null);
            } else {
                // Crear nuevo usuario
                const newUser: CreateUserDTO = {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    password: form.password!,
                    roleId: form.roleId,
                };
                const createdUser = await UserService.create(newUser);

                setUsers([...users, createdUser]);
                setAlert({ type: "success", message: `Usuario "${createdUser.firstname} ${createdUser.lastname}" creado correctamente.` });
            }
        } catch (error: any) {
            console.error(error);
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        }


        setForm({ firstname: "", lastname: "", email: "", phoneNumber: "", password: "", roleId: UserRoleId.EMPLOYEE });
        setHasChanges(false);
    };


    const handleDeleteUser = async () => {
        if (confirmDeleteId === null) return;
        try {
            await UserService.delete(confirmDeleteId);
            setUsers(users.filter(u => u.id !== confirmDeleteId));
            setAlert({ type: "success", message: "Usuario eliminado correctamente." });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error al eliminar el usuario." });
        } finally {
            setConfirmDeleteId(null);
        }
    };


    const handleEditClick = (user: User) => {
        setEditingId(user.id);
        setForm({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: "",
            roleId: user.roleId || UserRoleId.EMPLOYEE,
        });
    };

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

            {/* ALERTA */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            {/* FORMULARIO */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">
                    {editingId !== null ? "Editar usuario" : "Agregar usuario"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    <InputText label="Nombre" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
                    <InputText label="Apellido" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
                    <InputText label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputText label="Teléfono" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    <InputText label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <select
                        value={form.roleId}
                        onChange={(e) => setForm({ ...form, roleId: Number(e.target.value) })}
                        className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value={UserRoleId.ADMIN}>Administrador</option>
                        <option value={UserRoleId.EMPLOYEE}>Empleado</option>
                        <option value={UserRoleId.SPECIALIST}>Especialista</option>
                        <option value={UserRoleId.CUSTOMER}>Cliente</option>
                        <option value={UserRoleId.SUPPLIER}>Proveedor</option>
                    </select>

                </div>
                <br></br>
                <Button
                    onClick={handleAddOrUpdateUser}
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
            </div>

            {/* LISTA DE USUARIOS */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Lista de usuarios</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nombre</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Apellido</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Teléfono</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rol</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 text-sm text-gray-700">{user.firstname}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{user.lastname}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{user.phoneNumber}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{user.role?.name || "Empleado"}</td>
                                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-1 rounded hover:bg-yellow-200 text-yellow-600"
                                            title="Editar"
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(user.id)}
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
            </div>

            {confirmDeleteId !== null && (
                <ConfirmModal
                    title="Eliminar usuario"
                    subtitle="Esta acción no se puede deshacer"
                    message="¿Estás seguro que deseas eliminar este usuario?"
                    onConfirm={handleDeleteUser}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}

        </AdminLayout>


    );
}
