export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  hsn?: string;
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
  gstType: 'CGST+SGST' | 'IGST';
  discount: number;
  paymentMethod?: string;
  signature?: string;
  dueDate?: string;
  currency?: string;
}
