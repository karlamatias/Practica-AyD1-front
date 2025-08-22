
import type { ReactNode } from "react";
import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";


interface EmployeeLayoutProps {
    children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar role="Empleado" />
            <div className="flex-1 flex flex-col">
                <Topbar title="Panel de Empleado" />
                <main className="p-6 bg-gray-100 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
