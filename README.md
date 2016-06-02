# TypedArray Slice Polyfill

[![Build Status](https://travis-ci.org/jaredmcateer/typedarray-slice.svg?branch=master)](https://travis-ci.org/jaredmcateer/typedarray-slice)

Node v0.12 changed from a native implementation of TypedArrays to the V8 engine
implementation. Unfortunately during this time the `slice` method on the
TypedArrays had not been implemented yet. There is another method that is
similar, `subarray`, however, it creates a live view of the array rather than
a shallow copy, thus editing either the original array or the subarray would
have effects on each other.

The purpose of this polyfill to restore the shallow copy functionality in 
TypedArrays for v0.12. v0.10 and v4+ all contain a functional `slice` method
implementation. 

## Installation

`npm install typedarray-slice`

## Usage

As this is a polyfill it does not need export anything, simply require the
module at the beginning of your app and all TypedArrays will have the `slice`
method added to their prototype

e.g.,

```
// index.js
require('typedarray-slice');
```

## Notes

This polyfill is mostly based on the algorithm provided by [The MDN article on
polyfilling old browsers to support `slice` in DOM lists][1], however, it has been
adapted for use in TypedArrays and these arrays will be of the same type as the
original array they were sliced from.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Streamlining_cross-browser_behavior
