import { UserService, type CreateUserDTO } from "../../../services/userService";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import AdminLayout from "../../templates/AdminLayout";
import { useState, useEffect } from "react";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);

    const [form, setForm] = useState<Omit<User, "id">>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "empleado",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const original = users.find((u) => u.id === editingId);
            setHasChanges(
                original?.firstname !== form.firstname ||
                original?.lastname !== form.lastname ||
                original?.email !== form.email ||
                original?.phoneNumber !== form.phoneNumber ||
                original?.password !== form.password ||
                original?.role !== form.role
            );
        }
    }, [form, editingId, users]);

    const handleAddOrUpdateUser = async () => {
        if (!form.firstname || !form.lastname || !form.email || !form.phoneNumber || !form.password) return;

        if (editingId !== null) {
            // Actualizar usuario localmente
            setUsers(users.map((u) => u.id === editingId ? { ...u, ...form } : u));
            setEditingId(null);
        } else {
            // Agregar usuario
            try {
                const newUser: CreateUserDTO = {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    password: form.password,
                };
                const createdUser = await UserService.create(newUser);
                setUsers([...users, { ...createdUser, role: form.role }]);
            } catch (error: any) {
                console.error(error);
                alert(error.message);
            }
        }

        // Reset form
        setForm({ firstname: "", lastname: "", email: "", phoneNumber: "", password: "", role: "empleado" });
        setHasChanges(false);
    };

    const handleEditClick = (user: User) => {
        setEditingId(user.id);
        setForm({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: user.password,
            role: user.role || "empleado",
        });
    };

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">
                    {editingId !== null ? "Editar usuario" : "Agregar usuario"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                    <InputText label="Nombre" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
                    <InputText label="Apellido" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
                    <InputText label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputText label="Teléfono" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    <InputText label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Button
                        onClick={handleAddOrUpdateUser}
                        variant="primary"
                        disabled={editingId !== null && !hasChanges}
                    >
                        {editingId !== null ? "Actualizar" : "Agregar"}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Lista de usuarios</h3>
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="py-2 flex justify-between items-center">
                            <span>{user.firstname} {user.lastname} ({user.email})</span>
                            <Button className="bg-yellow-400 hover:bg-yellow-500 text-white" onClick={() => handleEditClick(user)}>
                                Editar
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminLayout>
    );
}
