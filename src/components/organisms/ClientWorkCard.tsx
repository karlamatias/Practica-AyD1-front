"use client";

import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import type { ClientJob } from "../../types/client";
import {
  FiThumbsUp,
  FiMessageSquare,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import { paymentService } from "../../services/paymentService";
import { customerService } from "../../services/customerService";
import Alert from "../atoms/Alert";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

interface ClientWorkCardProps extends ClientJob {
  vehicle: string;
  onApproveService?: (
    workId: number,
    approveType: string,
    comment: string
  ) => void;
  onLeaveReview?: (rating: number, workId: number, comment: string) => void;
  onMakePayment?: (
    workId: number,
    amount: number,
    paymentMethodId: number
  ) => void;
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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestApproveData, setRequestApproveData] = useState<any>();
  const [approveComment, setApproveComment] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);

  const [selectedTypeApprove, setSelectedTypeApprove] = useState<string | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [InvoiceRequest, setInvoiceRequest] = useState<any>();
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const typeLabel = jobType === "PREVENTIVE" ? "Preventivo" : "Correctivo";
  const statusLabel =
    status === "PENDING"
      ? "Asignado"
      : status === "INPROGRESS"
      ? "En curso"
      : "Finalizado";

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

  const onHandlePayment = async () => {
    const invoiceRequest = await customerService.getPaymentRequest(id);
    if (invoiceRequest && invoiceRequest[0]) {
      if (invoiceRequest[0].status == "PENDING") {
        setInvoiceRequest(invoiceRequest[0]);
        setShowPaymentModal(true);
      } else {
        setMessageAlert(
          "El pago ha sido completado, puedes descargar la factura"
        );
        setShowAlert(true);
      }
    } else {
      setMessageAlert("No tienes pagos pendientes");
      setShowAlert(true);
    }
  };

  const onHandleApprove = async () => {
    const approvalRequest = await customerService.getApprovalByMaintenaceJob(
      id
    );
    if (
      approvalRequest &&
      approvalRequest[0] &&
      approvalRequest[0].status == "PENDING"
    ) {
      setRequestApproveData(approvalRequest[0]);
      setShowApproveModal(true);
    } else {
      setMessageAlert("No tienes aprobaciones pendientes");
      setShowAlert(true);
    }
  };
  return (
    <div className="flex justify-between items-center p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">
          {vehicle}
        </p>
        <p className="text-gray-600 text-xs">
          {typeLabel} - {statusLabel}
        </p>
        {description && (
          <p className="text-gray-500 italic text-xs truncate">{description}</p>
        )}
        {showAlert &&
          Alert({
            type: "error",
            message: messageAlert,
            onClose() {
              setShowAlert(false);
            },
          })}
      </div>

      <div className="flex gap-1 md:flex-col md:gap-1 ml-3">
        {onApproveService && (
          <Button
            onClick={() => onHandleApprove()}
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
            onClick={() => onHandlePayment()}
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
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= reviewStars ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setReviewStars(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
            placeholder="Comentario (opcional)"
          />
          <Button
            onClick={handleSubmitReview}
            color="blue"
            className="w-full text-sm"
          >
            Enviar
          </Button>
        </Modal>
      )}

      {/* Modal de pago */}
      {showPaymentModal && (
        <Modal onClose={() => setShowPaymentModal(false)}>
          <header>
            <h3 className="text-xl font-bold mb-2">
              Pagar servicio de {vehicle}
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold">Total:</span>{" "}
              {InvoiceRequest?.amountRequested ?? 0}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total pagado:</span>{" "}
              {InvoiceRequest?.totalPaid ?? 0}
            </p>
          </header>
          {InvoiceRequest?.invoices?.length > 0 && (
            <section className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-md font-semibold mb-2">Pagos realizados:</h4>
              <ul className="space-y-2">
                {InvoiceRequest.invoices.map((item: any, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-200 pb-2 last:border-0"
                  >
                    <p>
                      <span className="font-medium">Monto pagado:</span>{" "}
                      {item.amountPaid}
                    </p>
                    <p>
                      <span className="font-medium">Fecha de pago:</span>{" "}
                      {new Date(item.paymentDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Método de pago:</span>{" "}
                      {item.paymentMethod?.name}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {/* <h2>Total {vehicle.}</h2> */}
          <label className="block text-sm mb-1">Método de pago</label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={selectedPaymentMethod ?? ""}
            onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
          >
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
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
              if (!selectedPaymentMethod)
                return alert("Selecciona un método de pago");
              if (isNaN(amount) || amount <= 0)
                return alert("Ingresa un monto válido");
              onMakePayment?.(InvoiceRequest.id, amount, selectedPaymentMethod);
              setInvoiceRequest(null);
              setShowPaymentModal(false);
              setPaymentAmount("");
            }}
          >
            Pagar
          </Button>
        </Modal>
      )}

      {showApproveModal && (
        <Modal onClose={() => setShowApproveModal(false)}>
          <header>
            <h3 className="text-xl font-bold mb-2">
              Aprovar servicio correctivo de {vehicle}
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold">Solicitud:</span>
              {requestApproveData?.approvalRequest}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Fecha de solicitud:</span>{" "}
              {new Date(
                requestApproveData?.approvalCreatedAt
              ).toLocaleDateString()}
            </p>
          </header>
          <br />
          <label className="block text-sm mb-1">Opcion: </label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={selectedTypeApprove ?? ""}
            onChange={(e) => setSelectedTypeApprove(e.target.value)}
          >
            <option value={"APPROVED"}>APROBAR</option>
            <option value={"REJECTED"}>RECHAZAR</option>
          </select>

          <label className="block text-sm mb-1">Comentario (opcional)</label>
          <textarea
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
            placeholder="Comentario (opcional)"
          />
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              if (!selectedTypeApprove)
                return alert("Selecciona una opcion de pago");
              if (onApproveService) {
                onApproveService(
                  requestApproveData.approvalId,
                  selectedTypeApprove,
                  approveComment
                );
              }

              setShowApproveModal(false);
              setRequestApproveData(null);
            }}
          >
            Enviar
          </Button>
        </Modal>
      )}
    </div>
  );
}
