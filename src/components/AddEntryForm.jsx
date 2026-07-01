import { useState, useRef } from 'react';
import { STORES, TJ, UNIT_TYPES } from '../utils/helpers';

export default function AddEntryForm({ items, onAdd }) {
  const [name, setName] = useState('');
  const [store, setStore] = useState(STORES[0]);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [unitSize, setUnitSize] = useState('');
  const [unitType, setUnitType] = useState('oz');
  const [saleExpiry, setSaleExpiry] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Deduplicate names so both "Milk" variants don't appear twice
  const allNames = [...new Set(items.map(i => i.name))];
  const isTJ = store === TJ;

  function handleNameChange(val) {
    setName(val);
    if (val.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = allNames.filter(n => n.toLowerCase().includes(val.toLowerCase()));
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }

  function pickSuggestion(s) {
    setName(s);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onAdd({
      itemName: name.trim(),
      store,
      price,
      date: isTJ ? null : date,
      unitSize: unitSize || null,
      unitType: unitSize ? unitType : null,
      saleExpiry: (!isTJ && saleExpiry) ? saleExpiry : null,
      isOrganic,
    });
    setName('');
    setPrice('');
    setUnitSize('');
    setSaleExpiry('');
    setIsOrganic(false);
    setDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add Price</h2>

      <div className="form-row">
        <div className="field autocomplete-wrap">
          <label>Item Name</label>
          <input
            ref={inputRef}
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => name && setSuggestions(allNames.filter(n => n.toLowerCase().includes(name.toLowerCase())))}
            onKeyDown={e => e.key === 'Escape' && (setSuggestions([]), setShowSuggestions(false))}
            placeholder="e.g. Almond Milk"
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="suggestions">
              {suggestions.map(s => (
                <li key={s} onMouseDown={() => pickSuggestion(s)}>{s}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="field">
          <label>Store</label>
          <select value={store} onChange={e => { setStore(e.target.value); setShowSuggestions(false); }}>
            {STORES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row organic-row">
        <label className="organic-toggle">
          <input
            type="checkbox"
            checked={isOrganic}
            onChange={e => setIsOrganic(e.target.checked)}
          />
          <span className="organic-check">Organic</span>
        </label>
      </div>

      <div className="form-row">
        <div className="field">
          <label>Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {!isTJ && (
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        )}

        {isTJ && (
          <div className="field tj-note">
            <label>&nbsp;</label>
            <span className="badge tj-badge">Stable baseline — no date needed</span>
          </div>
        )}
      </div>

      <div className="form-row optional-row">
        <div className="field">
          <label>Package Size <span className="optional-label">optional</span></label>
          <div className="unit-inputs">
            <input
              type="number"
              min="0"
              step="any"
              value={unitSize}
              onChange={e => setUnitSize(e.target.value)}
              placeholder="e.g. 32"
              className="unit-size-input"
            />
            <select
              value={unitType}
              onChange={e => setUnitType(e.target.value)}
              className="unit-type-select"
            >
              {UNIT_TYPES.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {!isTJ && (
          <div className="field">
            <label>Sale Ends <span className="optional-label">optional</span></label>
            <input
              type="date"
              value={saleExpiry}
              onChange={e => setSaleExpiry(e.target.value)}
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary">Add Entry</button>
    </form>
  );
}
