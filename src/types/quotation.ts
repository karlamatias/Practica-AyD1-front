export interface QuotationItem {
    id?: number;            
    name: string;         
    description?: string;  
    quantity: number;      
    unitPrice?: number;     
}

export interface Provider {
    id: number;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
}

export interface CreateQuotationDTO {
    items: QuotationItem[];
    providers: number[];   
}

export interface Quotation {
    id: number;
    items: QuotationItem[];
    providers?: Provider[]; 
    status: "OPEN" | "CLOSED" | "CANCELLED" | "PENDING";
}
