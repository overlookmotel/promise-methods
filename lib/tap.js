/* --------------------
 * promise-methods module
 * `tap` method
 * ------------------*/

'use strict';

// Imports
const isPromise = require('./is');

// Exports

/**
 * Tap result of a promise and pass result through.
 *
 * Equivalent to: `
 *   promise.then( (res) => {
 *     // Do something
 *     return res;
 *   } )
 * `
 * Handler promise is called with resolution value of promise.
 * If handler function returns a promise, it is awaited before resolving returned promise.
 * If handler function throws or returns a rejected promise, returned promise rejects with that error.
 * Otherwise, returned promise resolves to resolution value of input promise.
 *
 * @params {Promise} promise - Input promise
 * @params {function} [handler] - Handler function
 * @returns {Promise}
 */
module.exports = function tap(promise, handler) {
	return promise.then((res) => {
		let handlerRes;
		if (typeof handler === 'function') handlerRes = handler.call(this, res);
		if (!isPromise(handlerRes)) return res;
		return handlerRes.then(() => res);
	});
};
