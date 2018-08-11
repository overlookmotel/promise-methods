/* --------------------
 * promise-methods module
 * `finally` method
 * ------------------*/

'use strict';

// Imports
const promiseTry = require('./try');

// Exports

/**
 * Register a callback on promise that runs regardless of whether promise
 * resolves or rejects.
 * Polyfill for `Promise.prototype.finally()`.
 *
 * @param {Promise} promise - Promise
 * @param {Function} fn - Callback function
 * @returns {Promise}
 */
module.exports = function promiseFinally(promise, fn) {
	return promise.then(
		res => promiseTry(fn).then(() => res),
		err => promiseTry(fn).then(() => Promise.reject(err))
	);
};
