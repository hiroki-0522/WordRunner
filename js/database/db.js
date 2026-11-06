const DB_NAME = 'wordrunner-db';
const DB_VERSION = 1;
let database;
function openDatabase() {
  if (database) return Promise.resolve(database);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore('sets', { keyPath: 'id' });
    request.onsuccess = () => { database = request.result; resolve(database); };
    request.onerror = () => reject(request.error);
  });
}
function transaction(mode, action) { return openDatabase().then(db => new Promise((resolve, reject) => { const tx = db.transaction('sets', mode); const result = action(tx.objectStore('sets')); tx.oncomplete = () => resolve(result); tx.onerror = () => reject(tx.error); })); }
export const getSets = () => transaction('readonly', store => new Promise((resolve, reject) => { const r = store.getAll(); r.onsuccess = () => resolve(r.result.sort((a, b) => a.createdAt - b.createdAt)); r.onerror = () => reject(r.error); }));
export const getSet = id => transaction('readonly', store => new Promise((resolve, reject) => { const r = store.get(id); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }));
export const saveSet = set => transaction('readwrite', store => store.put(set));
export const deleteSet = id => transaction('readwrite', store => store.delete(id));
export const createSet = name => { const now = Date.now(); return { id: crypto.randomUUID(), name, memo: '', createdAt: now, updatedAt: now }; };
