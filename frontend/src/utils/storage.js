// Lightweight storage helper: try localStorage first, fall back to IndexedDB on quota errors.

const DB_NAME = 'ssplp_storage';
const STORE_NAME = 'kv';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result === undefined ? null : req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbRemove(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Public API: setItem/getItem/removeItem
export async function setItem(key, value) {
  const str = JSON.stringify(value);
  try {
    // try localStorage first
    localStorage.setItem(key, str);
    return true;
  } catch (err) {
    // quota or other error -> fallback to IndexedDB
    try {
      await idbPut(key, str);
      console.warn(`Persisted "${key}" to IndexedDB due to localStorage failure.`);
      return true;
    } catch (idbErr) {
      console.error('Failed to persist to both localStorage and IndexedDB', idbErr);
      return false;
    }
  }
}

export async function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch (err) {
    // fallthrough to IndexedDB
  }
  try {
    const raw = await idbGet(key);
    return raw === null ? null : JSON.parse(raw);
  } catch (idbErr) {
    console.error('Failed to read from IndexedDB', idbErr);
    return null;
  }
}

export async function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // ignore and try IndexedDB
  }
  try {
    await idbRemove(key);
    return true;
  } catch (idbErr) {
    console.error('Failed to remove from IndexedDB', idbErr);
    return false;
  }
}
