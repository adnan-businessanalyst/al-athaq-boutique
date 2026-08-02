/** Money helpers — store prices in halalas (1 SAR = 100). */

export function formatMoney(halalas: number, currencyLabel = "SAR"): string {
  const major = (halalas / 100).toFixed(2);
  return `${currencyLabel} ${major}`;
}

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.floor(n)));
}
