/* --------------------
 * promise-methods module
 * `method` method
 * ------------------*/

'use strict';

// Exports

/**
 * Convert function to one that always returns a promise.
 * @param {Function} fn - Function
 * @returns {Function} - Wrapped function
 */
module.exports = function method(fn) {
	return function() {
		try {
			const res = fn.apply(this, arguments);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
};
