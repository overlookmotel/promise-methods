/* --------------------
 * promise-methods module
 * `wait` method
 * ------------------*/

'use strict';

// Exports

/**
 * Create a promise which waits for specified time interval before resolving.
 * @param {number} [ms=0] - Milliseconds to wait
 * @returns {Promise}
 */
module.exports = function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 0));
};
