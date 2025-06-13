# Cache

A simple, fast, least-recently-used cache (specifically, last set) with active time-to-live eviction, optimized for large-string keys and frequent reads.

It has no dependencies, other than a jasmine dev-dependencies for unit tests.

The implementation has identical performance to Map for reading, and slightly longer than Map for writing and deleting.

The API is identical to Map(), except that:

- The constructor takes a required integer `maxSize` and an optional `defaultTimeToLive`.
  - The cache keeps track of the order in which keys are _set_, and will remove the maxSize oldest key as new ones are set. Note that this keeps the size below `maxSize`, but the actual size may be less than maxSize as more recent keys are removed by the client or by timers.
  - The `defaultTimeToLive` is the default for value for `set()`. Defaults to 0.
- `set(key, value, timeToLive = this.defaultTimeToLive)` takes an optional third parameter that actively deletes key from the cache after the specified number of milliseconds. A timeToLive of 0 means that there is no time limit for that particular key. (The key is still subject to maxSize.)
- `clear(newMaxSize = this.maxSize)` takes an optional parameter that is the new maxSize.