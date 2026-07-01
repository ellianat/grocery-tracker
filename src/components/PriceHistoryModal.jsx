import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';
import {
  DATED_STORES, TJ, STORE_COLORS, formatPrice, formatDate, formatUnit, calcPricePerUnit, saleStatus, latestEntry
} from '../utils/helpers';
import OrganicBadge from './OrganicBadge';

function buildChartData(item) {
  const dateSet = new Set();
  for (const store of DATED_STORES) {
    (item.prices?.[store] || []).forEach(e => dateSet.add(e.date));
  }
  const dates = [...dateSet].sort();

  return dates.map(date => {
    const point = { date };
    for (const store of DATED_STORES) {
      const entries = (item.prices?.[store] || [])
        .filter(e => e.date <= date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      if (entries.length > 0) {
        point[store] = entries[0].price;
      }
    }
    return point;
  });
}

function SaleExpiryTag({ saleExpiry }) {
  if (!saleExpiry) return null;
  const status = saleStatus({ saleExpiry });
  const label = status === 'expired' ? 'Sale ended' : 'Sale ends';
  const cls = status === 'expired' ? 'expiry-expired' : status === 'expiring-soon' ? 'expiry-soon' : 'expiry-ok';
  return (
    <span className={`expiry-tag ${cls}`}>{label} {formatDate(saleExpiry)}</span>
  );
}

export default function PriceHistoryModal({ item, onClose, onDeleteItem, onDeleteEntry }) {
  const chartData = buildChartData(item);
  const hasDatedData = chartData.length > 0;
  const tjEntry = latestEntry(item, TJ);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>
            {item.name}
            {item.isOrganic && <OrganicBadge />}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {tjEntry && (
            <div className="tj-baseline">
              <span className="store-dot" style={{ background: STORE_COLORS[TJ] }} />
              <strong>Trader Joe's baseline:</strong>&nbsp;{formatPrice(tjEntry.price)}
              {tjEntry.unitSize && (
                <span className="unit-info">
                  &nbsp;·&nbsp;{formatUnit(tjEntry.unitSize, tjEntry.unitType)}
                  {calcPricePerUnit(tjEntry.price, tjEntry.unitSize) != null && (
                    <> · {formatPrice(calcPricePerUnit(tjEntry.price, tjEntry.unitSize))}/{tjEntry.unitType}</>
                  )}
                </span>
              )}
              <button
                className="delete-entry-btn"
                onClick={() => onDeleteEntry(item.id, TJ, 0)}
                title="Remove TJ price"
              >✕</button>
            </div>
          )}

          {hasDatedData && (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11, fill: '#888' }}
                  />
                  <YAxis
                    tickFormatter={v => `$${v.toFixed(2)}`}
                    tick={{ fontSize: 11, fill: '#888' }}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v, name) => [formatPrice(v), name]}
                    labelFormatter={formatDate}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e0d8', fontSize: 13 }}
                  />
                  <Legend />
                  {tjEntry && (
                    <ReferenceLine
                      y={tjEntry.price}
                      stroke={STORE_COLORS[TJ]}
                      strokeDasharray="6 3"
                      label={{ value: `TJ's ${formatPrice(tjEntry.price)}`, fill: STORE_COLORS[TJ], fontSize: 11 }}
                    />
                  )}
                  {DATED_STORES.map(store => (
                    <Line
                      key={store}
                      type="monotone"
                      dataKey={store}
                      stroke={STORE_COLORS[store]}
                      strokeWidth={2}
                      dot={{ r: 4, fill: STORE_COLORS[store] }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {!hasDatedData && (
            <p className="no-history">No dated price entries yet. Add prices from Safeway, Target, Lucky's, or Raley's to see history.</p>
          )}

          {DATED_STORES.map(store => {
            const entries = [...(item.prices?.[store] || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
            if (entries.length === 0) return null;
            return (
              <div key={store} className="store-history">
                <h4 style={{ color: STORE_COLORS[store] }}>{store}</h4>
                <ul>
                  {entries.map((e, i) => {
                    const ppu = calcPricePerUnit(e.price, e.unitSize);
                    return (
                      <li key={i}>
                        <span>{formatDate(e.date)}</span>
                        <span className="history-price">{formatPrice(e.price)}</span>
                        {e.unitSize && (
                          <span className="history-unit">
                            {formatUnit(e.unitSize, e.unitType)}
                            {ppu != null && ` · ${formatPrice(ppu)}/${e.unitType}`}
                          </span>
                        )}
                        {e.saleExpiry && <SaleExpiryTag saleExpiry={e.saleExpiry} />}
                        <button
                          className="delete-entry-btn"
                          onClick={() => onDeleteEntry(item.id, store, item.prices[store].indexOf(e))}
                          title="Delete entry"
                        >✕</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="btn-danger" onClick={() => { onDeleteItem(item.id); onClose(); }}>
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
