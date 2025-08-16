"use client";
import { useState } from "react";
import { Invoice } from "@/types/invoice";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

const initialInvoiceState: Invoice = {
  invoiceNumber: "INV-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  yourCompany: {
    name: "K Suvidha Electronics",
    address: "Naka Hindola, Charbagh, Lucknow, Uttar Pradesh",
    gstin: "ABC123456",
    phone: "1234567890",
    email: "test@gmail.com",
  },
  client: {
    name: "Customer Name",
    address: "Customer Address",
    gstin: "",
    phone: "",
    email: "",
  },
  items: [{ id: "1", description: "Torch", quantity: 1, price: 120.0 }],
  taxRate: 0,
  discount: 0,
  paymentMethod: "Cash",
  signature: "",
  // dueDate: '',
  // currency: 'INR'
};

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceState);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: The Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Invoice Details
          </h1>
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
        </div>

        {/* Right Side: The Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Live Preview
          </h2>
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </main>
  );
}
