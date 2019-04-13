/* --------------------
 * promise-methods module
 * `Queue` constructor
 * ------------------*/

'use strict';

// Imports
const promiseTry = require('./try');

// Exports
module.exports = class Queue {
	/**
	 * @param {Object} [options] - Options object
	 * @param {number} [options.concurrency=0] - Number to run concurrently (0 for infinite)
	 */
	constructor(options) {
		// Concurrency option
		if (!options) options = {};

		let {concurrency} = options;
		if (concurrency == null) {
			concurrency = 0;
		} else if (typeof concurrency !== 'number' || concurrency < 0) {
			throw new Error('options.concurrency must be a number if provided');
		}
		this._concurrency = concurrency;

		// Init promise
		this.promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});

		// Init state
		this._queue = [];

		this.queued = 0;
		this.running = 0;
		this.done = false;
	}

	/**
	 * Add function to queue
	 */
	add(fn) {
		this._queue.push(fn);
		this.queued++;
		this._drain();
		return this;
	}

	_drain() {
		while (
			!this.done
			&& this.queued > 0
			&& (this._concurrency === 0 || this.running < this._concurrency)
		) {
			this._popQueue();
		}
	}

	_popQueue() {
		const fn = this._queue.shift();
		this.queued--;

		this.running++;

		promiseTry(fn).then(
			() => this._resolvedOne(),
			err => this._rejectedOne(err)
		);
	}

	_resolvedOne() {
		this.running--;
		if (this.done) return;

		// If all done, resolve promise
		if (this.queued === 0 && this.running === 0) {
			this.done = true;
			this._resolve();
			return;
		}

		this._drain();
	}

	_rejectedOne(err) {
		this.running--;
		if (this.done) return;

		this.done = true;
		this._reject(err);
	}
};
