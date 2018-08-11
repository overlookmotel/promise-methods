/* --------------------
 * promise-methods module
 * `all` method
 * ------------------*/

'use strict';

// Exports

/**
 * Same as `Promise.all()`
 * @param {Array} arr - Array of promises
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function all(arr) {
	return Promise.all(arr);
};
