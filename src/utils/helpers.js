export const STORES = ["Trader Joe's", "Safeway", "Target", "Lucky's", "Raley's"];
export const TJ = "Trader Joe's";
export const DATED_STORES = STORES.filter(s => s !== TJ);

export const STORE_COLORS = {
  "Trader Joe's": '#e63946',
  "Safeway": '#2563eb',
  "Target": '#dc2626',
  "Lucky's": '#16a34a',
  "Raley's": '#9333ea',
};

// Get the most recent price entry for a dated store
export function latestPrice(item, store) {
  if (store === TJ) {
    return item.tjPrice ?? null;
  }
  const entries = item.prices?.[store];
  if (!entries || entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0].price;
}

// Get all prices currently available for an item across stores
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

// Frequency: count total number of price entries ever logged for an item
export function itemFrequency(item) {
  let count = item.tjPrice != null ? 1 : 0;
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
