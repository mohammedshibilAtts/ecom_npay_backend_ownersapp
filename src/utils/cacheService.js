import { LRUCache } from "lru-cache";

const options = {
  max: 500, // Maximum 500 items
  ttl: 1000 * 60 * 60 * 24, // Default 24 hours TTL
};

const cache = new LRUCache(options);

class CacheService {
  get(key) {
    return cache.get(key);
  }

  set(key, value, ttl = undefined) {
    if (ttl) {
      cache.set(key, value, { ttl });
    } else {
      cache.set(key, value);
    }
  }

  del(key) {
    cache.delete(key);
  }

  invalidatePattern(pattern) {
    const keysToDelete = [];
    for (const key of cache.keys()) {
      if (key.startsWith(pattern)) {
        keysToDelete.push(key);
      }
    }
    for (const key of keysToDelete) {
      cache.delete(key);
    }
  }

  clear() {
    cache.clear();
  }
}

export default new CacheService();
