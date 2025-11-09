import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { Persister } from "@tanstack/react-query-persist-client";

const STORAGE_KEY = "cfi-react-query-cache-v1";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
}

const storage: Storage =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : createMemoryStorage();

export const queryCachePersister: Persister = createSyncStoragePersister({
  storage,
  key: STORAGE_KEY,
});

export const QUERY_CACHE_MAX_AGE = 86_400_000; // 24 hours

