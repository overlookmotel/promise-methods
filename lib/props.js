/* --------------------
 * promise-methods module
 * `props` method
 * ------------------*/

'use strict';

// Exports

/**
 * Resolve object of promises.
 * @param {Object} obj - Object
 * @returns {Promise} - Promise of object of fulfilled values
 */
module.exports = function props(obj) {
	const keys = [],
		values = [];
	for (const key in obj) {
		keys.push(key);
		values.push(obj[key]);
	}

	return Promise.all(values).then((resolvedValues) => {
		const out = {};
		for (let i = 0; i < keys.length; i++) {
			out[keys[i]] = resolvedValues[i];
		}
		return out;
	});
};
