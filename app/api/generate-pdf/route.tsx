import { NextRequest, NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/app/components/InvoicePDF';
import { Invoice } from '@/types/invoice';

export async function POST(req: NextRequest) {
  try {
    const invoiceData: Invoice = await req.json();

    // The key change: We are now sure the font is registered before this runs.
    const pdfBlob = await pdf(<InvoicePDF invoice={invoiceData} />).toBlob();

    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}