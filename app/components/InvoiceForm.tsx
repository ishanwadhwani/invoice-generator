import React from "react";
import { nanoid } from "nanoid";

import { Invoice, InvoiceItem } from "@/types/invoice";
import { Dispatch, SetStateAction } from "react";

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: Dispatch<SetStateAction<Invoice>>;
}

export default function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
  const handleNestedChange = (
    section: "yourCompany" | "client",
    field: "name" | "address" | "gstin" | "phone" | "email",
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
    const itemToUpdate = { ...newItems[index] };

    if (field === "quantity" || field === "price") {
      itemToUpdate[field] = Number(value);
    } else if (field === "description" || field === "hsn") {
      itemToUpdate[field] = String(value);
    }

    newItems[index] = itemToUpdate;
    setInvoice({ ...invoice, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: nanoid(),
      description: "",
      hsn: "",
      quantity: 1,
      price: 0,
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

  return (
    <div className="space-y-6">
      {/* your details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-2">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Company Name"
            className="p-2 border rounded w-full"
            value={invoice.yourCompany.name}
            onChange={(e) =>
              handleNestedChange("yourCompany", "name", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Your Company Address"
            className="p-2 border rounded w-full"
            value={invoice.yourCompany.address}
            onChange={(e) =>
              handleNestedChange("yourCompany", "address", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Your Company Ph. number"
            className="p-2 border rounded w-full"
            value={invoice.yourCompany.phone}
            onChange={(e) =>
              handleNestedChange("yourCompany", "phone", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Your Company Email"
            className="p-2 border rounded w-full"
            value={invoice.yourCompany.email}
            onChange={(e) =>
              handleNestedChange("yourCompany", "email", e.target.value)
            }
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            GSTIN (Optional)
          </label>
          <input
            type="text"
            placeholder="Your GST Number"
            className="p-2 border rounded w-full mt-1"
            value={invoice.yourCompany.gstin}
            onChange={(e) =>
              handleNestedChange("yourCompany", "gstin", e.target.value)
            }
          />
        </div>
      </div>

      {/* Client Details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-2">Client Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Company Name"
            className="p-2 border rounded w-full"
            value={invoice.client.name}
            onChange={(e) =>
              handleNestedChange("client", "name", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Client Company Address"
            className="p-2 border rounded w-full"
            value={invoice.client.address}
            onChange={(e) =>
              handleNestedChange("client", "address", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Client's Email"
            className="p-2 border rounded w-full"
            value={invoice.client.email}
            onChange={(e) =>
              handleNestedChange("client", "email", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Client's Phone"
            className="p-2 border rounded w-full"
            value={invoice.client.phone}
            onChange={(e) =>
              handleNestedChange("client", "phone", e.target.value)
            }
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            GSTIN (Optional)
          </label>
          <input
            type="text"
            placeholder="Client GST Number"
            className="p-2 border rounded w-full mt-1"
            value={invoice.client.gstin}
            onChange={(e) =>
              handleNestedChange("client", "gstin", e.target.value)
            }
          />
        </div>
      </div>

      {/* Invoice Metadata */}
      <div className="p-4 border rounded-lg text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Number
            </label>
            <input
              type="text"
              className="p-2 border rounded w-full mt-1"
              value={invoice.invoiceNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceNumber: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Date
            </label>
            <input
              type="date"
              className="p-2 border rounded w-full mt-1"
              value={invoice.invoiceDate}
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-2">Items</h3>
        {invoice.items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-2 mb-2 items-start"
          >
            <div className="col-span-12 sm:col-span-4">
              <label className="text-xs text-gray-500">Description</label>
              <input
                type="text"
                placeholder="Item Description"
                className="p-2 border rounded w-full"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label className="text-xs text-gray-500">HSN/SAC</label>
              <input
                type="text"
                placeholder="HSN Code"
                className="p-2 border rounded w-full"
                value={item.hsn}
                onChange={(e) => handleItemChange(index, "hsn", e.target.value)}
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label className="text-xs text-gray-500">Qty</label>
              <input
                type="number"
                placeholder="1"
                className="p-2 border rounded w-full"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label className="text-xs text-gray-500">Price</label>
              <input
                type="number"
                placeholder="0.00"
                className="p-2 border rounded w-full"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
              />
            </div>
            <div className="col-span-6 sm:col-span-2 flex flex-col items-end mt-2">
              <label className="text-xs text-gray-500">Amount</label>
              <p className="p-2 font-medium">
                {(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleRemoveItem(index)}
              className="col-span-12 text-red-500 hover:text-red-700 font-semibold text-left sm:text-right"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* GST Details */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-2">GST Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Type
            </label>
            <select
              className="p-2 border rounded w-full mt-1"
              value={invoice.gstType}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  gstType: e.target.value as "CGST+SGST" | "IGST",
                })
              }
            >
              <option value="CGST+SGST">CGST + SGST (Intra-State)</option>
              <option value="IGST">IGST (Inter-State)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total GST Rate (%)
            </label>
            <input
              type="number"
              className="p-2 border rounded w-full mt-1"
              value={invoice.taxRate}
              onChange={(e) =>
                setInvoice({ ...invoice, taxRate: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* {payment method and signature} */}
      <div className="p-4 border rounded-lg text-gray-700">
        <h3 className="font-semibold text-lg mb-2">Payment & Signature</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              className="p-2 border rounded w-full mt-1"
              value={invoice.paymentMethod}
              onChange={(e) =>
                setInvoice({ ...invoice, paymentMethod: e.target.value })
              }
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Signature
            </label>
            <input
              type="file"
              accept="image/*"
              className="p-1.5 border rounded w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleSignatureUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
