import React from "react";
import path from "path";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";

Font.register({
  family: "Noto Sans",
  src: path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf"),
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans",
    fontSize: 10,
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#DDDDDD",
    paddingBottom: 10,
    alignItems: "flex-start",
  },
  headerLeft: { flexDirection: "column", fontSize: 20 },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    maxWidth: "50%",
  },
  companyName: { fontSize: 20, fontWeight: "bold" },
  companyDetails: { fontSize: 9, textAlign: "right", color: "#555555" },
  invoiceTitle: { fontSize: 32, fontWeight: "bold" },
  invoiceInfo: { marginTop: 5, fontSize: 11 },
  billToSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billTo: { marginTop: 5, fontWeight: "bold" },
  billToDetails: { fontSize: 9, color: "#555555" },
  table: { marginTop: 20, width: "100%" },
  tableHeader: { flexDirection: "row", backgroundColor: "#F3F4F6" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tableColHeader: { padding: 5, fontWeight: "bold", fontSize: 10 },
  tableCol: { padding: 5 },
  hsnText: { fontSize: 8, color: "#555555" },
  colDescription: { width: "45%" },
  colHsn: { width: "15%", textAlign: "center" },
  colNoHsn: { visibility: "hidden" },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  summary: { marginTop: 20, flexDirection: "row", justifyContent: "flex-end" },
  summaryBox: { width: "40%" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    marginTop: 5,
    borderTopWidth: 2,
    borderTopColor: "#DDDDDD",
  },
  totalText: { fontWeight: "bold", fontSize: 14 },
  footer: {
    marginTop: 40,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#DDDDDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  thankYouNote: { fontSize: 9, color: "grey" },
  signatureContainer: { alignItems: "center" },
  signature: { width: 100, height: 40 },
  signatureFallback: { fontSize: 10, color: "#555555" },
  signatory: {
    borderTopWidth: 1,
    borderTopColor: "#555555",
    paddingTop: 3,
    marginTop: 5,
    fontSize: 10,
  },
  nonGstNote: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "grey",
  },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const totalGstAmount = (subtotal * invoice.taxRate) / 100;
  const cgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const sgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const igstAmount = invoice.gstType === "IGST" ? totalGstAmount : 0;

  const total = subtotal + totalGstAmount - invoice.discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {invoice.taxRate === 0 ? (
                <Text fixed>Bill of Supply</Text>
              ) : (
                <Text>Tax Invoice</Text>
              )}
              <Text style={styles.invoiceInfo}>
                Invoice #: {invoice.invoiceNumber}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.companyName}>{invoice.yourCompany.name}</Text>
              <Text style={styles.companyDetails}>
                {invoice.yourCompany.address}
              </Text>
              {invoice.yourCompany.phone && (
                <Text style={styles.companyDetails}>
                  {invoice.yourCompany.phone}
                </Text>
              )}
              {invoice.yourCompany.email && (
                <Text style={styles.companyDetails}>
                  {invoice.yourCompany.email}
                </Text>
              )}
              {invoice.yourCompany.gstin && (
                <Text style={styles.companyDetails}>
                  GSTIN: {invoice.yourCompany.gstin}
                </Text>
              )}
            </View>
          </View>

          {/* Bill To */}
          <View style={styles.billToSection}>
            <View>
              <Text>BILL TO</Text>
              <Text style={styles.billTo}>{invoice.client.name}</Text>
              <Text>{invoice.client.address}</Text>
              <Text>{invoice.client.email}</Text>
              <Text>{invoice.client.phone}</Text>
              {invoice.client.gstin && (
                <Text style={styles.billToDetails}>
                  GSTIN: {invoice.client.gstin}
                </Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <Text>Date: {invoice.invoiceDate}</Text>
              {invoice.dueDate && <Text>Due Date: {invoice.dueDate}</Text>}
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.colDescription]}>
                Description
              </Text>
              <Text style={[styles.tableColHeader, styles.colHsn]}>
                HSN/SAC
              </Text>
              <Text style={[styles.tableColHeader, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableColHeader, styles.colPrice]}>
                Unit Price
              </Text>
              <Text style={[styles.tableColHeader, styles.colAmount]}>
                Amount
              </Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.colDescription]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCol, styles.colHsn]}>
                  {item.hsn || "N/A"}
                </Text>
                <Text style={[styles.tableCol, styles.colQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCol, styles.colPrice]}>
                  ₹{item.price.toFixed(2)}
                </Text>
                <Text style={[styles.tableCol, styles.colAmount]}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>₹{subtotal.toFixed(2)}</Text>
              </View>

              {invoice.taxRate > 0 &&
                (invoice.gstType === "CGST+SGST" ? (
                  <>
                    <View style={styles.summaryRow}>
                      <Text>CGST ({invoice.taxRate / 2}%)</Text>
                      <Text>₹{cgstAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text>SGST ({invoice.taxRate / 2}%)</Text>
                      <Text>₹{sgstAmount.toFixed(2)}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.summaryRow}>
                    <Text>IGST ({invoice.taxRate}%)</Text>
                    <Text>₹{igstAmount.toFixed(2)}</Text>
                  </View>
                ))}

              {invoice.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text>Discount</Text>
                  <Text>-₹{invoice.discount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryTotal}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.thankYouNote}>
              Thank you for your business!
            </Text>
            {invoice.paymentMethod && (
              <Text style={styles.thankYouNote}>
                Payment Method: {invoice.paymentMethod}
              </Text>
            )}
          </View>
          <View style={styles.signatureContainer}>
            {invoice.signature ? (
              <Image src={invoice.signature} style={styles.signature} />
            ) : (
              // Fallback to company name if no signature
              <View style={styles.signature}>
                <Text style={styles.signatureFallback}>
                  ({invoice.yourCompany.name})
                </Text>
              </View>
            )}
            <Text style={styles.signatory}>Authorized Signatory</Text>
          </View>
        </View>

        {/* Conditional Non-GST Note */}
        {invoice.taxRate === 0 && (
          <Text style={styles.nonGstNote} fixed>
            This is a non-GST invoice. Supplier not registered under GST
          </Text>
        )}
      </Page>
    </Document>
  );
};
