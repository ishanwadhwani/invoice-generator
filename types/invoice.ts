export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Company {
  name: string;
  address: string;
  gstin?: string;
  phone?: string;
  email?: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  yourCompany: Company;
  client: Company;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  paymentMethod?: string;
  signature?: string;
  dueDate?: string;
  currency?: string;
}
