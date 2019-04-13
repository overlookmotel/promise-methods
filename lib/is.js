/* --------------------
 * promise-methods module
 * `is` method
 * ------------------*/

'use strict';

// Exports

/**
 * Check if input is a promise.
 *
 * @param {*} obj - Maybe promise
 * @returns {boolean} - `true` if is a promise, `false` if not
 */
module.exports = function is(obj) {
	return !!obj && typeof obj.then === 'function';
};
