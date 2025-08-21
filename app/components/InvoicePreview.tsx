import { Invoice, InvoiceItem } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce((acc: number, item: InvoiceItem) => {
    return acc + item.quantity * item.price;
  }, 0);

  const totalGstAmount = (subtotal * invoice.taxRate) / 100;
  const cgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const sgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const igstAmount = invoice.gstType === "IGST" ? totalGstAmount : 0;

  const total = subtotal + totalGstAmount - invoice.discount;

  return (
    <div className="p-4 sm:p-8 border-2 border-gray-300 rounded-lg max-w-4xl mx-auto bg-white font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-gray-200">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Bill of Supply
          </h1>
          <p className="text-gray-500 mt-1">
            Invoice #: {invoice.invoiceNumber}
          </p>
        </div>
        <div className="w-full sm:w-1/2 text-left sm:text-right">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            {invoice.yourCompany.name}
          </h2>
          <p className="text-gray-500 break-words">
            {invoice.yourCompany.address}
          </p>
          {invoice.yourCompany.phone && (
            <p className="text-gray-500">{invoice.yourCompany.phone}</p>
          )}
          {invoice.yourCompany.email && (
            <p className="text-gray-500">{invoice.yourCompany.email}</p>
          )}
        </div>
      </header>

      {/* Client and Date Info */}
      <section className="flex flex-col sm:flex-row justify-between items-start mt-8">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <h3 className="font-semibold text-gray-600 mb-1">BILL TO</h3>
          <p className="font-bold text-gray-800">{invoice.client.name}</p>
          <p className="text-gray-500 break-words">{invoice.client.address}</p>
        </div>
        <div className="w-full sm:w-1/2 text-left sm:text-right">
          <p className="text-gray-600">
            <span className="font-semibold">Date:</span> {invoice.invoiceDate}
          </p>
          {invoice.dueDate && (
            <p className="text-gray-600">
              <span className="font-semibold">Due Date:</span> {invoice.dueDate}
            </p>
          )}
        </div>
      </section>

      {/* Items Table */}
      <section className="mt-10">
        <div className="overflow-x-auto text-gray-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold text-center">Qty</th>
                <th className="p-3 font-semibold text-right">Price</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="p-3">
                    {item.description}
                    {item.hsn && (
                      <span className="text-gray-500 text-xs block">
                        {" "}
                        (HSN/SAC: {item.hsn})
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">₹ {item.price.toFixed(2)}</td>
                  <td className="p-3 text-right font-medium">
                    ₹ {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Totals Section */}
      <section className="flex justify-end mt-8 text-gray-700">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          {invoice.gstType === "CGST+SGST" ? (
            <>
              <div className="flex justify-between">
                <span>CGST ({invoice.taxRate / 2}%)</span>
                <span>₹ {cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({invoice.taxRate / 2}%)</span>
                <span>₹ {sgstAmount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>IGST ({invoice.taxRate}%)</span>
              <span>₹ {igstAmount.toFixed(2)}</span>
            </div>
          )}

          {invoice.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹ {invoice.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 pt-3 mt-3">
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t-2 border-gray-200 text-center text-gray-500">
        <p>Thank you for your business!</p>
      </footer>
    </div>
  );
}
