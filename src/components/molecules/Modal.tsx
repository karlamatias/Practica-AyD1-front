"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    // Cerrar modal al presionar Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       backdrop-blur-md"
            onClick={onClose} // cerrar al hacer click fuera
        >
            <div
                className="relative w-full max-w-md p-6 rounded-xl
                           bg-white/90 border border-gray-200
                           shadow-2xl"
                onClick={(e) => e.stopPropagation()} // evitar cerrar al hacer click dentro
            >
                {/* Botón de cerrar */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
