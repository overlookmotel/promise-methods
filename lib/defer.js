/* --------------------
 * promise-methods module
 * `defer` method
 * ------------------*/

'use strict';

// Exports

/**
 * Create a deferred.
 * @returns {Object} - Of type `{ promise: <Promise>, resolve: <Function>, reject: <Function> }`
 */
module.exports = function defer() {
	const out = {};
	out.promise = new Promise((resolve, reject) => {
		out.resolve = resolve;
		out.reject = reject;
	});
	return out;
};
