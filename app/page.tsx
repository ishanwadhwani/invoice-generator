"use client";

import { useState, useEffect } from "react";
import { Invoice, Company } from "@/types/invoice";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

const blankInvoiceState: Invoice = {
  invoiceNumber: "INV-001",
  invoiceDate: "",
  yourCompany: { name: "", address: "", phone: "", email: "", gstin: "" },
  client: { name: "", address: "" },
  items: [{ id: "1", description: "", quantity: 1, price: 100 }],
  taxRate: 0,
  discount: 0,
  paymentMethod: "Cash",
  dueDate: "",
  currency: "INR",
};

const LOCAL_STORAGE_KEY = "invoice-generator-biller-details";

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(blankInvoiceState);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const savedBillerDetails = localStorage.getItem(LOCAL_STORAGE_KEY);

    let initialCompanyState: Company = {
      name: "",
      address: "",
      phone: "",
      email: "",
      gstin: "",
    };
    if (savedBillerDetails) {
      initialCompanyState = JSON.parse(savedBillerDetails);
    }

    setInvoice((prev) => ({
      ...prev,
      invoiceDate: today,
      yourCompany: initialCompanyState,
    }));
  }, []);

  useEffect(() => {
    if (invoice.yourCompany.name) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(invoice.yourCompany)
      );
    }
  }, [invoice.yourCompany]);

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
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoadingPDF}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
          >
            {isLoadingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
        <div className="bg-white p-6 rounded-lg shadow-md print:hidden">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Invoice Details</h2>
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </main>
  );
}
