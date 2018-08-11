/* --------------------
 * promise-methods module
 * `mapIn` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	method = require('./method');

// Exports

/**
 * Run function on all properties of input object and return promise resolving to
 * object containing results.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function mapIn(obj, fn, options) {
	fn = method(fn);

	const out = {},
		keys = [];
	for (let key in obj) {
		out[key] = undefined;
		keys.push(key);
	}

	return forEach(keys, key => {
		return fn(obj[key], key, obj).then(res => out[key] = res);
	}, options).then(() => out);
};
