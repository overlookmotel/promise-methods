/* --------------------
 * promise-methods module
 * `propsOwn` method
 * ------------------*/

'use strict';

// Imports
const all = require('./all');

// Exports

/**
 * Resolve object of promises (own properties only).
 * @param {Object} obj - Object
 * @param {Object} [options] - Options
 * @param {boolean} [options.await=false] - `true` to await all promises if a promise rejects
 * @returns {Promise} - Promise of object of fulfilled values
 */
module.exports = function propsOwn(obj, options) {
	const keys = Object.keys(obj),
		values = keys.map(key => obj[key]);

	return all(values, options).then((resolvedValues) => {
		const out = {};
		for (let i = 0; i < keys.length; i++) {
			out[keys[i]] = resolvedValues[i];
		}
		return out;
	});
};
