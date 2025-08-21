"use client";

import { useState, useEffect } from "react";
import { Invoice, Company } from "@/types/invoice";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

const blankInvoiceState: Invoice = {
  invoiceNumber: "",
  invoiceDate: "",
  yourCompany: { name: "", address: "", phone: "", email: "", gstin: "" },
  client: { name: "", address: "", gstin: ""},
  items: [{ id: "1", description: "", quantity: 1, price: 0 }],
  taxRate: 0,
  gstType: "CGST+SGST",
  discount: 0,
  paymentMethod: "Cash",
  dueDate: "",
  currency: "INR",
};

const BILLER_STORAGE_KEY = "invoice-generator-biller-details";
const COUNTER_STORAGE_KEY = "invoice-generator-counter";

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(blankInvoiceState);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  useEffect(() => {
    const savedBillerDetails = localStorage.getItem(BILLER_STORAGE_KEY);
    const initialCompanyState: Company = savedBillerDetails
      ? JSON.parse(savedBillerDetails)
      : { name: "", address: "", phone: "", email: "", gstin: "" };

    let currentCounter = 1;
    const savedCounter = localStorage.getItem(COUNTER_STORAGE_KEY);
    if (savedCounter) {
      currentCounter = parseInt(savedCounter, 10);
    } else {
      localStorage.setItem(COUNTER_STORAGE_KEY, "1");
    }

    const year = new Date().getFullYear();
    const newInvoiceNumber = `${year}-${String(currentCounter).padStart(
      4,
      "0"
    )}`;

    setInvoice((prev) => ({
      ...prev,
      invoiceNumber: newInvoiceNumber,
      invoiceDate: new Date().toISOString().split("T")[0],
      yourCompany: initialCompanyState,
    }));
  }, []);

  useEffect(() => {
    if (invoice.yourCompany.name) {
      localStorage.setItem(
        BILLER_STORAGE_KEY,
        JSON.stringify(invoice.yourCompany)
      );
    }
  }, [invoice.yourCompany]);

  const handleNewInvoice = () => {
    const currentCounter = parseInt(
      localStorage.getItem(COUNTER_STORAGE_KEY) || "1",
      10
    );
    const newCounter = currentCounter + 1;
    localStorage.setItem(COUNTER_STORAGE_KEY, String(newCounter));

    const year = new Date().getFullYear();
    const newInvoiceNumber = `INV-${year}-${String(newCounter).padStart(4, "0")}`;

    setInvoice((prev) => ({
      ...blankInvoiceState,
      yourCompany: prev.yourCompany,
      invoiceNumber: newInvoiceNumber,
      invoiceDate: new Date().toISOString().split("T")[0],
    }));
  };

  const handleDownload = async () => {
    setIsLoadingPDF(true);
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
      setIsLoadingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-700">Invoice Generator</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleNewInvoice}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg cursor-pointer"
          >
            New Invoice
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg cursor-pointer"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoadingPDF}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400 cursor-pointer"
          >
            {isLoadingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
        <div className="bg-white p-6 rounded-lg shadow-md print:hidden">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Invoice Details
          </h2>
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </main>
  );
}
