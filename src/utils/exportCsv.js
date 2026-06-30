import { STORES, TJ, DATED_STORES, calcPricePerUnit } from './helpers';

function escape(val) {
  if (val == null || val === '') return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportToCsv(items) {
  const headers = [
    'Item Name', 'Store', 'Price', 'Package Size', 'Unit', 'Price Per Unit', 'Date Entered', 'Sale Expiry Date'
  ];

  const rows = [headers.map(escape).join(',')];

  for (const item of items) {
    // Trader Joe's entry
    const tj = item.tj || (item.tjPrice != null ? { price: item.tjPrice } : null);
    if (tj) {
      const ppu = calcPricePerUnit(tj.price, tj.unitSize);
      rows.push([
        item.name,
        TJ,
        tj.price != null ? tj.price.toFixed(2) : '',
        tj.unitSize ?? '',
        tj.unitType ?? '',
        ppu != null ? ppu.toFixed(4) : '',
        '',
        '',
      ].map(escape).join(','));
    }

    // Dated store entries
    for (const store of DATED_STORES) {
      for (const e of (item.prices?.[store] || [])) {
        const ppu = calcPricePerUnit(e.price, e.unitSize);
        rows.push([
          item.name,
          store,
          e.price != null ? e.price.toFixed(2) : '',
          e.unitSize ?? '',
          e.unitType ?? '',
          ppu != null ? ppu.toFixed(4) : '',
          e.date ?? '',
          e.saleExpiry ?? '',
        ].map(escape).join(','));
      }
    }
  }

  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grocery-prices-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
