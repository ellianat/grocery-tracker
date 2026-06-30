const KEY = 'grocery-tracker-v1';

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
