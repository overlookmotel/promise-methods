/* --------------------
 * promise-methods module
 * `forInSeries` method
 * ------------------*/

'use strict';

// Imports
const forIn = require('./forIn');

// Exports

/**
 * Run function on all properties of input object in series.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function forInSeries(obj, fn) {
	return forIn(obj, fn, {concurrency: 1});
};
