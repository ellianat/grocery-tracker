import { useState, useCallback } from 'react';
import { loadData, saveData } from '../utils/storage';
import { TJ } from '../utils/helpers';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useGroceryData() {
  const [data, setData] = useState(() => loadData());

  const addPriceEntry = useCallback(({ itemName, store, price, date, unitSize, unitType, saleExpiry }) => {
    const trimmed = itemName.trim();
    if (!trimmed) return;

    setData(prev => {
      const items = [...prev.items];
      let item = items.find(i => i.name.toLowerCase() === trimmed.toLowerCase());

      if (!item) {
        item = { id: generateId(), name: trimmed, tj: null, tjPrice: null, prices: {} };
        items.push(item);
      } else {
        const idx = items.indexOf(item);
        item = { ...item, prices: { ...item.prices } };
        items[idx] = item;
      }

      const parsedUnit = unitSize ? Number(unitSize) : null;
      const resolvedUnitType = parsedUnit ? (unitType || null) : null;

      if (store === TJ) {
        item.tj = {
          price: parseFloat(price),
          unitSize: parsedUnit,
          unitType: resolvedUnitType,
        };
        // keep for backward compat with old localStorage data
        item.tjPrice = parseFloat(price);
      } else {
        const existing = item.prices[store] ? [...item.prices[store]] : [];
        existing.push({
          price: parseFloat(price),
          date,
          unitSize: parsedUnit,
          unitType: resolvedUnitType,
          saleExpiry: saleExpiry || null,
        });
        item.prices[store] = existing;
      }

      const next = { ...prev, items };
      saveData(next);
      return next;
    });
  }, []);

  const deleteItem = useCallback((itemId) => {
    setData(prev => {
      const next = { ...prev, items: prev.items.filter(i => i.id !== itemId) };
      saveData(next);
      return next;
    });
  }, []);

  const deletePriceEntry = useCallback((itemId, store, entryIndex) => {
    setData(prev => {
      const items = prev.items.map(item => {
        if (item.id !== itemId) return item;
        if (store === TJ) return { ...item, tj: null, tjPrice: null };
        const updated = [...(item.prices[store] || [])];
        updated.splice(entryIndex, 1);
        return { ...item, prices: { ...item.prices, [store]: updated } };
      });
      const next = { ...prev, items };
      saveData(next);
      return next;
    });
  }, []);

  return { data, addPriceEntry, deleteItem, deletePriceEntry };
}
