import {
  STORES, latestEntry, cheapestStore, formatPrice, formatUnit, calcPricePerUnit, saleStatus, itemFrequency
} from '../utils/helpers';
import { STORE_COLORS } from '../utils/helpers';

function SaleStatusBadge({ entry }) {
  const status = saleStatus(entry);
  if (!status) return null;
  if (status === 'expired') {
    return <span className="sale-badge sale-expired" title="Sale may have ended">Expired</span>;
  }
  return <span className="sale-badge sale-expiring" title={`Sale ends ${entry.saleExpiry}`}>Ends soon</span>;
}

function PriceCell({ item, store, isBest }) {
  const entry = latestEntry(item, store);
  if (!entry) return <td className="no-price">—</td>;

  const ppu = calcPricePerUnit(entry.price, entry.unitSize);
  const unitLabel = formatUnit(entry.unitSize, entry.unitType);
  const status = saleStatus(entry);

  return (
    <td className={isBest ? 'best-price' : ''}>
      <div className="cell-price">{formatPrice(entry.price)}</div>
      {ppu != null && (
        <div className="cell-ppu">{formatPrice(ppu)}/{unitLabel?.split(' ').pop() || entry.unitType}</div>
      )}
      {status && <SaleStatusBadge entry={entry} />}
    </td>
  );
}

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
                {STORES.map(store => (
                  <PriceCell
                    key={store}
                    item={item}
                    store={store}
                    isBest={best?.store === store && latestEntry(item, store) !== null}
                  />
                ))}
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
