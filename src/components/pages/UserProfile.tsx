"use client";

import { useEffect, useState } from "react";
import { UserService } from "../../services/userService";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    role: {
        id: number;
        name: string;
        description: string;
    };
    use2fa?: boolean;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await UserService.getMe();
                setUser(data);
            } catch (error) {
                console.error("Error al obtener perfil", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleToggle2FA = async () => {
        if (!user) return;
        try {
            setToggling(true);
            const newStatus = !user.use2fa
            await UserService.update2FA(newStatus);
            setUser({ ...user, use2fa: newStatus });
        } catch (error) {
            console.error("Error al cambiar estado 2FA", error);
        } finally {
            setToggling(false);
        }
    };

    if (loading) return <p>Cargando perfil...</p>;

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>
            {user && (
                <>
                    <p>
                        <strong>Nombre:</strong> {user.firstname} {user.lastname}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> {user.phoneNumber}
                    </p>
                    <p>
                        <strong>Rol:</strong> {user.role.name}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <span className="font-medium">Autenticación en dos pasos</span>

                        {/* Toggle deslizable */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={user.use2fa ?? true}
                                onChange={handleToggle2FA}
                                disabled={toggling}
                            />
                            <div
                                className={`w-14 h-7 rounded-full transition-colors duration-300 ${user.use2fa?? true ? "bg-green-600" : "bg-gray-400"
                                    }`}
                            ></div>
                            <div
                                className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${user.use2fa ?? true ? "translate-x-7" : "translate-x-0"
                                    }`}
                            ></div>
                        </label>
                    </div>
                </>
            )}
        </div>
    );
}
