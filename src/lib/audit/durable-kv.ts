/**
 * The storage paid orders depend on, as a small interface.
 *
 * Production has one implementation, over Redis, and it fails closed: every
 * method throws RedisUnavailableError rather than pretend. The in-memory one
 * exists for tests only and is never picked at runtime.
 */

import { redisStrict } from "@/lib/redis";

export interface DurableKv {
  get(key: string): Promise<string | null>;
  /** Returns false when `onlyIfAbsent` is set and the key already exists. */
  set(key: string, value: string, ttlSeconds: number, onlyIfAbsent?: boolean): Promise<boolean>;
  del(key: string): Promise<void>;
  mget(keys: readonly string[]): Promise<readonly (string | null)[]>;
  incr(key: string, ttlSeconds: number): Promise<number>;
  /** Adds a whole number, negative allowed. Returns the new total. */
  incrby(key: string, by: number, ttlSeconds: number): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrem(key: string, member: string): Promise<void>;
  /** Members with a score at or below `maxScore`, lowest first. */
  zdue(key: string, maxScore: number, limit: number): Promise<readonly string[]>;
  /** The lowest score in the set, or null when it is empty. */
  zmin(key: string): Promise<number | null>;
}

function asStrings(result: unknown): readonly (string | null)[] {
  return Array.isArray(result) ? result.map((item) => (typeof item === "string" ? item : null)) : [];
}

export const redisKv: DurableKv = {
  async get(key) {
    const result = await redisStrict(["GET", key]);
    return typeof result === "string" ? result : null;
  },
  async set(key, value, ttlSeconds, onlyIfAbsent = false) {
    const command = onlyIfAbsent ? ["SET", key, value, "NX", "EX", ttlSeconds] : ["SET", key, value, "EX", ttlSeconds];
    return (await redisStrict(command)) === "OK";
  },
  async del(key) {
    await redisStrict(["DEL", key]);
  },
  async mget(keys) {
    if (keys.length === 0) return [];
    return asStrings(await redisStrict(["MGET", ...keys]));
  },
  async incr(key, ttlSeconds) {
    const value = Number(await redisStrict(["INCR", key]));
    if (value === 1) await redisStrict(["EXPIRE", key, ttlSeconds]);
    return value;
  },
  async incrby(key, by, ttlSeconds) {
    const value = Number(await redisStrict(["INCRBY", key, Math.trunc(by)]));
    await redisStrict(["EXPIRE", key, ttlSeconds]);
    return value;
  },
  async zadd(key, score, member) {
    await redisStrict(["ZADD", key, score, member]);
  },
  async zrem(key, member) {
    await redisStrict(["ZREM", key, member]);
  },
  async zdue(key, maxScore, limit) {
    const result = asStrings(await redisStrict(["ZRANGEBYSCORE", key, "-inf", maxScore, "LIMIT", 0, limit]));
    return result.filter((item): item is string => item !== null);
  },
  async zmin(key) {
    const result = await redisStrict(["ZRANGE", key, 0, 0, "WITHSCORES"]);
    if (!Array.isArray(result) || result.length < 2) return null;
    const score = Number(result[1]);
    return Number.isFinite(score) ? score : null;
  },
};

/** Tests only. Ignores TTLs, which the tests do not depend on. */
export function memoryKv(): DurableKv & { readonly dump: () => ReadonlyMap<string, string> } {
  const values = new Map<string, string>();
  const sets = new Map<string, Map<string, number>>();
  return {
    dump: () => values,
    async get(key) {
      return values.get(key) ?? null;
    },
    async set(key, value, _ttl, onlyIfAbsent = false) {
      if (onlyIfAbsent && values.has(key)) return false;
      values.set(key, value);
      return true;
    },
    async del(key) {
      values.delete(key);
    },
    async mget(keys) {
      return keys.map((key) => values.get(key) ?? null);
    },
    async incr(key) {
      const next = Number(values.get(key) ?? 0) + 1;
      values.set(key, String(next));
      return next;
    },
    async incrby(key, by) {
      const next = Number(values.get(key) ?? 0) + Math.trunc(by);
      values.set(key, String(next));
      return next;
    },
    async zadd(key, score, member) {
      const set = sets.get(key) ?? new Map<string, number>();
      set.set(member, score);
      sets.set(key, set);
    },
    async zrem(key, member) {
      sets.get(key)?.delete(member);
    },
    async zdue(key, maxScore, limit) {
      return [...(sets.get(key) ?? new Map<string, number>()).entries()]
        .filter(([, score]) => score <= maxScore)
        .sort((a, b) => a[1] - b[1])
        .slice(0, limit)
        .map(([member]) => member);
    },
    async zmin(key) {
      const scores = [...(sets.get(key) ?? new Map<string, number>()).values()];
      return scores.length > 0 ? Math.min(...scores) : null;
    },
  };
}
