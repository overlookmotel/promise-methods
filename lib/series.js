/* --------------------
 * promise-methods module
 * `series` method
 * ------------------*/

'use strict';

// Imports
const parallel = require('./parallel');

// Exports
/**
 * Run array of functions in series.
 * @param {Array} fns - Array of functions to execute in series
 * @returns {Promise} - Resolved when all function run, rejected if a function
 *   throws or returns a rejected promise
 */
module.exports = function series(fns) {
	return parallel(fns, 1);
};
