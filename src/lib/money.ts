export function formatMoney(halalas: number, currencyLabel = "SAR"): string {
  return `${currencyLabel} ${(halalas / 100).toFixed(2)}`;
}

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.floor(n)));
}
