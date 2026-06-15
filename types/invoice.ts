export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  hsn?: string;
  unit?: string;
  discountPercent?: number;
}

export interface Company {
  name: string;
  address: string;
  gstin?: string;
  phone?: string;
  email?: string;
  stateName?: string;
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
  // Shipment / order metadata
  deliveryNote?: string;
  otherReferences?: string;
  buyerOrderNo?: string;
  buyerOrderDate?: string;
  despatchDocNo?: string;
  deliveryNoteDate?: string;
  despatchedThrough?: string;
  destination?: string;
  termsOfDelivery?: string;
  // Company extras
  pan?: string;
  declaration?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfscCode?: string;
  jurisdiction?: string;
}
