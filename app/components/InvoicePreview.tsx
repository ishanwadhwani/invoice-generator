import Image from "next/image";
import { Invoice } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const taxAmount = (subtotal * invoice.taxRate) / 100;

  const total = subtotal + taxAmount - invoice.discount;

  return (
    <div className="p-8 border-2 border-gray-300 rounded-lg max-w-4xl mx-auto bg-white font-sans">
      <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-gray-500 mt-1">
            Invoice #: {invoice.invoiceNumber}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4 max-w-xs">
          <h2 className="text-2xl font-semibold text-gray-700">
            {invoice.yourCompany.name}
          </h2>
          <p className="text-gray-500 break-words">
            {invoice.yourCompany.address}
          </p>
          <p className="text-gray-500">Phone: {invoice.yourCompany.phone}</p>
          <p className="text-gray-500">Email: {invoice.yourCompany.email}</p>
          {invoice.yourCompany.gstin && (
            <p className="text-gray-500 mt-1">
              GSTIN: {invoice.yourCompany.gstin}
            </p>
          )}
        </div>
      </header>

      {/* Client and Date Info */}
      <section className="flex justify-between items-start mt-8">
        <div className="max-w-xs">
          <h3 className="font-semibold text-gray-600 mb-1">BILL TO</h3>
          <p className="font-bold text-gray-800">{invoice.client.name}</p>
          <p className="text-gray-500 break-words">{invoice.client.address}</p>
          {invoice.client.gstin && (
            <p className="text-gray-500 mt-1">GSTIN: {invoice.client.gstin}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-gray-600">
            <span className="font-semibold">Invoice Date:</span>{" "}
            {invoice.invoiceDate}
          </p>
        </div>
      </section>

      {/* items */}
      <section className="mt-10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-gray-700">Description</th>
              <th className="p-3 font-semibold text-gray-700 text-center">
                Qty
              </th>
              <th className="p-3 font-semibold text-gray-700 text-right">
                Unit Price
              </th>
              <th className="p-3 font-semibold text-gray-700 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-800 text-gray-700"
              >
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                <td className="p-3 text-right font-medium">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* total bill amount */}
      <section className="flex justify-end mt-8">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({invoice.taxRate}%)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>-₹{invoice.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-200 pt-3 mt-3">
            <div className="flex justify-between font-bold text-xl text-gray-800">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-between items-end mt-12 pt-6 border-t-2 border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-600">Payment Details</h3>
          <p className="text-gray-500">Method: {invoice.paymentMethod}</p>
        </div>
        <div className="text-center">
          {invoice.signature ? (
            <Image
              src={invoice.signature}
              alt="Signature"
              width={16}
              height={16}
              className="h-16 w-auto mx-auto"
            />
          ) : (
            <div className="h-16"></div>
          )}
          <p className="border-t border-gray-400 text-gray-600 mt-2 pt-1 text-sm font-semibold">
            Authorized Signatory
          </p>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t-2 border-gray-200 text-center text-gray-500">
        <p>Thank you for your business!</p>
      </footer>
    </div>
  );
}
