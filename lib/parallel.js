/* --------------------
 * promise-methods module
 * `parallel` method
 * ------------------*/

'use strict';

// Imports
const forEach = require('./forEach'),
	promiseTry = require('./try');

// Exports

/**
 * Run array of functions in parallel.
 * @param {Array} fns - Array of functions to execute in parallel
 * @param {number} [concurrency=0] - Number to run concurrently
 * @returns {Promise} - Resolved when all function run, rejected if a function
 *   throws or returns a rejected promise
 */
module.exports = function parallel(fns, concurrency) {
	const out = [];
	return forEach(
		fns,
		(fn, index) => promiseTry(fn).then((res) => { out[index] = res; }),
		{concurrency}
	).then(() => out);
};
