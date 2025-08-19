import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiChartBar, HiCube, HiHome, HiMenu, HiTruck, HiUsers, HiX } from "react-icons/hi";
import { HiWrench } from "react-icons/hi2";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const links = [
        { name: "Dashboard", path: "/dashboard/admin", icon: <HiHome /> },
        { name: "Vehículos", path: "/dashboard/admin/vehicles", icon: <HiTruck /> },
        { name: "Usuarios", path: "/dashboard/admin/users", icon: <HiUsers /> },
        { name: "Inventario", path: "/dashboard/admin/inventory", icon: <HiCube /> },
        { name: "Trabajos", path: "/dashboard/admin/works", icon: <HiWrench /> },
        { name: "Reportes", path: "/dashboard/admin/reports", icon: <HiChartBar /> },
    ];

    return (
        <aside
            className={`bg-white shadow-lg p-4 flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                }`}
        >
            {/* Botón hamburguesa */}
            <button
                className="mb-6 self-end text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            {/* Logo / Título */}
            {isOpen && <h2 className="text-xl font-bold mb-6">Taller Admin</h2>}

            <nav className="flex flex-col space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg hover:bg-blue-100 ${isActive ? "bg-blue-200 font-semibold" : ""
                            }`
                        }
                    >
                        <span className="text-lg">{link.icon}</span>
                        {isOpen && <span className="ml-2">{link.name}</span>}
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
}
