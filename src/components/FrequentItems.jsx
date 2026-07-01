import { itemFrequency, cheapestStore, formatPrice } from '../utils/helpers';
import { STORE_COLORS } from '../utils/helpers';
import OrganicBadge from './OrganicBadge';

export default function FrequentItems({ items, onSelectItem }) {
  const frequent = [...items]
    .filter(i => itemFrequency(i) >= 2)
    .sort((a, b) => itemFrequency(b) - itemFrequency(a))
    .slice(0, 6);

  if (frequent.length === 0) return null;

  return (
    <div className="frequent-section">
      <h3 className="section-label">Frequently Tracked</h3>
      <div className="freq-chips">
        {frequent.map(item => {
          const best = cheapestStore(item);
          return (
            <button key={item.id} className="freq-chip" onClick={() => onSelectItem(item)}>
              <span className="freq-name">{item.name}</span>
              {item.isOrganic && <OrganicBadge />}
              {best && (
                <span className="freq-price" style={{ color: STORE_COLORS[best.store] }}>
                  {formatPrice(best.price)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
