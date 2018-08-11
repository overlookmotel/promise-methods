/* --------------------
 * promise-methods module
 * `mapSeries` method
 * ------------------*/

'use strict';

// Imports
const map = require('./map');

// Exports

/**
 * Run function on all items of input array in series and return promise
 * resolving to array of results.
 * @param {Array} arr - Array
 * @param {Function} fn - Function to run on all items
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function mapSeries(arr, fn) {
	return map(arr, fn, {concurrency: 1});
};
