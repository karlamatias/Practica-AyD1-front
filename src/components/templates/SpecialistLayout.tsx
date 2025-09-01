
import type { ReactNode } from "react";
import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";


interface SpecialistLayoutProps {
    children: ReactNode;
}

export default function SpecialistLayout({ children }: SpecialistLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar role="Especialista" />
            <div className="flex-1 flex flex-col">
                <Topbar title="Panel de Especialista" />
                <main className="p-6 bg-gray-100 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
