/* --------------------
 * promise-methods module
 * `props` method
 * ------------------*/

'use strict';

// Imports
const all = require('./all');

// Exports

/**
 * Resolve object of promises.
 * @param {Object} obj - Object
 * @param {Object} [options] - Options
 * @param {boolean} [options.await=false] - `true` to await all promises if a promise rejects
 * @returns {Promise} - Promise of object of fulfilled values
 */
module.exports = function props(obj, options) {
	const keys = [],
		values = [];
	for (const key in obj) {
		keys.push(key);
		values.push(obj[key]);
	}

	return all(values, options).then((resolvedValues) => {
		const out = {};
		for (let i = 0; i < keys.length; i++) {
			out[keys[i]] = resolvedValues[i];
		}
		return out;
	});
};
