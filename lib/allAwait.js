/* --------------------
 * promise-methods module
 * `allAwait` method
 * ------------------*/

'use strict';

// Imports
const isPromise = require('./is'),
	defer = require('./defer');

// Exports

class Awaiter {
	constructor() {
		this.results = [];
		this.numAwaiting = 1;
		this.deferred = defer();
		this.errored = false;
		this.err = null;
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
				this.results[index] = promise;
			}
			i++;
		}

		this.completed();

		return this.deferred.promise;
	}

	resolved(index, res) {
		if (!this.errored) this.results[index] = res;
		this.completed();
	}

	rejected(index, err) {
		if (!this.errored) {
			this.errored = true;
			this.err = err;
			this.results = null;
		}
		this.completed();
	}

	completed() {
		this.numAwaiting--;
		if (this.numAwaiting === 0) {
			if (this.errored) {
				this.deferred.reject(this.err);
			} else {
				this.deferred.resolve(this.results);
			}
		}
	}
}

/**
 * Like `Promise.all()`, but if a promise rejects, all it waits for all other promises to
 * settle (resolve or reject) before rejecting.
 * If no promise rejects, resolves to array of resolution values of the input promises.
 * If any input promise rejects, rejects with rejection reason of the first promise to reject.
 *
 * @param {Array} promises - Array of promises
 * @returns {Promise} - Promise of array of fulfilled values
 */
module.exports = function allAwait(promises) {
	const awaiter = new Awaiter();
	return awaiter.run(promises);
};
