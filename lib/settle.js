/* --------------------
 * promise-methods module
 * `settle` method
 * ------------------*/

'use strict';

// Imports
const isPromise = require('./is'),
	defer = require('./defer');

// Exports

class Settler {
	constructor() {
		this.results = [];
		this.numAwaiting = 1;
		this.deferred = defer();
	}

	run(promises) {
		let i = 0;
		for (const promise of promises) {
			const index = i;
			if (isPromise(promise)) {
				this.numAwaiting++;
				promise.then(
					res => this.resolved(index, res),
					err => this.rejected(index, err)
				);
			} else {
				this.results[index] = {resolved: true, result: promise};
			}
			i++;
		}

		this.completed();

		return this.deferred.promise;
	}

	resolved(index, result) {
		this.results[index] = {resolved: true, result};
		this.completed();
	}

	rejected(index, err) {
		this.results[index] = {resolved: false, result: err};
		this.completed();
	}

	completed() {
		this.numAwaiting--;
		if (this.numAwaiting === 0) this.deferred.resolve(this.results);
	}
}

/**
 * Waits for all promises in an array to settle (resolve or reject) and resolves to an array of
 * the results.
 * Each item in array is of form `{resolved: <boolean>, result: <any>}`.
 * `resolved` is `true` if promise resolved, `false` if rejected.
 * `result` is resolution value if resolved, rejection reason if rejected.
 *
 * @param {Array} promises - Array of promises
 * @returns {Promise} - Promise of array of results
 */
module.exports = function settle(promises) {
	const awaiter = new Settler();
	return awaiter.run(promises);
};
