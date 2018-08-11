/* --------------------
 * promise-methods module
 * `try` method
 * ------------------*/

'use strict';

// Exports

/**
 * Run function and always return promise.
 * @param {Function} fn - Function
 * @returns {Promise} - Promise resolved with value returned by `fn()`
 */
module.exports = function promiseTry(fn) {
	try {
		const res = fn();
		return Promise.resolve(res);
	} catch (err) {
		return Promise.reject(err);
	}
};
