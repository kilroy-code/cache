import Cache from '../index.mjs';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Cache", function () {
  let testingMaxSize = 20,
      cache = new Cache(testingMaxSize),
      notSet = "notSet",
      isSet = "this is set",
      setValue = 17;
  cache.set(isSet, setValue);
  it("get() fails if not set", function () {
    expect(cache.get('not-set')).toBeUndefined();
  });
  it("has() is false if not set", function () {
    expect(cache.has('not-set')).toBe(false);
  });
  it("get() answers what is set().", function () {
    expect(cache.get(isSet)).toBe(setValue);
  });
  it("has() is true if set.", function () {
    expect(cache.has(isSet)).toBe(true);
  });
  it("delete() removes what is set.", function () {
    let key = "temp",
        value = 42;
    cache.set(key, value);
    expect(cache.has(key)).toBe(true);
    expect(cache.get(key)).toBe(value);
    cache.delete(key);
    expect(cache.has(key)).toBe(false);
    expect(cache.get(key)).toBeUndefined();
  });
  it("size reports has many are in the cache, and clear removes all.", function () {
    expect(cache.size).toBe(1);
    for (let i=0; i<10; i++) cache.set(i, i);
    expect(cache.size).toBe(11);
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.has(isSet)).toBe(false);
    cache.set(isSet, setValue);
  });
  it("can specify a time to live during set().", async function () {
    expect(cache.defaultTimeToLive).toBe(0);
    cache.defaultTimeToLive = 2e3;    
    let key = 'foo', value = true, ttl = 1e3;
    cache.set(key, value, ttl);
    expect(cache.has(key)).toBe(true);
    await delay(ttl);
    expect(cache.has(key)).toBe(false);
    cache.defaultTimeToLive = 0; // Continue testing with a zero default.
  });
  it("uses default ttl.", async function () {
    cache.defaultTimeToLive = 2e3;
    let key = 'foo', value = true;
    cache.set(key, value);
    expect(cache.has(key)).toBe(true);
    await delay(cache.defaultTimeToLive);
    expect(cache.has(key)).toBe(false);
    cache.defaultTimeToLive = 0;    // Continue testing with a zero dfault.
  });
  it("set() can have zero ttl, which does not evict.", async function () {
    let key = 'foo', value = true
    expect(cache.defaultTimeToLive).toBe(0);    
    cache.defaultTimeToLive = 2e3;    // Set a non-zero default.
    cache.set(key, value, 0);
    expect(cache.has(key)).toBe(true);
    await delay(cache.defaultTimeToLive);
    expect(cache.has(key)).toBe(true);
    cache.delete(key);
    expect(cache.has(key)).toBe(false);
    cache.defaultTimeToLive = 0;  // Continue testing with a zero default.
  });
  it("only keeps the n most recently set (that have not been timed out).", function () {
    expect(cache.maxSize).toBe(testingMaxSize);
    expect(cache.size).toBe(1);
    expect(cache.has(isSet)).toBe(true);
    for (let i = 0; i < cache.maxSize; i++) cache.set(i, i);
    expect(cache.size).toBe(cache.maxSize); // Even though we stored one more than that, total.
    expect(cache.has(isSet)).toBe(false); // That was the one that was set first.
    expect(cache.has(0)).toBe(true);
    cache.set('one more', true);
    expect(cache.has(0)).toBe(false);
    cache.clear();
    expect(cache.size).toBe(0);
    cache.set(isSet, setValue); // To continue testing.
  });
});
