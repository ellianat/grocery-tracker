export const STORES = ["Trader Joe's", "Safeway", "Target", "Lucky's", "Raley's", "Costco"];
export const TJ = "Trader Joe's";
export const DATED_STORES = STORES.filter(s => s !== TJ);

export const STORE_COLORS = {
  "Trader Joe's": '#e63946',
  "Safeway": '#2563eb',
  "Target": '#dc2626',
  "Lucky's": '#16a34a',
  "Raley's": '#9333ea',
  "Costco": '#0891b2',
};

export const UNIT_TYPES = ['oz', 'fl oz', 'lbs', 'g', 'kg', 'ml', 'L', 'ct'];

// Returns the full latest entry object for a store (handles legacy tjPrice)
export function latestEntry(item, store) {
  if (store === TJ) {
    if (item.tj) return item.tj;
    if (item.tjPrice != null) return { price: item.tjPrice };
    return null;
  }
  const entries = item.prices?.[store];
  if (!entries || entries.length === 0) return null;
  return [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

export function latestPrice(item, store) {
  return latestEntry(item, store)?.price ?? null;
}

export function calcPricePerUnit(price, unitSize) {
  const size = Number(unitSize);
  if (price == null || !unitSize || isNaN(size) || size === 0) return null;
  return price / size;
}

// Returns 'expired', 'expiring-soon', or null
export function saleStatus(entry) {
  if (!entry?.saleExpiry) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(entry.saleExpiry + 'T00:00:00');
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring-soon';
  return null;
}

export function allCurrentPrices(item) {
  return STORES.map(store => ({
    store,
    price: latestPrice(item, store),
  })).filter(x => x.price !== null);
}

export function cheapestStore(item) {
  const prices = allCurrentPrices(item);
  if (prices.length === 0) return null;
  return prices.reduce((min, x) => (x.price < min.price ? x : min));
}

export function itemFrequency(item) {
  let count = (item.tj != null || item.tjPrice != null) ? 1 : 0;
  for (const store of DATED_STORES) {
    count += (item.prices?.[store]?.length ?? 0);
  }
  return count;
}

export function formatPrice(price) {
  return price == null ? '—' : `$${Number(price).toFixed(2)}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatUnit(unitSize, unitType) {
  if (!unitSize) return null;
  return `${unitSize} ${unitType || ''}`.trim();
}
