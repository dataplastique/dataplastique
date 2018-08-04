# Immutable.js has been modified locally!

There was a Rollup conflict with Immutable because it was already rolled up with Rollup, so we copied the file into the repo and fixed the offending line:

```js
reduce: function reduce$1(...) { /* calling another function reduce() */ }
```

The other `reduce()` would be renamed to `reduce$1` during our Rollup process and so the above would recurse for all enternity. We fixed it like this:

```js
reduce: function(...) { /* now an anonymous function */ }
```

Sorry about that. The local version of Immutable.js is `4.0.0-rc.9`.