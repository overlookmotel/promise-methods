/* --------------------
 * promise-methods module
 * `forEachSeries` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach');

// Exports

/**
 * Run function on all items of input array in series.
 * @param {Array} arr - Array
 * @param {Function} fn - Function to run on all items
 * @returns {Promise}
 */
module.exports = function forEachSeries(arr, fn) {
	return forEach(arr, fn, {concurrency: 1});
};
