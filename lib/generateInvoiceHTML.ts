import { Invoice } from '@/types/invoice';

export function generateInvoiceHTML(invoice: Invoice): string {
  // Calculate totals
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount - invoice.discount;

  const generateItemRows = () => {
    return invoice.items.map(item => `
      <tr class="border-b border-gray-100">
        <td class="p-3 text-gray-800">${item.description}</td>
        <td class="p-3 text-center">${item.quantity}</td>
        <td class="p-3 text-right">₹${item.price.toFixed(2)}</td>
        <td class="p-3 text-right font-medium">₹${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');
  };

  return `
    <div class="p-8 border-2 border-gray-300 rounded-lg max-w-4xl mx-auto bg-white font-sans">
      <header class="flex justify-between items-start pb-6 border-b-2 border-gray-200">
        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-800">INVOICE</h1>
          <p class="text-gray-500 mt-1">Invoice #: ${invoice.invoiceNumber}</p>
        </div>
        <div class="text-right flex-shrink-0 ml-4 max-w-xs">
          <h2 class="text-2xl font-semibold text-gray-700">${invoice.yourCompany.name}</h2>
          <p class="text-gray-500 break-words">${invoice.yourCompany.address}</p>
          ${/* ADDED Biller's Phone, Email, and GSTIN */''}
          ${invoice.yourCompany.phone ? `<p class="text-gray-500">${invoice.yourCompany.phone}</p>` : ''}
          ${invoice.yourCompany.email ? `<p class="text-gray-500">${invoice.yourCompany.email}</p>` : ''}
          ${invoice.yourCompany.gstin ? `<p class="text-gray-500 mt-1">GSTIN: ${invoice.yourCompany.gstin}</p>` : ''}
        </div>
      </header>
      
      <section class="flex justify-between items-start mt-8">
        <div class="max-w-xs">
          <h3 class="font-semibold text-gray-600 mb-1">BILL TO</h3>
          <p class="font-bold text-gray-800">${invoice.client.name}</p>
          <p class="text-gray-500 break-words">${invoice.client.address}</p>
          ${/* ADDED Customer's GSTIN */''}
          ${invoice.client.gstin ? `<p class="text-gray-500 mt-1">GSTIN: ${invoice.client.gstin}</p>` : ''}
        </div>
        <div class="text-right">
          <p class="text-gray-600"><span class="font-semibold">Invoice Date:</span> ${invoice.invoiceDate}</p>
          ${invoice.dueDate ? `<p class="text-gray-600"><span class="font-semibold">Due Date:</span> ${invoice.dueDate}</p>` : ''}
          ${invoice.currency ? `<p class="text-gray-600 mt-2"><span class="font-semibold">Currency:</span> ${invoice.currency}</p>` : ''}
        </div>
      </section>

      <section class="mt-10">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 font-semibold text-gray-700">Description</th>
              <th class="p-3 font-semibold text-gray-700 text-center">Qty</th>
              <th class="p-3 font-semibold text-gray-700 text-right">Unit Price</th>
              <th class="p-3 font-semibold text-gray-700 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${generateItemRows()}
          </tbody>
        </table>
      </section>

      <section class="flex justify-end mt-8">
        <div class="w-full max-w-xs space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Tax (${invoice.taxRate}%)</span>
            <span>₹${taxAmount.toFixed(2)}</span>
          </div>
          ${invoice.discount > 0 ? `<div class="flex justify-between text-gray-600"><span>Discount</span><span>-₹${invoice.discount.toFixed(2)}</span></div>` : ''}
          <div class="border-t-2 border-gray-200 pt-3 mt-3">
            <div class="flex justify-between font-bold text-xl text-gray-800">
              <span>Total</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      ${/* ADDED Payment Method and Signature */''}
      <section class="flex justify-between items-end mt-12 pt-6 border-t-2 border-gray-200">
        <div>
          <h3 class="font-semibold text-gray-600">Payment Details</h3>
          <p class="text-gray-500">Method: ${invoice.paymentMethod || 'N/A'}</p>
        </div>
        <div class="text-center">
          ${invoice.signature ? `<img src="${invoice.signature}" alt="Signature" style="height: 4rem; margin-left: auto; margin-right: auto;" />` : '<div style="height: 4rem;"></div>'}
          <p class="border-t border-gray-400 mt-2 pt-1 text-sm font-semibold">Authorized Signatory</p>
        </div>
      </section>
      
      <footer class="mt-12 pt-6 border-t-2 border-gray-200 text-center text-gray-500">
        <p>Thank you for your business!</p>
      </footer>
    </div>
  `;
}