import "./index-BhbW23l5.js";
function formatCurrency(cents) {
  const n = Number(cents);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n / 100);
}
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(ms));
}
export {
  formatDate as a,
  formatCurrency as f
};
