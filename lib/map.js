/* --------------------
 * promise-methods module
 * `map` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	method = require('./method');

// Exports

/**
 * Run function on all items of input array and return promise resolving to
 * array of results.
 * @param {Array} arr - Array
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function map(arr, fn, options) {
	fn = method(fn);

	const out = [];
	return forEach(arr, (value, index) => {
		return fn(value, index, arr).then(res => out[index] = res);
	}, options).then(() => out);
};
