/**
 * IndexedDB storage engine for Roohi's Journal
 * Provides multi-gigabyte local storage quota for images, articles, and drafts without localStorage 5MB limit errors.
 */

const DB_NAME = 'roohi_journal_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval_store';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  return dbPromise;
}

// In-memory cache for ultra-fast sync lookups
const memoryCache: Record<string, any> = {};

export async function idbGet<T = any>(key: string): Promise<T | null> {
  if (key in memoryCache) {
    return memoryCache[key];
  }

  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const val = req.result;
        if (val !== undefined) {
          memoryCache[key] = val;
          resolve(val);
        } else {
          // Check localStorage as legacy fallback
          try {
            const lsVal = localStorage.getItem(key);
            if (lsVal) {
              const parsed = JSON.parse(lsVal);
              memoryCache[key] = parsed;
              resolve(parsed);
              return;
            }
          } catch {}
          resolve(null);
        }
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    try {
      const lsVal = localStorage.getItem(key);
      return lsVal ? JSON.parse(lsVal) : null;
    } catch {
      return memoryCache[key] || null;
    }
  }
}

export async function idbSet(key: string, value: any): Promise<void> {
  memoryCache[key] = value;

  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // If IDB fails, attempt localStorage with safe try/catch
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // If quota exceeded, we still retain in-memory cache
    }
  }
}

export async function idbDelete(key: string): Promise<void> {
  delete memoryCache[key];

  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
}

// Clean up any bloated local storage keys
if (typeof window !== 'undefined') {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('roohi_storage_') ||
          key.startsWith('lara_storage_') ||
          key === 'roohi_articles_data' ||
          key === 'roohi_photos_data' ||
          key === 'lara_articles_data' ||
          key === 'lara_photos_data')
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  } catch {}
}
