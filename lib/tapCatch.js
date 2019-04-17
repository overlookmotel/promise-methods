/* --------------------
 * promise-methods module
 * `tapCatch` method
 * ------------------*/

'use strict';

// Imports
const isPromise = require('./is');

// Exports

/**
 * Tap rejection error of a promise and rethrow error.
 *
 * Equivalent to: `
 *   promise.catch( (err) => {
 *     // Do something
 *     throw err;
 *   } )
 * `
 * Handler promise is called with rejection reason of promise.
 * If handler function returns a promise, it is awaited before resolving returned promise.
 * Whatever the result of calling handler function (returns value, returns resolved promise,
 * return rejected promise, throws) the promise is rejected with input promise's reject reason.
 * i.e. any errors in handler are silently swallowed.
 *
 * @params {Promise} promise - Input promise
 * @params {function} [handler] - Handler function
 * @returns {Promise}
 */
module.exports = function tapCatch(promise, handler) {
	return promise.catch((err) => {
		let handlerRes;
		if (typeof handler === 'function') {
			try {
				handlerRes = handler.call(this, err);
			} catch (_ignore) {
				throw err;
			}
		}

		if (!isPromise(handlerRes)) throw err;

		return handlerRes.then(
			() => { throw err; },
			() => { throw err; }
		);
	});
};
