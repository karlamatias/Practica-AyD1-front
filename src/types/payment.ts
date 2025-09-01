export interface PaymentDTO {
    name: string;
    description: string;
}

export interface Payment {
    id: number;
    name: string;
    description: string;
}

export interface CreatePayment {
    maintenanceJobId: number,
    amount: number
}

export interface CreateInvoiceDTO {
    invoiceRequestId: number;
    paymentMethodId: number;
    amount: number;
}
