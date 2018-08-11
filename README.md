# promise-methods.js

# Useful Promise helpers

## Current status

[![NPM version](https://img.shields.io/npm/v/promise-methods.svg)](https://www.npmjs.com/package/promise-methods)
[![Build Status](https://img.shields.io/travis/overlookmotel/promise-methods/master.svg)](http://travis-ci.org/overlookmotel/promise-methods)
[![Dependency Status](https://img.shields.io/david/overlookmotel/promise-methods.svg)](https://david-dm.org/overlookmotel/promise-methods)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/promise-methods.svg)](https://david-dm.org/overlookmotel/promise-methods)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookmotel/promise-methods.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/promise-methods/master.svg)](https://coveralls.io/r/overlookmotel/promise-methods)

## What's it for?

A bunch of useful helper methods for dealing with Promises.

Uses native JS Promises, and does not patch or alter the global `Promise` object.

Not optimized for performance at present, but well tested and it all works.

## Usage

The following methods are provided:

* `try( fn )`
* `method( fn )`
* `parallel( fns [, concurrency] )`
* `series( fns )`
* `all( arr )`
* `props( obj )`
* `propsOwn( obj )`
* `forEach( arr, fn [, options] )`
* `forEachSeries( arr, fn )`
* `map( arr, fn [, options] )`
* `mapSeries( arr, fn )`
* `forIn( obj, fn [, options] )`
* `forInSeries( obj, fn )`
* `forOwn( obj, fn [, options] )`
* `forOwnSeries( obj, fn )`
* `mapIn( obj, fn [, options] )`
* `mapInSeries( obj, fn )`
* `mapOwn( obj, fn [, options] )`
* `mapOwnSeries( obj, fn )`
* `wait( [ms] )`
* `defer()`
* `finally( promise, fn )`
* `Queue` class

All methods are also provided with longer names suitable for destructuring e.g. `map()` is also aliased as `promiseMap()`.

```js
const { promiseMap } = require('promise-methods');
```

### Function methods

#### `try( fn )`

Call a function and always return a promise.

* If function returns a Promise, returns that Promise.
* If function returns a plain value, returns a Promise that resolves to that value.
* If the function throws synchronously, returns a Promise that is rejected with the error.

```js
const P = require('promise-methods');

P.try( () => {
  return 123;
} ).then( res => {
  // res == 123
} );

P.try( () => {
  throw new Error('Oops!');
} ).catch( err => {
  // Error is caught here rather than thrown synchronously
} );
```

#### `method( fn )`

Wrap a function into one that always returns a Promise. Behavior of the returned function is same as `try()` above.

```js
const fn = P.method( () => {
  throw new Error('Oops!');
} );

fn().catch( err => {
  // Error is caught here rather than thrown synchronously
} );
```

### Queue methods

#### `parallel( fns [, concurrency] )`

Execute an array of functions in parallel, with a limit on concurrency set with `concurrency` argument.

```js
const res = await P.parallel( [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
], 2 ); // <-- concurrency = 2

// res = [ 1, 2, 3 ]
```

In above example, 3rd function is not called until 1st function's promise resolves.

For no limit on concurrency, set `concurrency` argument to `0` or leave it undefined.

#### `series( fns )`

Execute an array of functions in series. Each function will not be called until promise returned by previous function has resolved.

```js
const res = await P.series( [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
] );

// res = [ 1, 2, 3 ]
```

### Collection methods

#### `all( arr )`

Identical to native `Promise.all( arr )`.

#### `props( obj )`

Like `Promise.all()` for objects.

For an object whose values are promises, resolves the promises and returns a new object containing the resolved values with the same keys. Only enumerable properties are included.

```js
const fs = require('fs-extra');

const files = await P.props( {
  f1: fs.read('/1.txt'),
  f2: fs.read('/2.txt'),
  f3: fs.read('/3.txt')
} );
// files = { f1: 'file contents 1', f2: 'file contents 2', f3: 'file contents 3' }
```

#### `propsOwn( obj )`

Same as `props()` but only with object's *own* enumerable properties (i.e. properties on the object prototype are ignored).

### Array iteration methods

Array iteration methods iterate over the members of an array and execute a function on each.

The function is called with arguments `( value, index, array )` and is expected to return a Promise.

NB The input array's values are passed as is to the iterator function (i.e. promises are not resolved first). Iteration occurs synchronously.

For all iteration methods, `options.concurrency` limits number of concurrent executions. The default is `0` (no limit).

Each method has a companion `series` method which executes the callback in series. e.g. `map()` has companion method `mapSeries()`. Series methods are equivalent to calling the main method with `options.concurrency = 1`.

#### `forEach( arr, fn [, options] )`

Executes function on each member of an array. Returns a promise which resolves (to `undefined`) when all promises are resolved. The resolution values are discarded - useful for functions with side effects.

```js
await P.forEach(
  [ '1.txt', '2.txt', '3.txt' ],
  filename => fs.copy(`/src/${filename}`, `/dest/${filename}`),
  { concurrency: 2 }
} );
```

In the above example, only 2 file system operations will be executing in at any one time.

#### `map( arr, fn [, options] )`

Executes function on each member of an array and returns promise of an array of the resolution values.

```js
const files = await P.map(
  [ '1.txt', '2.txt', '3.txt' ],
  filename => fs.readFile(`/src/${filename}`, 'utf8')
);
// files = [ 'file contents 1', 'file contents 2', 'file contents 3' ]
```

### Object iteration methods

Object iteration methods iterate over the properties of an object and execute a function on each. The function is expected to return a Promise.

The function is called with arguments `( value, key, object )` and is expected to return a Promise.

NB The object's values are passed as is to the iterator function (i.e. promises are not resolved first). Iteration occurs synchronously.

For all iteration methods, `options.concurrency` limits number of concurrent executions. The default is `0` (no limit).

Each method has a companion `series` method which executes the callback in series. e.g. `mapOwn()` has companion method `mapOwnSeries()`. Series methods are equivalent to calling the main method with `options.concurrency = 1`.

#### `forIn( obj, fn [, options] )`

Executes function on each property of an object. Returns a promise which resolves (to `undefined`) when all promises are resolved. The resolution values are discarded - useful for functions with side effects.

```js
await P.forIn(
  { f1: '1.txt', f2: '2.txt', f3: '3.txt' },
  filename => fs.copy(`/src/${filename}`, `/dest/${filename}`),
  { concurrency: 2 }
} );
```

In the above example, only 2 file system operations will be executing in at any one time.

#### `forOwn( obj, fn [, options] )`

Same as `forIn()` but only with object's *own* enumerable properties (i.e. properties on the object prototype are ignored).

#### `mapIn( arr, fn [, options] )`

Executes function on each property of object and returns promise of an array of the resolution values.

```js
const files = await P.mapIn(
  { f1: '1.txt', f2: '2.txt', f3: '3.txt' },
  filename => fs.readFile(`/src/${filename}`, 'utf8')
);
// files = { f1: 'file contents 1', f2: 'file contents 2', f3: 'file contents 3' }
```

#### `mapOwn( obj, fn [, options] )`

Same as `mapIn()` but only with object's *own* enumerable properties (i.e. properties on the object prototype are ignored).

### Miscellaneous

#### `wait( [ms] )`

Create a Promise that resolves after a specified time period.

```js
await P.wait(100);
// Promise resolves after 100ms
```

If `ms` is not specified, promise resolves after 0 ms (using `setTimeout()`).

#### `defer()`

Create a "defered" i.e. promise where you can resolve/reject it from outside the constructor.

```js
const deferred = P.defer();

deferred.promise.then( res => {
  // res == 123
} );

deferred.resolve( 123 );
```

#### `finally( promise, fn )`

Replacement for [`Promise.prototype.finally()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally) for environments which don't support it natively.

Callback is called whether or not the input promise resolves or rejects.

```js
const promise = doSomethingAsync();
P.finally( promise, () => {
  // Executes whether promise resolves or rejects
} );
```

### Queue class

A queue for promise-returning functions. Functions are called in the order they are added, with a limit on concurrency set with `options.concurrency`. Each function is expected to return a Promise. Once the maximum number of functions are executing, it waits until one function's promise resolves before executing the next in the queue.

```js
const queue = new P.Queue( { concurrency: 2 } );

queue.add( () => Promise.resolve(1) )
  .add( () => Promise.resolve(2) )
  .add( () => Promise.resolve(3) );

await queue.promise;
// queue.promise resolves once all promises returned from functions are resolved
```

In the example above, the 3rd function will not start executing until the promise returned by 1st function is resolved.

If `options.concurrency` is `0` or not provided, there is no limit on concurrency - functions will be executed as soon as they are added to the queue.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/promise-methods/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/promise-methods/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
