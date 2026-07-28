export const AL_AIN_CAMP_START = "2026-07-01";
export const AL_AIN_CAMP_END = "2026-08-19";
export const AL_AIN_DAY_RATE = 110;

export const isAlAinFullCampPlan = (planName = "") =>
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

export function countMonToThuDays(startDate, endDate) {
  const start = toLocalDate(startDate);
  const end = toLocalDate(endDate);

  if (!start || !end || start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day >= 1 && day <= 4) count++;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function formatAlAinCampPrice(price) {
  return price.toLocaleString("en-US");
}

export function getAlAinFullCampPricing(startDate = new Date()) {
  const start = toLocalDate(startDate);
  const end = toLocalDate(AL_AIN_CAMP_END);
  const days = countMonToThuDays(start, end);
  const price = days * AL_AIN_DAY_RATE;

  return {
    days,
    price,
    priceFormatted: formatAlAinCampPrice(price),
    name: `Full Camp (${days} Days Access)`,
    description: `${days} days access for the full camp (Monday to Thursday each week)`,
  };
}

export function applyAlAinFullCampPricing(plan, startDate = new Date()) {
  if (!isAlAinFullCampPlan(plan?.name)) return plan;

  const pricing = getAlAinFullCampPricing(startDate);

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

export function getAlAinDefaultStartDate(referenceDate = new Date()) {
  const today = toLocalDate(referenceDate);
  const campStart = toLocalDate(AL_AIN_CAMP_START);
  const campEnd = toLocalDate(AL_AIN_CAMP_END);

  if (!today || !campStart || !campEnd) return AL_AIN_CAMP_START;
  if (today < campStart) return AL_AIN_CAMP_START;
  if (today > campEnd) return AL_AIN_CAMP_END;
  return formatDateInput(today);
}
