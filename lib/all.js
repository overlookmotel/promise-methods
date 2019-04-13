/* --------------------
 * promise-methods module
 * `all` method
 * ------------------*/

'use strict';

// Imports
const allAwait = require('./allAwait');

// Exports

/**
 * Same as `Promise.all()` except adds `await` option.
 * @param {Array} promises - Array of promises
 * @param {Object} [options] - Options
 * @param {boolean} [options.await=false] - `true` to await all promises if a promise rejects
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function all(promises, options) {
	if (options && options.await) return allAwait(promises);
	return Promise.all(promises);
};
