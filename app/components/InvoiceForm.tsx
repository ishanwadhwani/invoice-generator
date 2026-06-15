import React from "react";
import { nanoid } from "nanoid";
import { Invoice, InvoiceItem, Company } from "@/types/invoice";
import { Dispatch, SetStateAction } from "react";

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: Dispatch<SetStateAction<Invoice>>;
}

export default function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
  const handleNestedChange = (
    section: "yourCompany" | "client",
    field: keyof Company,
    value: string
  ) => {
    setInvoice({
      ...invoice,
      [section]: { ...invoice[section], [field]: value },
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...invoice.items];
    const item = { ...newItems[index] };
    if (field === "quantity" || field === "price" || field === "discountPercent") {
      (item as never as Record<string, number>)[field] = Number(value);
    } else {
      (item as never as Record<string, string>)[field] = String(value);
    }
    newItems[index] = item;
    setInvoice({ ...invoice, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: nanoid(),
      description: "",
      hsn: "",
      quantity: 1,
      price: 0,
      unit: "",
      discountPercent: 0,
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: newItems });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice({ ...invoice, signature: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const inp = "p-2 border rounded w-full";
  const label = "block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">

      {/* Your Details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Company Name</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Pitambra Traders"
              value={invoice.yourCompany.name}
              onChange={(e) => handleNestedChange("yourCompany", "name", e.target.value)} />
          </div>
          <div>
            <label className={label}>Address</label>
            <input type="text" className={`${inp} mt-1`} placeholder="255/219 Kundri, Lucknow"
              value={invoice.yourCompany.address}
              onChange={(e) => handleNestedChange("yourCompany", "address", e.target.value)} />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Phone number"
              value={invoice.yourCompany.phone ?? ""}
              maxLength={10}
              onChange={(e) => handleNestedChange("yourCompany", "phone", e.target.value)} />
          </div>
          <div>
            <label className={label}>Email</label>
            <input type="email" className={`${inp} mt-1`} placeholder="you@example.com"
              value={invoice.yourCompany.email ?? ""}
              onChange={(e) => handleNestedChange("yourCompany", "email", e.target.value)} />
          </div>
          <div>
            <label className={label}>GSTIN/UIN</label>
            <input type="text" className={`${inp} mt-1`} placeholder="09ADMPA1006B1ZD"
              value={invoice.yourCompany.gstin ?? ""}
              onChange={(e) => handleNestedChange("yourCompany", "gstin", e.target.value)} />
          </div>
          <div>
            <label className={label}>State Name & Code</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Uttar Pradesh, Code: 09"
              value={invoice.yourCompany.stateName ?? ""}
              onChange={(e) => handleNestedChange("yourCompany", "stateName", e.target.value)} />
          </div>
          <div>
            <label className={label}>PAN</label>
            <input type="text" className={`${inp} mt-1`} placeholder="ADMPA1006B"
              value={invoice.pan ?? ""}
              onChange={(e) => setInvoice({ ...invoice, pan: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Client Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Company Name</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Client Company"
              value={invoice.client.name}
              onChange={(e) => handleNestedChange("client", "name", e.target.value)} />
          </div>
          <div>
            <label className={label}>Address</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Client Address"
              value={invoice.client.address}
              onChange={(e) => handleNestedChange("client", "address", e.target.value)} />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Client Phone"
              value={invoice.client.phone ?? ""}
              maxLength={10}
              onChange={(e) => handleNestedChange("client", "phone", e.target.value)} />
          </div>
          <div>
            <label className={label}>Email</label>
            <input type="email" className={`${inp} mt-1`} placeholder="client@example.com"
              value={invoice.client.email ?? ""}
              onChange={(e) => handleNestedChange("client", "email", e.target.value)} />
          </div>
          <div>
            <label className={label}>GSTIN/UIN</label>
            <input type="text" className={`${inp} mt-1`} placeholder="09AHKPW4911D1Z5"
              value={invoice.client.gstin ?? ""}
              onChange={(e) => handleNestedChange("client", "gstin", e.target.value)} />
          </div>
          <div>
            <label className={label}>State Name & Code</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Uttar Pradesh, Code: 09"
              value={invoice.client.stateName ?? ""}
              onChange={(e) => handleNestedChange("client", "stateName", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Invoice Metadata */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Invoice Number</label>
            <input type="text" className={`${inp} mt-1`}
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })} />
          </div>
          <div>
            <label className={label}>Invoice Date</label>
            <input type="date" className={`${inp} mt-1`}
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })} />
          </div>
          <div>
            <label className={label}>Delivery Note</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Delivery note no."
              value={invoice.deliveryNote ?? ""}
              onChange={(e) => setInvoice({ ...invoice, deliveryNote: e.target.value })} />
          </div>
          <div>
            <label className={label}>Other Reference(s)</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Other references"
              value={invoice.otherReferences ?? ""}
              onChange={(e) => setInvoice({ ...invoice, otherReferences: e.target.value })} />
          </div>
          <div>
            <label className={label}>Buyer&apos;s Order No.</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Order number"
              value={invoice.buyerOrderNo ?? ""}
              onChange={(e) => setInvoice({ ...invoice, buyerOrderNo: e.target.value })} />
          </div>
          <div>
            <label className={label}>Buyer&apos;s Order Date</label>
            <input type="date" className={`${inp} mt-1`}
              value={invoice.buyerOrderDate ?? ""}
              onChange={(e) => setInvoice({ ...invoice, buyerOrderDate: e.target.value })} />
          </div>
          <div>
            <label className={label}>Despatch Document No.</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Despatch doc no."
              value={invoice.despatchDocNo ?? ""}
              onChange={(e) => setInvoice({ ...invoice, despatchDocNo: e.target.value })} />
          </div>
          <div>
            <label className={label}>Delivery Note Date</label>
            <input type="date" className={`${inp} mt-1`}
              value={invoice.deliveryNoteDate ?? ""}
              onChange={(e) => setInvoice({ ...invoice, deliveryNoteDate: e.target.value })} />
          </div>
          <div>
            <label className={label}>Despatched Through</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Transport / courier name"
              value={invoice.despatchedThrough ?? ""}
              onChange={(e) => setInvoice({ ...invoice, despatchedThrough: e.target.value })} />
          </div>
          <div>
            <label className={label}>Destination</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Destination city"
              value={invoice.destination ?? ""}
              onChange={(e) => setInvoice({ ...invoice, destination: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Terms of Delivery</label>
            <input type="text" className={`${inp} mt-1`} placeholder="e.g. FOB, CIF"
              value={invoice.termsOfDelivery ?? ""}
              onChange={(e) => setInvoice({ ...invoice, termsOfDelivery: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Items</h3>
        {invoice.items.map((item, index) => (
          <div key={item.id} className="mb-4 p-3 border rounded bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              <div className="col-span-2 sm:col-span-4">
                <label className="text-xs text-gray-500">Description</label>
                <input type="text" placeholder="Item Description" className={inp}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">HSN/SAC</label>
                <input type="text" placeholder="HSN Code" className={inp}
                  value={item.hsn ?? ""}
                  onChange={(e) => handleItemChange(index, "hsn", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Unit (per)</label>
                <input type="text" placeholder="Pcs., Nos., Kg." className={inp}
                  value={item.unit ?? ""}
                  onChange={(e) => handleItemChange(index, "unit", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Quantity</label>
                <input type="number" placeholder="1" className={inp}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Rate (₹)</label>
                <input type="number" placeholder="0.00" className={inp}
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Disc. %</label>
                <input type="number" placeholder="0" className={inp}
                  value={item.discountPercent ?? 0}
                  onChange={(e) => handleItemChange(index, "discountPercent", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <p className="p-2 font-medium">
                  {(item.quantity * item.price * (1 - (item.discountPercent ?? 0) / 100)).toFixed(2)}
                </p>
              </div>
            </div>
            <button onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 text-sm font-semibold">
              Remove Item
            </button>
          </div>
        ))}
        <button onClick={handleAddItem}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add Item
        </button>
      </div>

      {/* GST Details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">GST Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>GST Type</label>
            <select className={`${inp} mt-1`} value={invoice.gstType}
              onChange={(e) => setInvoice({ ...invoice, gstType: e.target.value as "CGST+SGST" | "IGST" })}>
              <option value="CGST+SGST">CGST + SGST (Intra-State)</option>
              <option value="IGST">IGST (Inter-State)</option>
            </select>
          </div>
          <div>
            <label className={label}>Total GST Rate (%)</label>
            <input type="number" className={`${inp} mt-1`}
              value={invoice.taxRate}
              onChange={(e) => setInvoice({ ...invoice, taxRate: Number(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Discount (₹)</label>
            <input type="number" className={`${inp} mt-1`} placeholder="0"
              value={invoice.discount}
              onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* Bank & Payment */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Bank & Payment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Payment Method</label>
            <select className={`${inp} mt-1`} value={invoice.paymentMethod}
              onChange={(e) => setInvoice({ ...invoice, paymentMethod: e.target.value })}>
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Card</option>
            </select>
          </div>
          <div>
            <label className={label}>Bank Name</label>
            <input type="text" className={`${inp} mt-1`} placeholder="ICICI Bank"
              value={invoice.bankName ?? ""}
              onChange={(e) => setInvoice({ ...invoice, bankName: e.target.value })} />
          </div>
          <div>
            <label className={label}>Account No.</label>
            <input type="text" className={`${inp} mt-1`} placeholder="103305500038"
              value={invoice.bankAccountNo ?? ""}
              onChange={(e) => setInvoice({ ...invoice, bankAccountNo: e.target.value })} />
          </div>
          <div>
            <label className={label}>Branch & IFS Code</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Aminabad & ICIC0001033"
              value={invoice.bankIfscCode ?? ""}
              onChange={(e) => setInvoice({ ...invoice, bankIfscCode: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Declaration & Footer */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Declaration & Footer</h3>
        <div className="space-y-4">
          <div>
            <label className={label}>Declaration</label>
            <textarea rows={3} className={`${inp} mt-1`}
              value={invoice.declaration ?? ""}
              onChange={(e) => setInvoice({ ...invoice, declaration: e.target.value })} />
          </div>
          <div>
            <label className={label}>Jurisdiction</label>
            <input type="text" className={`${inp} mt-1`} placeholder="Lucknow"
              value={invoice.jurisdiction ?? ""}
              onChange={(e) => setInvoice({ ...invoice, jurisdiction: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-3">Signature</h3>
        <div>
          <label className={label}>Upload Signature Image</label>
          <input type="file" accept="image/*"
            className="p-1.5 border rounded w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleSignatureUpload} />
        </div>
      </div>

    </div>
  );
}
