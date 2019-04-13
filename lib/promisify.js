/* --------------------
 * promise-methods module
 * `promisify` method
 * ------------------*/

'use strict';

/**
 * Promisify a Node.js-style callback method.
 * e.g. `const readFileAsync = P.promisify(fs.readFile)`
 *
 * @param {Function} fn - Function to promisify
 * @returns {Function} - Promisified function
 */
module.exports = function promisify(fn) {
	return function(...args) {
		return new Promise((resolve, reject) => {
			args.push(
				(err, res) => {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				}
			);

			fn.apply(this, args); // eslint-disable-line no-invalid-this
		});
	};
};
