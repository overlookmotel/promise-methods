/* --------------------
 * promise-methods module
 * `forEach` method
 * ------------------*/

'use strict';

// Imports
const Queue = require('./queue'),
	method = require('./method');

// Exports

/**
 * Run function on all items of input array.
 * @param {Array} arr - Array
 * @param {Function} fn - Function to run on all items
 * @param {Object} [options] - Options object
 * @param {number} [options.concurrency=0] - Number to run concurrently
 * @returns {Promise}
 */
module.exports = function forEach(arr, fn, options) {
	if (arr.length == 0) return Promise.resolve();

	fn = method(fn);

	const queue = new Queue(options);

	for (let i = 0; i < arr.length; i++) {
		queue.add(() => {
			return fn(arr[i], i, arr);
		});
	}

	return queue.promise;
};
