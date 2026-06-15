"use client";

import { useState, useEffect } from "react";
import { Invoice, Company } from "@/types/invoice";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

const IconNewInvoice = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const IconPrint = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const IconSpinner = () => (
  <svg className="w-5 h-5 flex-shrink-0 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const blankInvoiceState: Invoice = {
  invoiceNumber: "",
  invoiceDate: "",
  yourCompany: { name: "", address: "", phone: "", email: "", gstin: "", stateName: "" },
  client: { name: "", address: "", gstin: "", phone: "", email: "", stateName: "" },
  items: [{ id: "1", description: "", quantity: 1, price: 0, hsn: "", unit: "", discountPercent: 0 }],
  taxRate: 0,
  gstType: "CGST+SGST",
  discount: 0,
  paymentMethod: "Cash",
  dueDate: "",
  currency: "INR",
  deliveryNote: "",
  otherReferences: "",
  buyerOrderNo: "",
  buyerOrderDate: "",
  despatchDocNo: "",
  deliveryNoteDate: "",
  despatchedThrough: "",
  destination: "",
  termsOfDelivery: "",
  pan: "",
  declaration: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
  bankName: "",
  bankAccountNo: "",
  bankIfscCode: "",
  jurisdiction: "",
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
      : { name: "", address: "", phone: "", email: "", gstin: "", stateName: "" };

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
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto mb-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">Invoice Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={handleNewInvoice}
              title="New Invoice"
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
            >
              <IconNewInvoice />
              <span className="hidden sm:inline text-sm">New Invoice</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print"
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-slate-600 hover:bg-slate-700 active:scale-95 text-white font-semibold rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
            >
              <IconPrint />
              <span className="hidden sm:inline text-sm">Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoadingPDF}
              title="Download PDF"
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
            >
              {isLoadingPDF ? <IconSpinner /> : <IconDownload />}
              <span className="hidden sm:inline text-sm">
                {isLoadingPDF ? "Generating..." : "Download PDF"}
              </span>
            </button>
          </div>
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
