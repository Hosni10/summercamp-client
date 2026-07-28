export const ABU_DHABI_CAMP_START = "2026-07-01";
export const ABU_DHABI_CAMP_END = "2026-08-23";
export const ABU_DHABI_DAY_RATE = 128;

export const isAbuDhabiFullCampPlan = (planName = "") =>
  planName.toLowerCase().includes("full camp");

function toLocalDate(dateInput) {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const normalized = String(dateInput).includes("T")
    ? String(dateInput)
    : `${String(dateInput)}T00:00:00`;
  const d = new Date(normalized);
  d.setHours(0, 0, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function countMonToFriDays(startDate, endDate) {
  const start = toLocalDate(startDate);
  const end = toLocalDate(endDate);

  if (!start || !end || start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day >= 1 && day <= 5) count++;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function formatAbuDhabiCampPrice(price) {
  return price.toLocaleString("en-US");
}

export function getAbuDhabiFullCampPricing(startDate = new Date()) {
  const start = toLocalDate(startDate);
  const end = toLocalDate(ABU_DHABI_CAMP_END);
  const days = countMonToFriDays(start, end);
  const price = days * ABU_DHABI_DAY_RATE;

  return {
    days,
    price,
    priceFormatted: formatAbuDhabiCampPrice(price),
    name: `Full Camp (${days} Days Access)`,
    description: `${days} days access for the full camp (Monday to Friday each week)`,
  };
}

export function applyAbuDhabiFullCampPricing(plan, startDate = new Date()) {
  if (!isAbuDhabiFullCampPlan(plan?.name)) return plan;

  const pricing = getAbuDhabiFullCampPricing(startDate);

  return {
    ...plan,
    name: pricing.name,
    description: pricing.description,
    price: pricing.priceFormatted,
    fullCampDays: pricing.days,
  };
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAbuDhabiFullCampStartDate(
  formStartDate = "",
  minStartDate = ABU_DHABI_CAMP_START
) {
  if (formStartDate) return formStartDate;

  const suggested = getAbuDhabiDefaultStartDate();
  return suggested < minStartDate ? minStartDate : suggested;
}

export function getAbuDhabiDefaultStartDate(referenceDate = new Date()) {
  const today = toLocalDate(referenceDate);
  const campStart = toLocalDate(ABU_DHABI_CAMP_START);
  const campEnd = toLocalDate(ABU_DHABI_CAMP_END);

  if (!today || !campStart || !campEnd) return ABU_DHABI_CAMP_START;
  if (today < campStart) return ABU_DHABI_CAMP_START;
  if (today > campEnd) return ABU_DHABI_CAMP_END;
  return formatDateInput(today);
}
