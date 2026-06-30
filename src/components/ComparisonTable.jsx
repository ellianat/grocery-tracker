import { STORES, latestPrice, cheapestStore, formatPrice, itemFrequency } from '../utils/helpers';
import { STORE_COLORS } from '../utils/helpers';

export default function ComparisonTable({ items, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items yet. Add your first grocery price above.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Item</th>
            {STORES.map(s => (
              <th key={s} style={{ color: STORE_COLORS[s] }}>{s}</th>
            ))}
            <th>Best Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const best = cheapestStore(item);
            return (
              <tr key={item.id} className="item-row" onClick={() => onSelectItem(item)}>
                <td className="item-name">
                  {item.name}
                  {itemFrequency(item) >= 3 && (
                    <span className="freq-badge" title="Frequently tracked">★</span>
                  )}
                </td>
                {STORES.map(store => {
                  const p = latestPrice(item, store);
                  const isBest = best && best.store === store && p !== null;
                  return (
                    <td
                      key={store}
                      className={isBest ? 'best-price' : p === null ? 'no-price' : ''}
                    >
                      {formatPrice(p)}
                    </td>
                  );
                })}
                <td className="best-cell">
                  {best ? (
                    <span className="best-tag" style={{ background: STORE_COLORS[best.store] }}>
                      {best.store} {formatPrice(best.price)}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
