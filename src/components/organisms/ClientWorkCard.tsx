"use client";

import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import type { ClientJob } from "../../types/client";
import { FiThumbsUp, FiMessageSquare, FiCreditCard, FiDownload } from "react-icons/fi";
import { paymentService } from "../../services/paymentService";

interface PaymentMethod {
    id: number;
    name: string;
    description: string;
}

interface ClientWorkCardProps extends ClientJob {
    vehicle: string;
    onApproveService?: (workId: number) => void;
    onLeaveReview?: (rating: number, workId: number, comment: string) => void;
    onMakePayment?: (workId: number, amount: number, paymentMethodId: number) => void;
    onDownloadInvoice?: (workId: number) => void;
}

export default function ClientWorkCard({
    id,
    vehicle,
    jobType,
    status,
    description,
    onApproveService,
    onLeaveReview,
    onMakePayment,
    onDownloadInvoice,
}: ClientWorkCardProps) {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [reviewStars, setReviewStars] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<string>("");

    const typeLabel = jobType === "PREVENTIVE" ? "Preventivo" : "Correctivo";
    const statusLabel =
        status === "PENDING" ? "Asignado" : status === "INPROGRESS" ? "En curso" : "Finalizado";

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const methods = await paymentService.getAllPayment();
                setPaymentMethods(methods);
                if (methods.length > 0) setSelectedPaymentMethod(methods[0].id);
            } catch (err) {
                console.error("Error cargando métodos de pago", err);
            }
        };
        fetchPaymentMethods();
    }, []);

    const handleSubmitReview = () => {
        if (reviewStars < 1) return alert("Selecciona al menos una estrella");
        onLeaveReview?.(reviewStars, id, reviewComment);
        setShowReviewModal(false);
        setReviewStars(0);
        setReviewComment("");
    };



    return (
        <div className="flex justify-between items-center p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{vehicle}</p>
                <p className="text-gray-600 text-xs">{typeLabel} - {statusLabel}</p>
                {description && <p className="text-gray-500 italic text-xs truncate">{description}</p>}
            </div>

            <div className="flex gap-1 md:flex-col md:gap-1 ml-3">
                {onApproveService && (
                    <Button
                        onClick={() => onApproveService(id)}
                        color="green"
                        icon={<FiThumbsUp className="w-4 h-4" />}
                        className="p-1 rounded-full"
                        title="Aprobar"
                    />
                )}

                {onLeaveReview && (
                    <Button
                        onClick={() => setShowReviewModal(true)}
                        color="blue"
                        icon={<FiMessageSquare className="w-4 h-4" />}
                        className="p-1 rounded-full"
                        title="Review"
                    />
                )}

                {onMakePayment && (
                    <Button
                        onClick={() => setShowPaymentModal(true)}
                        color="yellow"
                        icon={<FiCreditCard className="w-4 h-4" />}
                        className="p-1 rounded-full"
                        title="Pagar"
                    />
                )}

                {onDownloadInvoice && (
                    <Button
                        onClick={() => onDownloadInvoice(id)}
                        color="gray"
                        icon={<FiDownload className="w-4 h-4" />}
                        className="p-1 rounded-full"
                        title="Factura"
                    />
                )}
            </div>

            {/* Modal de review */}
            {showReviewModal && (
                <Modal onClose={() => setShowReviewModal(false)}>
                    <h3 className="text-lg font-bold mb-3">Review para {vehicle}</h3>
                    <div className="flex gap-2 mb-3 justify-center">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={`cursor-pointer text-2xl ${star <= reviewStars ? "text-yellow-400" : "text-gray-300"}`}
                                onClick={() => setReviewStars(star)}
                            >★</span>
                        ))}
                    </div>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
                        placeholder="Comentario (opcional)"
                    />
                    <Button onClick={handleSubmitReview} color="blue" className="w-full text-sm">
                        Enviar
                    </Button>
                </Modal>
            )}

            {/* Modal de pago */}
            {showPaymentModal && (
                <Modal onClose={() => setShowPaymentModal(false)}>
                    <h3 className="text-lg font-bold mb-3">Pagar servicio de {vehicle}</h3>

                    <label className="block text-sm mb-1">Método de pago</label>
                    <select
                        className="w-full border p-2 rounded mb-3"
                        value={selectedPaymentMethod ?? ""}
                        onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
                    >
                        {paymentMethods.map(pm => (
                            <option key={pm.id} value={pm.id}>{pm.name}</option>
                        ))}
                    </select>

                    <label className="block text-sm mb-1">Monto a pagar</label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded mb-3"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Ingrese monto"
                    />

                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => {
                            const amount = parseFloat(paymentAmount);
                            if (!selectedPaymentMethod) return alert("Selecciona un método de pago");
                            if (isNaN(amount) || amount <= 0) return alert("Ingresa un monto válido");
                            onMakePayment?.(id, amount, selectedPaymentMethod);
                            setShowPaymentModal(false);
                            setPaymentAmount(""); 
                        }}
                    >
                        Pagar
                    </Button>
                </Modal>
            )}
        </div>
    );
}
