/**
 * Server-side invoice calculation.
 * Ensures that tax amounts (CGST, SGST, IGST) and grand totals
 * are calculated securely on the server based on the line items.
 */

export interface InvoiceItemPayload {
  rate: number;
  quantity: number;
}

export interface TaxRates {
  cgstRate: number; // e.g. 9 for 9%
  sgstRate: number; // e.g. 9 for 9%
  igstRate: number; // e.g. 18 for 18%
}

export interface InvoiceCalculationResult {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
}

export function calculateInvoiceTotals(
  items: InvoiceItemPayload[],
  rates: TaxRates
): InvoiceCalculationResult {
  const taxableAmount = items.reduce((sum, item) => sum + item.rate * item.quantity, 0);
  
  const cgst = (taxableAmount * rates.cgstRate) / 100;
  const sgst = (taxableAmount * rates.sgstRate) / 100;
  const igst = (taxableAmount * rates.igstRate) / 100;
  
  const totalTax = cgst + sgst + igst;
  const grandTotal = taxableAmount + totalTax;
  
  return {
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalTax,
    grandTotal,
  };
}
