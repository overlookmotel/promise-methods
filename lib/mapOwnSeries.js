/* --------------------
 * promise-methods module
 * `mapOwnSeries` method
 * ------------------*/

'use strict';

// Imports
const mapOwn = require('./mapOwn');

// Exports

/**
 * Run function on all own properties of input object in series and return promise
 * resolving to object containing results.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function mapOwnSeries(obj, fn) {
	return mapOwn(obj, fn, {concurrency: 1});
};
