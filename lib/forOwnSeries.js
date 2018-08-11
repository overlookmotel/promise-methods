/* --------------------
 * promise-methods module
 * `forOwnSeries` method
 * ------------------*/

'use strict';

// Imports
const forOwn = require('./forOwn');

// Exports

/**
 * Run function on all own properties of input object in series.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function forOwnSeries(obj, fn) {
	return forOwn(obj, fn, {concurrency: 1});
};
