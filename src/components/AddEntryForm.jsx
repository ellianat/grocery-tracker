import { useState, useRef, useEffect } from 'react';
import { STORES, TJ } from '../utils/helpers';

export default function AddEntryForm({ items, onAdd }) {
  const [name, setName] = useState('');
  const [store, setStore] = useState(STORES[0]);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const allNames = items.map(i => i.name);

  function handleNameChange(val) {
    setName(val);
    if (val.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = allNames.filter(n =>
      n.toLowerCase().includes(val.toLowerCase())
    );
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
      date: store === TJ ? null : date,
    });
    setName('');
    setPrice('');
    setDate(new Date().toISOString().slice(0, 10));
  }

  const isTJ = store === TJ;

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
          <select value={store} onChange={e => setStore(e.target.value)}>
            {STORES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
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

      <button type="submit" className="btn-primary">Add Entry</button>
    </form>
  );
}
