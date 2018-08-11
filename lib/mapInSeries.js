/* --------------------
 * promise-methods module
 * `mapInSeries` method
 * ------------------*/

'use strict';

// Imports
const mapIn = require('./mapIn');

// Exports

/**
 * Run function on all properties of input object in series and return promise
 * resolving to object containing results.
 * @param {Object} obj - Object
 * @param {Function} fn - Function to run on all items
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function mapInSeries(obj, fn) {
	return mapIn(obj, fn, {concurrency: 1});
};
