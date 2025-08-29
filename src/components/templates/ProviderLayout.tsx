
import type { ReactNode } from "react";
import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";


interface ProviderLayoutProps {
    children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar role="Proveedor" />
            <div className="flex-1 flex flex-col">
                <Topbar title="Panel de Proveedor" />
                <main className="p-6 bg-gray-100 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
