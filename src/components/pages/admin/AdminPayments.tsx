"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../templates/AdminLayout";
import Alert from "../../atoms/Alert";
import { paymentService } from "../../../services/paymentService";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

interface Invoice {
  id: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  invoiceRequestId: number;
}

interface InvoiceRequest {
  id: number;
  amountRequested: number;
  status: "PENDING" | "PAID" | "REJECTED";
  invoices: Invoice[];
  totalPaid: number;
}

export default function AdminPayments() {
  const [requests, setRequests] = useState<InvoiceRequest[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchInvoiceRequests = async () => {
      try {
        const data: InvoiceRequest[] = await paymentService.getAllInvoiceRequests();
        setRequests(data);
      } catch (error: any) {
        setAlert({ type: "error", message: error.message || "No se pudieron cargar los pagos." });
      }
    };

    fetchInvoiceRequests();
  }, []);

  // Autocierre de alertas
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Estado de Pagos</h2>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white p-4 rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID Solicitud</th>
              <th className="px-4 py-2 text-left">Monto solicitado</th>
              <th className="px-4 py-2 text-left">Total pagado</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Facturas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="px-4 py-2">{req.id}</td>
                <td className="px-4 py-2">{req.amountRequested}</td>
                <td className="px-4 py-2">{req.totalPaid}</td>
                <td className="px-4 py-2">{req.status}</td>
                <td className="px-4 py-2">
                  {req.invoices.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {req.invoices.map(inv => (
                        <li key={inv.id}>
                          {inv.paymentMethod.name}: {inv.amountPaid} ({new Date(inv.paymentDate).toLocaleDateString()})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No hay facturas</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
