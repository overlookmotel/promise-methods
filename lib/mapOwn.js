/* --------------------
 * promise-methods module
 * `mapOwn` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	method = require('./method');

// Exports

/**
 * Run function on all own properties of input object and return promise
 * resolving to object containing results.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function mapOwn(obj, fn, options) {
	fn = method(fn);

	const out = {},
		keys = Object.keys(obj);

	return forEach(
		keys,
		(key) => {
			out[key] = undefined;
			return fn(obj[key], key, obj).then((res) => { out[key] = res; });
		},
		options
	).then(() => out);
};
