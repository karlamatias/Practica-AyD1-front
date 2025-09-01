"use client";
import { useState } from "react";
import Button from "../atoms/Button";

interface ReviewJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (notes: string) => void;
}

export default function ReviewJobModal({
    isOpen,
    onClose,
    onSubmit,
}: ReviewJobModalProps) {
    const [notes, setNotes] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Enviar ayuda / notas</h2>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
                    rows={4}
                    placeholder="Escribe tu comentario o ayuda aquí..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <Button color="gray" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            onSubmit(notes);
                            setNotes("");
                            onClose();
                        }}
                    >
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
}
