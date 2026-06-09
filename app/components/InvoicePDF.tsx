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
  outerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
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
    alignItems: "flex-start",
    maxWidth: "50%",
  },
  companyName: { fontSize: 20, fontWeight: "bold" },
  companyDetails: { fontSize: 9, textAlign: "right", color: "#555555" },
  invoiceTitle: { fontSize: 32, fontWeight: "bold" },
  invoiceInfo: { marginTop: 5, fontSize: 11 },

  // Bill To — two-column table layout
  billToTable: {
    flexDirection: "row",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  billToLeft: {
    width: "50%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  billToLeftLabel: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 3,
  },
  billToName: { fontWeight: "bold", fontSize: 11, marginBottom: 2 },
  billToDetails: { fontSize: 9, color: "#555555" },
  billToRight: {
    width: "50%",
  },
  billToRightRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    minHeight: 20,
  },
  billToRightRowLast: {
    flexDirection: "row",
    minHeight: 20,
  },
  billToRightLabel: {
    width: "45%",
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    color: "#333333",
  },
  billToRightValue: {
    flex: 1,
    padding: 4,
    fontSize: 9,
    fontWeight: "bold",
  },

  // Items table — full grid borders
  tableWithBorder: {
    marginTop: 10,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
  },
  tableHeaderBordered: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
  },
  tableRowBordered: {
    flexDirection: "row",
  },
  tableColHeaderBordered: {
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableColBordered: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  hsnText: { fontSize: 8, color: "#555555" },
  colDescription: { width: "45%" },
  colHsn: { width: "15%", textAlign: "center" },
  colNoHsn: { visibility: "hidden" },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },

  // Summary — bordered table aligned right
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  summaryTableBox: {
    width: "40%",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  summaryTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  summaryTableLabel: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    fontSize: 10,
  },
  summaryTableValue: {
    width: "45%",
    padding: 4,
    textAlign: "right",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    fontSize: 10,
  },
  summaryTableTotalLabel: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    fontWeight: "bold",
    fontSize: 12,
  },
  summaryTableTotalValue: {
    width: "45%",
    padding: 5,
    textAlign: "right",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    fontWeight: "bold",
    fontSize: 12,
  },

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
    0,
  );

  const totalGstAmount = (subtotal * invoice.taxRate) / 100;
  const cgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const sgstAmount = invoice.gstType === "CGST+SGST" ? totalGstAmount / 2 : 0;
  const igstAmount = invoice.gstType === "IGST" ? totalGstAmount : 0;

  const total = subtotal + totalGstAmount - invoice.discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerContainer}>
          {/* Header */}
          <View style={styles.header}>
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
          </View>

          {/* Bill To — table with columns and rows */}
          <View style={styles.billToTable}>
            {/* Left column: buyer details */}
            <View style={styles.billToLeft}>
              <Text style={styles.billToLeftLabel}>Buyer</Text>
              <Text style={styles.billToName}>{invoice.client.name}</Text>
              {invoice.client.address ? (
                <Text style={styles.billToDetails}>{invoice.client.address}</Text>
              ) : null}
              {invoice.client.phone ? (
                <Text style={styles.billToDetails}>{invoice.client.phone}</Text>
              ) : null}
              {invoice.client.email ? (
                <Text style={styles.billToDetails}>{invoice.client.email}</Text>
              ) : null}
              {invoice.client.gstin ? (
                <Text style={styles.billToDetails}>
                  GSTIN/UIN : {invoice.client.gstin}
                </Text>
              ) : null}
            </View>

            {/* Right column: invoice metadata grid */}
            <View style={styles.billToRight}>
              <View style={styles.billToRightRow}>
                <Text style={styles.billToRightLabel}>Invoice No.</Text>
                <Text style={styles.billToRightValue}>
                  {invoice.invoiceNumber}
                </Text>
              </View>
              <View style={styles.billToRightRow}>
                <Text style={styles.billToRightLabel}>Dated</Text>
                <Text style={styles.billToRightValue}>
                  {invoice.invoiceDate}
                </Text>
              </View>
              <View style={styles.billToRightRow}>
                <Text style={styles.billToRightLabel}>Delivery Note</Text>
                <Text style={styles.billToRightValue}></Text>
              </View>
              <View style={styles.billToRightRow}>
                <Text style={styles.billToRightLabel}>
                  Mode/Terms of Payment
                </Text>
                <Text style={styles.billToRightValue}>
                  {invoice.paymentMethod || ""}
                </Text>
              </View>
              <View style={styles.billToRightRowLast}>
                <Text style={styles.billToRightLabel}>Terms of Delivery</Text>
                <Text style={styles.billToRightValue}>
                  {invoice.dueDate ? `Due: ${invoice.dueDate}` : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* Items Table — full grid */}
          <View style={styles.tableWithBorder}>
            <View style={styles.tableHeaderBordered}>
              <Text
                style={[styles.tableColHeaderBordered, styles.colDescription]}
              >
                Product
              </Text>
              <Text style={[styles.tableColHeaderBordered, styles.colHsn]}>
                HSN/SAC
              </Text>
              <Text style={[styles.tableColHeaderBordered, styles.colQty]}>
                Qty
              </Text>
              <Text style={[styles.tableColHeaderBordered, styles.colPrice]}>
                Rate
              </Text>
              <Text style={[styles.tableColHeaderBordered, styles.colAmount]}>
                Amount
              </Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRowBordered}>
                <Text style={[styles.tableColBordered, styles.colDescription]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableColBordered, styles.colHsn]}>
                  {item.hsn || ""}
                </Text>
                <Text style={[styles.tableColBordered, styles.colQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableColBordered, styles.colPrice]}>
                  ₹{item.price.toFixed(2)}
                </Text>
                <Text style={[styles.tableColBordered, styles.colAmount]}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary — bordered table */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryTableBox}>
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableLabel}>Subtotal</Text>
                <Text style={styles.summaryTableValue}>
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>

              {invoice.taxRate > 0 &&
                (invoice.gstType === "CGST+SGST" ? (
                  <>
                    <View style={styles.summaryTableRow}>
                      <Text style={styles.summaryTableLabel}>
                        CGST ({invoice.taxRate / 2}%)
                      </Text>
                      <Text style={styles.summaryTableValue}>
                        ₹{cgstAmount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.summaryTableRow}>
                      <Text style={styles.summaryTableLabel}>
                        SGST ({invoice.taxRate / 2}%)
                      </Text>
                      <Text style={styles.summaryTableValue}>
                        ₹{sgstAmount.toFixed(2)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.summaryTableRow}>
                    <Text style={styles.summaryTableLabel}>
                      IGST ({invoice.taxRate}%)
                    </Text>
                    <Text style={styles.summaryTableValue}>
                      ₹{igstAmount.toFixed(2)}
                    </Text>
                  </View>
                ))}

              {invoice.discount > 0 && (
                <View style={styles.summaryTableRow}>
                  <Text style={styles.summaryTableLabel}>Discount</Text>
                  <Text style={styles.summaryTableValue}>
                    -₹{invoice.discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableTotalLabel}>Total</Text>
                <Text style={styles.summaryTableTotalValue}>
                  ₹{total.toFixed(2)}
                </Text>
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
