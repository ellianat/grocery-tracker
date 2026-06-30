import { useState } from 'react';
import AddEntryForm from './components/AddEntryForm';
import ComparisonTable from './components/ComparisonTable';
import FrequentItems from './components/FrequentItems';
import PriceHistoryModal from './components/PriceHistoryModal';
import { useGroceryData } from './hooks/useGroceryData';
import { exportToCsv } from './utils/exportCsv';
import './App.css';

export default function App() {
  const { data, addPriceEntry, deleteItem, deletePriceEntry } = useGroceryData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = data.items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const modalItem = selectedItem
    ? data.items.find(i => i.id === selectedItem.id) || null
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">GroceryTracker</span>
          </div>
          <p className="tagline">Compare prices across your favorite stores</p>
        </div>
      </header>

      <main className="app-main">
        <section className="add-section">
          <AddEntryForm items={data.items} onAdd={addPriceEntry} />
        </section>

        <section className="list-section">
          <FrequentItems items={data.items} onSelectItem={setSelectedItem} />

          <div className="list-header">
            <h2 className="section-label">All Items</h2>
            <div className="list-actions">
              <input
                className="search-input"
                placeholder="Search items…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {data.items.length > 0 && (
                <button
                  className="btn-export"
                  onClick={() => exportToCsv(data.items)}
                  title="Download price history as CSV"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>

          <ComparisonTable items={filtered} onSelectItem={setSelectedItem} />
        </section>
      </main>

      {modalItem && (
        <PriceHistoryModal
          item={modalItem}
          onClose={() => setSelectedItem(null)}
          onDeleteItem={id => { deleteItem(id); setSelectedItem(null); }}
          onDeleteEntry={deletePriceEntry}
        />
      )}
    </div>
  );
}
