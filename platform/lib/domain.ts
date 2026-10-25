export const PLANS = [
  { id: "monthly", name: "Monthly", months: 1, price: 300000 },
  { id: "quarterly", name: "Quarterly", months: 3, price: 800000 },
  { id: "annual", name: "Annual", months: 12, price: 2800000 },
] as const;
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function addMonths(date: string, months: number) {
  const d = new Date(date + "T00:00:00Z");
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d.toISOString().slice(0, 10);
}
export function money(paisa: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: paisa % 100 ? 2 : 0,
  }).format(paisa / 100);
}
export function amount(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,8}(\.\d{1,2})?$/.test(value))
    throw new Error("Enter a valid amount with at most two decimal places.");
  const paisa = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(paisa) || paisa <= 0)
    throw new Error("Payment must be greater than zero.");
  return paisa;
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + "T00:00:00Z")) &&
    new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value
  );
}
