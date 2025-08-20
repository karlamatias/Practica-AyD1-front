interface ConfirmModalProps {
    title: string;
    subtitle?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ title, subtitle, message, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-w-full pointer-events-auto">
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>

                {/* Subtítulo opcional */}
                {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}

                {/* Mensaje principal */}
                <p className="text-gray-700 mb-6">{message}</p>

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
