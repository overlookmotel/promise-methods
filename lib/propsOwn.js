/* --------------------
 * promise-methods module
 * `propsOwn` method
 * ------------------*/

'use strict';

// Exports

/**
 * Resolve object of promises (own properties only).
 * @param {Object} obj - Object
 * @returns {Promise} - Promise of object of fulfilled values
 */
module.exports = function propsOwn(obj) {
	const keys = Object.keys(obj),
		values = keys.map(key => obj[key]);

	return Promise.all(values).then((resolvedValues) => {
		const out = {};
		for (let i = 0; i < keys.length; i++) {
			out[keys[i]] = resolvedValues[i];
		}
		return out;
	});
};
