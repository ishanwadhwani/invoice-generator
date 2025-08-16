import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Invoice } from "@/types/invoice";

const styles = StyleSheet.create({
  page: {
    // fontFamily: "Helvetica",
    fontSize: 11,
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
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    maxWidth: "50%",
  },
  companyName: {
    fontSize: 20,
    // fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  companyDetails: {
    fontSize: 10,
    textAlign: "right",
    color: "#555555",
  },
  invoiceTitle: {
    fontSize: 32,
    // fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  invoiceInfo: {
    marginTop: 5,
    fontSize: 11,
  },
  billToSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billTo: {
    marginTop: 5,
    // fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  billToDetails: {
    fontSize: 10,
    color: "#555555",
  },
  table: {
    marginTop: 20,
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  tableColHeader: {
    padding: 5,
    // fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  tableCol: {
    padding: 5,
  },
  colDescription: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  summary: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: "40%",
  },
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
  totalText: {
    fontWeight: "bold",
    fontSize: 14,
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
  thankYouNote: {
    fontSize: 10,
    color: "grey",
  },
  signatureContainer: {
    alignItems: "center",
  },
  signature: {
    width: 100,
    height: 40,
  },
  signatory: {
    borderTopWidth: 1,
    borderTopColor: "#555555",
    paddingTop: 3,
    marginTop: 20,
    fontSize: 10,
  },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount - invoice.discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
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

        <View style={styles.billToSection}>
          <View>
            <Text>BILL TO</Text>
            <Text style={styles.billTo}>{invoice.client.name}</Text>
            <Text>{invoice.client.address}</Text>
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

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHeader, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableColHeader, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableColHeader, styles.colPrice]}>
              Unit Price (Rs)
            </Text>
            <Text style={[styles.tableColHeader, styles.colAmount]}>
              Amount (Rs)
            </Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.colDescription]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCol, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCol, styles.colPrice]}>
                {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableCol, styles.colAmount]}>
                {(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>Rs. {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax ({invoice.taxRate}%)</Text>
              <Text>Rs. {taxAmount.toFixed(2)}</Text>
            </View>
            {invoice.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text>Discount</Text>
                <Text>-Rs. {invoice.discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryTotal}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>Rs. {total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

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
            {invoice.signature && (
              <Image src={invoice.signature} style={styles.signature} />
            )}
            <Text style={styles.signatory}>Authorized Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
