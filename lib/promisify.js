/* --------------------
 * promise-methods module
 * `promisify` method
 * ------------------*/

'use strict';

// Exports
const slice = Array.prototype.slice;

/**
 * Promisify a Node.js-style callback method.
 * e.g. `const readFileAsync = P.promisify(fs.readFile)`
 *
 * @param {Function} fn - Function to promisify
 * @returns {Function} - Promisified function
 */
module.exports = function promisify(fn) {
	return function() {
		return new Promise((resolve, reject) => {
			const args = slice.call(arguments);
			args.push((err, res) => {
				if (err) return reject(err);
				resolve(res);
			});

			fn.apply(this, args);
		});
	};
};
