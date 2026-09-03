/**
 * Server-side currency conversion abstraction.
 * This prevents hardcoding rates directly in components and ensures we always
 * preserve original currency values while calculating INR equivalents for dashboards.
 */

export function convertToInr(amount: number, exchangeRate: number): number {
  if (amount == null || exchangeRate == null) return 0;
  return amount * exchangeRate;
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount}`;
  }
}
