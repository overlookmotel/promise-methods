/* --------------------
 * promise-methods module
 * `forIn` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	method = require('./method');

// Exports

/**
 * Run function on all properties of input object.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function forIn(obj, fn, options) {
	fn = method(fn);

	const keys = [];
	for (let key in obj) {
		keys.push(key);
	}

	return forEach(keys, key => fn(obj[key], key, obj), options);
};
