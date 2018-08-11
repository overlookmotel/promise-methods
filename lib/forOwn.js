/* --------------------
 * promise-methods module
 * `forOwn` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	method = require('./method');

// Exports

/**
 * Run function on all own properties of input object.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function forOwn(obj, fn, options) {
	fn = method(fn);

	const keys = Object.keys(obj);

	return forEach(keys, key => fn(obj[key], key, obj), options);
};
