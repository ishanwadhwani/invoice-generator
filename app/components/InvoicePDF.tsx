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

const amountInWords = (amount: number): string => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tensArr = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tensArr[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + "Thousand " + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + "Lakh " + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + "Crore " + convert(n % 10000000);
  };
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = "INR " + convert(rupees).trim();
  if (paise > 0) words += " and " + convert(paise).trim() + " Paise";
  return words + " Only";
};

const B = 1;
const BC = "#000000";

const styles = StyleSheet.create({
  page: { fontFamily: "Noto Sans", fontSize: 9, padding: 25, backgroundColor: "#FFFFFF" },

  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  titleText: { fontSize: 14, fontWeight: "bold" },
  titleRight: { alignItems: "flex-end" },
  invoiceNumLine: { fontSize: 10 },
  originalCopy: { fontSize: 8, color: "#555" },

  mainBox: { borderWidth: B, borderColor: BC, flex: 1 },

  // Info rows (seller / buyer)
  infoRow: { flexDirection: "row" },
  hDivider: { borderTopWidth: B, borderTopColor: BC },

  sellerBox: { width: "50%", padding: 6, borderRightWidth: B, borderRightColor: BC },
  sellerName: { fontSize: 11, fontWeight: "bold", marginBottom: 2 },
  sellerDetail: { fontSize: 8, marginBottom: 1 },

  buyerBox: { width: "50%", padding: 6, borderRightWidth: B, borderRightColor: BC },
  buyerLabel: { fontSize: 8, color: "#666", marginBottom: 2 },
  buyerName: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  buyerDetail: { fontSize: 8, marginBottom: 1 },

  // 4-column meta grid (right side)
  metaBox: { width: "50%" },
  metaRow: { flexDirection: "row", borderBottomWidth: B, borderBottomColor: BC, minHeight: 18 },
  metaRowLast: { flexDirection: "row", minHeight: 18 },
  metaLabel: { width: "27%", padding: 3, fontSize: 7, borderRightWidth: B, borderRightColor: BC, color: "#444" },
  metaValue: { width: "23%", padding: 3, fontSize: 8, fontWeight: "bold", borderRightWidth: B, borderRightColor: BC },
  metaLabel2: { width: "27%", padding: 3, fontSize: 7, borderRightWidth: B, borderRightColor: BC, color: "#444" },
  metaValue2: { flex: 1, padding: 3, fontSize: 8, fontWeight: "bold" },
  metaLabelFull: { width: "27%", padding: 3, fontSize: 7, borderRightWidth: B, borderRightColor: BC, color: "#444" },
  metaValueFull: { flex: 1, padding: 3, fontSize: 8, fontWeight: "bold" },

  // Items table
  itemsTable: { borderTopWidth: B, borderTopColor: BC },
  tHRow: { flexDirection: "row", backgroundColor: "#EFEFEF" },
  tRow: { flexDirection: "row" },
  // Header cells
  th: { padding: 4, fontSize: 8, fontWeight: "bold", textAlign: "center", borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC },
  // Data cells
  td: { padding: 4, fontSize: 8, borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC },
  // Column widths
  cSl:   { width: "5%" },
  cDesc: { width: "28%" },
  cHsn:  { width: "9%", textAlign: "center" },
  cGst:  { width: "7%", textAlign: "center" },
  cQty:  { width: "10%", textAlign: "center" },
  cRate: { width: "10%", textAlign: "right" },
  cPer:  { width: "7%", textAlign: "center" },
  cDisc: { width: "7%", textAlign: "center" },
  cAmt:  { width: "17%", textAlign: "right" },

  // Summary rows inside items table (right-aligned label + amount)
  summaryLabelCell: {
    flex: 1, padding: 4, fontSize: 8, textAlign: "right",
    borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC,
  },
  summaryAmtCell: {
    width: "17%", padding: 4, fontSize: 8, textAlign: "right",
    borderBottomWidth: B, borderBottomColor: BC,
  },

  // Grand total row
  grandTotalRow: { flexDirection: "row", backgroundColor: "#EFEFEF" },
  gtLabelCell: {
    width: "49%", padding: 4, fontSize: 9, fontWeight: "bold", textAlign: "right",
    borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC,
  },
  gtQtyCell: {
    width: "10%", padding: 4, fontSize: 8, fontWeight: "bold", textAlign: "center",
    borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC,
  },
  gtBlankCell: {
    width: "24%", padding: 4,
    borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC,
  },
  gtAmtCell: {
    width: "17%", padding: 4, fontSize: 10, fontWeight: "bold", textAlign: "right",
    borderBottomWidth: B, borderBottomColor: BC,
  },

  // Amount in words
  amtWordsSection: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    padding: 6, borderTopWidth: B, borderTopColor: BC,
  },
  amtWordsLabel: { fontSize: 8, color: "#555", marginBottom: 2 },
  amtWordsText: { fontSize: 9, fontWeight: "bold" },
  eoe: { fontSize: 8, color: "#555" },

  // Tax breakdown table
  taxTable: { borderTopWidth: B, borderTopColor: BC },
  taxTH: { padding: 4, fontSize: 7, fontWeight: "bold", textAlign: "center", borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC },
  taxTD: { padding: 4, fontSize: 8, textAlign: "center", borderRightWidth: B, borderRightColor: BC, borderBottomWidth: B, borderBottomColor: BC },
  taxHsn:     { width: "16%" },
  taxTaxable: { width: "16%" },
  taxRate:    { width: "10%" },
  taxAmt:     { width: "14%" },
  taxTotal:   { width: "20%" },

  // Tax amount in words
  taxWordsRow: { flexDirection: "row", padding: 6, borderTopWidth: B, borderTopColor: BC },
  taxWordsLabel: { fontSize: 8, color: "#555", marginRight: 4 },
  taxWordsText: { fontSize: 9, fontWeight: "bold" },

  // Bottom section
  bottomRow: { flexDirection: "row", borderTopWidth: B, borderTopColor: BC, minHeight: 90 },
  panBox: { width: "40%", padding: 6, borderRightWidth: B, borderRightColor: BC },
  panLine: { fontSize: 8, marginBottom: 4 },
  declLabel: { fontSize: 7, color: "#555", marginBottom: 2 },
  declText: { fontSize: 7, color: "#333", lineHeight: 1.4 },
  bankBox: { width: "35%", padding: 6, borderRightWidth: B, borderRightColor: BC },
  bankTitle: { fontSize: 8, fontWeight: "bold", marginBottom: 4 },
  bankLine: { fontSize: 8, marginBottom: 2 },
  sigBox: { width: "25%", padding: 6, alignItems: "center", justifyContent: "flex-end" },
  forCompany: { fontSize: 8, marginBottom: 6 },
  sigImg: { width: 80, height: 35 },
  sigLine: { borderTopWidth: 1, borderTopColor: "#555", paddingTop: 3, marginTop: 5, fontSize: 8, textAlign: "center" },

  footer: { marginTop: 6, alignItems: "center" },
  footerText: { fontSize: 8, color: "#555", textAlign: "center", marginBottom: 1 },

  nonGstNote: { position: "absolute", bottom: 15, left: 25, right: 25, textAlign: "center", fontSize: 8, color: "grey" },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => {
  const itemAmt = (item: (typeof invoice.items)[0]) =>
    item.quantity * item.price * (1 - (item.discountPercent ?? 0) / 100);

  const subtotal = invoice.items.reduce((s, i) => s + itemAmt(i), 0);
  const totalGst = (subtotal * invoice.taxRate) / 100;
  const isCGST = invoice.gstType === "CGST+SGST";
  const cgst = isCGST ? totalGst / 2 : 0;
  const sgst = isCGST ? totalGst / 2 : 0;
  const igst = !isCGST ? totalGst : 0;
  const total = subtotal + totalGst - invoice.discount;

  const totalQty = invoice.items.reduce((s, i) => s + i.quantity, 0);
  const commonUnit = invoice.items.length > 0 && invoice.items.every(i => i.unit === invoice.items[0].unit)
    ? (invoice.items[0].unit || "") : "";

  const hsnGroups = invoice.items.reduce<Record<string, number>>((acc, item) => {
    const k = item.hsn || "Misc";
    acc[k] = (acc[k] || 0) + itemAmt(item);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>
            {invoice.taxRate === 0 ? "Bill of Supply" : "Tax Invoice"}
          </Text>
          <View style={styles.titleRight}>
            <Text style={styles.invoiceNumLine}>Invoice #: {invoice.invoiceNumber}</Text>
            <Text style={styles.originalCopy}>(ORIGINAL FOR RECIPIENT)</Text>
          </View>
        </View>

        {/* Main bordered box */}
        <View style={styles.mainBox}>

          {/* ─── Seller row ─── */}
          <View style={styles.infoRow}>
            <View style={styles.sellerBox}>
              <Text style={styles.sellerName}>{invoice.yourCompany.name}</Text>
              <Text style={styles.sellerDetail}>{invoice.yourCompany.address}</Text>
              {invoice.yourCompany.gstin ? <Text style={styles.sellerDetail}>GSTIN/UIN: {invoice.yourCompany.gstin}</Text> : null}
              {invoice.yourCompany.stateName ? <Text style={styles.sellerDetail}>State Name : {invoice.yourCompany.stateName}</Text> : null}
              {invoice.yourCompany.email ? <Text style={styles.sellerDetail}>E-Mail : {invoice.yourCompany.email}</Text> : null}
              {invoice.yourCompany.phone ? <Text style={styles.sellerDetail}>Ph: {invoice.yourCompany.phone}</Text> : null}
            </View>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No.</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
                <Text style={styles.metaLabel2}>Dated</Text>
                <Text style={styles.metaValue2}>{invoice.invoiceDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Delivery Note</Text>
                <Text style={styles.metaValue}>{invoice.deliveryNote || ""}</Text>
                <Text style={styles.metaLabel2}>Mode/Terms of Payment</Text>
                <Text style={styles.metaValue2}>{invoice.paymentMethod || ""}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Supplier&apos;s Ref.</Text>
                <Text style={styles.metaValue}></Text>
                <Text style={styles.metaLabel2}>Other Reference(s)</Text>
                <Text style={styles.metaValue2}>{invoice.otherReferences || ""}</Text>
              </View>
            </View>
          </View>

          {/* ─── Buyer row ─── */}
          <View style={[styles.infoRow, styles.hDivider]}>
            <View style={styles.buyerBox}>
              <Text style={styles.buyerLabel}>Buyer</Text>
              <Text style={styles.buyerName}>{invoice.client.name}</Text>
              {invoice.client.address ? <Text style={styles.buyerDetail}>{invoice.client.address}</Text> : null}
              {invoice.client.phone ? <Text style={styles.buyerDetail}>{invoice.client.phone}</Text> : null}
              {invoice.client.email ? <Text style={styles.buyerDetail}>{invoice.client.email}</Text> : null}
              {invoice.client.gstin ? <Text style={styles.buyerDetail}>GSTIN/UIN : {invoice.client.gstin}</Text> : null}
              {invoice.client.stateName ? <Text style={styles.buyerDetail}>State Name : {invoice.client.stateName}</Text> : null}
            </View>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Buyer&apos;s Order No.</Text>
                <Text style={styles.metaValue}>{invoice.buyerOrderNo || ""}</Text>
                <Text style={styles.metaLabel2}>Dated</Text>
                <Text style={styles.metaValue2}>{invoice.buyerOrderDate || ""}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Despatch Document No.</Text>
                <Text style={styles.metaValue}>{invoice.despatchDocNo || ""}</Text>
                <Text style={styles.metaLabel2}>Delivery Note Date</Text>
                <Text style={styles.metaValue2}>{invoice.deliveryNoteDate || ""}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Despatched through</Text>
                <Text style={styles.metaValue}>{invoice.despatchedThrough || ""}</Text>
                <Text style={styles.metaLabel2}>Destination</Text>
                <Text style={styles.metaValue2}>{invoice.destination || ""}</Text>
              </View>
              <View style={styles.metaRowLast}>
                <Text style={styles.metaLabelFull}>Terms of Delivery</Text>
                <Text style={styles.metaValueFull}>{invoice.termsOfDelivery || ""}</Text>
              </View>
            </View>
          </View>

          {/* ─── Items table ─── */}
          <View style={styles.itemsTable}>
            {/* Header */}
            <View style={styles.tHRow}>
              <Text style={[styles.th, styles.cSl]}>Sl{"\n"}No.</Text>
              <Text style={[styles.th, styles.cDesc]}>Description of Goods</Text>
              <Text style={[styles.th, styles.cHsn]}>HSN/{"\n"}SAC</Text>
              <Text style={[styles.th, styles.cGst]}>GST{"\n"}Rate</Text>
              <Text style={[styles.th, styles.cQty]}>Quantity</Text>
              <Text style={[styles.th, styles.cRate]}>Rate</Text>
              <Text style={[styles.th, styles.cPer]}>per</Text>
              <Text style={[styles.th, styles.cDisc]}>Disc.{"\n"}%</Text>
              <Text style={[styles.th, styles.cAmt]}>Amount</Text>
            </View>

            {/* Item rows */}
            {invoice.items.map((item, idx) => {
              const disc = item.discountPercent ?? 0;
              return (
                <View key={item.id} style={styles.tRow}>
                  <Text style={[styles.td, styles.cSl, { textAlign: "center" }]}>{idx + 1}</Text>
                  <Text style={[styles.td, styles.cDesc]}>{item.description}</Text>
                  <Text style={[styles.td, styles.cHsn]}>{item.hsn || ""}</Text>
                  <Text style={[styles.td, styles.cGst]}>{invoice.taxRate > 0 ? `${invoice.taxRate}%` : ""}</Text>
                  <Text style={[styles.td, styles.cQty]}>
                    {item.quantity.toFixed(2)}{item.unit ? ` ${item.unit}` : ""}
                  </Text>
                  <Text style={[styles.td, styles.cRate]}>{item.price.toFixed(2)}</Text>
                  <Text style={[styles.td, styles.cPer]}>{item.unit || ""}</Text>
                  <Text style={[styles.td, styles.cDisc]}>{disc > 0 ? `${disc}%` : ""}</Text>
                  <Text style={[styles.td, styles.cAmt]}>{itemAmt(item).toFixed(2)}</Text>
                </View>
              );
            })}

            {/* Subtotal row */}
            <View style={styles.tRow}>
              <Text style={[styles.summaryLabelCell]}></Text>
              <Text style={[styles.summaryAmtCell]}>{subtotal.toFixed(2)}</Text>
            </View>

            {/* GST rows */}
            {invoice.taxRate > 0 && isCGST && (
              <>
                <View style={styles.tRow}>
                  <Text style={styles.summaryLabelCell}>CGST</Text>
                  <Text style={styles.summaryAmtCell}>{cgst.toFixed(2)}</Text>
                </View>
                <View style={styles.tRow}>
                  <Text style={styles.summaryLabelCell}>SGST</Text>
                  <Text style={styles.summaryAmtCell}>{sgst.toFixed(2)}</Text>
                </View>
              </>
            )}
            {invoice.taxRate > 0 && !isCGST && (
              <View style={styles.tRow}>
                <Text style={styles.summaryLabelCell}>IGST</Text>
                <Text style={styles.summaryAmtCell}>{igst.toFixed(2)}</Text>
              </View>
            )}
            {invoice.discount > 0 && (
              <View style={styles.tRow}>
                <Text style={styles.summaryLabelCell}>Discount</Text>
                <Text style={styles.summaryAmtCell}>-{invoice.discount.toFixed(2)}</Text>
              </View>
            )}

            {/* Grand total row */}
            <View style={styles.grandTotalRow}>
              <Text style={styles.gtLabelCell}>Total</Text>
              <Text style={styles.gtQtyCell}>
                {totalQty.toFixed(2)}{commonUnit ? ` ${commonUnit}` : ""}
              </Text>
              <Text style={styles.gtBlankCell}></Text>
              <Text style={styles.gtAmtCell}>₹ {total.toFixed(2)}</Text>
            </View>
          </View>

          {/* ─── Amount in words ─── */}
          <View style={styles.amtWordsSection}>
            <View>
              <Text style={styles.amtWordsLabel}>Amount Chargeable (in words)</Text>
              <Text style={styles.amtWordsText}>{amountInWords(total)}</Text>
            </View>
            <Text style={styles.eoe}>E. &amp; O.E</Text>
          </View>

          {/* ─── HSN-wise tax table ─── */}
          {invoice.taxRate > 0 && (
            <View style={styles.taxTable}>
              {isCGST ? (
                <>
                  <View style={styles.tHRow}>
                    <Text style={[styles.taxTH, styles.taxHsn]}>HSN/SAC</Text>
                    <Text style={[styles.taxTH, styles.taxTaxable]}>Taxable{"\n"}Value</Text>
                    <Text style={[styles.taxTH, styles.taxRate]}>Central Tax{"\n"}Rate</Text>
                    <Text style={[styles.taxTH, styles.taxAmt]}>Amount</Text>
                    <Text style={[styles.taxTH, styles.taxRate]}>State Tax{"\n"}Rate</Text>
                    <Text style={[styles.taxTH, styles.taxAmt]}>Amount</Text>
                    <Text style={[styles.taxTH, styles.taxTotal]}>Total Tax{"\n"}Amount</Text>
                  </View>
                  {Object.entries(hsnGroups).map(([hsn, taxable]) => {
                    const halfRate = invoice.taxRate / 2;
                    const half = (taxable * halfRate) / 100;
                    return (
                      <View key={hsn} style={styles.tRow}>
                        <Text style={[styles.taxTD, styles.taxHsn]}>{hsn}</Text>
                        <Text style={[styles.taxTD, styles.taxTaxable]}>{taxable.toFixed(2)}</Text>
                        <Text style={[styles.taxTD, styles.taxRate]}>{halfRate}%</Text>
                        <Text style={[styles.taxTD, styles.taxAmt]}>{half.toFixed(2)}</Text>
                        <Text style={[styles.taxTD, styles.taxRate]}>{halfRate}%</Text>
                        <Text style={[styles.taxTD, styles.taxAmt]}>{half.toFixed(2)}</Text>
                        <Text style={[styles.taxTD, styles.taxTotal]}>{(half * 2).toFixed(2)}</Text>
                      </View>
                    );
                  })}
                  <View style={[styles.tRow, { backgroundColor: "#EFEFEF" }]}>
                    <Text style={[styles.taxTD, styles.taxHsn, { fontWeight: "bold" }]}>Total</Text>
                    <Text style={[styles.taxTD, styles.taxTaxable, { fontWeight: "bold" }]}>{subtotal.toFixed(2)}</Text>
                    <Text style={[styles.taxTD, styles.taxRate]}></Text>
                    <Text style={[styles.taxTD, styles.taxAmt, { fontWeight: "bold" }]}>{cgst.toFixed(2)}</Text>
                    <Text style={[styles.taxTD, styles.taxRate]}></Text>
                    <Text style={[styles.taxTD, styles.taxAmt, { fontWeight: "bold" }]}>{sgst.toFixed(2)}</Text>
                    <Text style={[styles.taxTD, styles.taxTotal, { fontWeight: "bold" }]}>{totalGst.toFixed(2)}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.tHRow}>
                    <Text style={[styles.taxTH, { width: "25%" }]}>HSN/SAC</Text>
                    <Text style={[styles.taxTH, { width: "25%" }]}>Taxable Value</Text>
                    <Text style={[styles.taxTH, { width: "25%" }]}>IGST Rate</Text>
                    <Text style={[styles.taxTH, { width: "25%" }]}>Total Tax Amount</Text>
                  </View>
                  {Object.entries(hsnGroups).map(([hsn, taxable]) => {
                    const amt = (taxable * invoice.taxRate) / 100;
                    return (
                      <View key={hsn} style={styles.tRow}>
                        <Text style={[styles.taxTD, { width: "25%" }]}>{hsn}</Text>
                        <Text style={[styles.taxTD, { width: "25%" }]}>{taxable.toFixed(2)}</Text>
                        <Text style={[styles.taxTD, { width: "25%" }]}>{invoice.taxRate}%</Text>
                        <Text style={[styles.taxTD, { width: "25%" }]}>{amt.toFixed(2)}</Text>
                      </View>
                    );
                  })}
                  <View style={[styles.tRow, { backgroundColor: "#EFEFEF" }]}>
                    <Text style={[styles.taxTD, { width: "25%", fontWeight: "bold" }]}>Total</Text>
                    <Text style={[styles.taxTD, { width: "25%", fontWeight: "bold" }]}>{subtotal.toFixed(2)}</Text>
                    <Text style={[styles.taxTD, { width: "25%" }]}></Text>
                    <Text style={[styles.taxTD, { width: "25%", fontWeight: "bold" }]}>{igst.toFixed(2)}</Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ─── Tax amount in words ─── */}
          {invoice.taxRate > 0 && (
            <View style={styles.taxWordsRow}>
              <Text style={styles.taxWordsLabel}>Tax Amount (in words) :</Text>
              <Text style={styles.taxWordsText}>{amountInWords(totalGst)}</Text>
            </View>
          )}

          {/* ─── Bottom: PAN / Bank / Signature ─── */}
          <View style={styles.bottomRow}>
            <View style={styles.panBox}>
              {invoice.pan ? <Text style={styles.panLine}>Company&apos;s PAN : {invoice.pan}</Text> : null}
              {invoice.declaration ? (
                <>
                  <Text style={styles.declLabel}>Declaration</Text>
                  <Text style={styles.declText}>{invoice.declaration}</Text>
                </>
              ) : null}
            </View>
            <View style={styles.bankBox}>
              {(invoice.bankName || invoice.bankAccountNo || invoice.bankIfscCode) ? (
                <>
                  <Text style={styles.bankTitle}>Company&apos;s Bank Details</Text>
                  {invoice.bankName ? <Text style={styles.bankLine}>Bank Name : {invoice.bankName}</Text> : null}
                  {invoice.bankAccountNo ? <Text style={styles.bankLine}>A/c No. : {invoice.bankAccountNo}</Text> : null}
                  {invoice.bankIfscCode ? <Text style={styles.bankLine}>Branch &amp; IFS Code : {invoice.bankIfscCode}</Text> : null}
                </>
              ) : null}
            </View>
            <View style={styles.sigBox}>
              <Text style={styles.forCompany}>for {invoice.yourCompany.name}</Text>
              {invoice.signature ? (
                <Image src={invoice.signature} style={styles.sigImg} />
              ) : (
                <View style={styles.sigImg} />
              )}
              <Text style={styles.sigLine}>Authorised Signatory</Text>
            </View>
          </View>

        </View>{/* end mainBox */}

        {/* Footer */}
        <View style={styles.footer}>
          {invoice.jurisdiction ? (
            <Text style={styles.footerText}>
              SUBJECT TO {invoice.jurisdiction.toUpperCase()} JURISDICTION
            </Text>
          ) : null}
          <Text style={styles.footerText}>This is a Computer Generated Invoice</Text>
        </View>

        {invoice.taxRate === 0 && (
          <Text style={styles.nonGstNote} fixed>
            This is a non-GST invoice. Supplier not registered under GST
          </Text>
        )}

      </Page>
    </Document>
  );
};
