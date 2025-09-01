
import type { ReactNode } from "react";
import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";


interface CustomerLayoutProps {
    children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar role="Cliente" />
            <div className="flex-1 flex flex-col">
                <Topbar title="Panel de Cliente" />
                <main className="p-6 bg-gray-100 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
