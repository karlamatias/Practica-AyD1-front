
export interface Provider {
    id: number;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
};

export interface QuotationRequest {
    id: number;
    createdAt: string;
};

export interface Invoice {
    id: number | null;
    number: string | null;
    totalAmount: number | null;
    paymentMethodId: number | null;
    fileUrl: string | null;
    issuedAt: string | null;
};

export interface Order {
    id: number;
    totalAmount: number;
    provider: Provider;
    quotationRequest: QuotationRequest;
    invoice: Invoice;
    status: "PENDING" | "PAID" | "CANCELLED" | "DELIVERED" | "DELAYED" | "COMPLETED";
};
