/* --------------------
 * promise-methods module
 * Tests for `Queue` constructor
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	P = require('../lib/');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('Queue class', () => {
	describe('with default concurrency', () => {
		beforeEach(function() {
			this.queue = new P.Queue();

			this.rets = [1, 2, 3, 4, 5].map(num => ({a: num}));
			this.resolves = [];
			this.promises = this.rets.map(
				(ret, i) => new Promise((resolve) => { this.resolves[i] = () => resolve(ret); })
			);
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spies = this.promises.map(promise => sinon.fake.returns(promise));
		});

		it('executes all functions sync as they are added', function() {
			const {queue} = this;

			for (const spy of this.spies) {
				queue.add(spy);
				expect(spy).to.be.calledOnce;
			}

			this.resolve();
			return queue.promise;
		});

		it('promise resolves after all iterator promises resolved', function() {
			const {queue} = this,
				p = queue.promise;
			const thenSpy = sinon.fake();
			p.then(thenSpy);

			for (const spy of this.spies) {
				queue.add(spy);
			}

			return delay().then(() => {
				expect(thenSpy).not.to.be.called;
				this.resolve();
				return p;
			});
		});
	});

	describe('with set concurrency', () => {
		beforeEach(function() {
			this.concurrency = 2;

			this.queue = new P.Queue({concurrency: this.concurrency});

			this.rets = [1, 2, 3, 4, 5].map(num => ({a: num}));
			this.resolves = [];
			this.promises = this.rets.map(
				(ret, i) => new Promise((resolve) => { this.resolves[i] = () => resolve(ret); })
			);
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spies = this.promises.map(promise => sinon.fake.returns(promise));
		});

		it('executes functions sync as they are added up to max concurrency', function() {
			const {queue, spies, concurrency} = this;

			for (let i = 0; i < concurrency; i++) {
				const spy = spies[i];
				queue.add(spy);
				expect(spy).to.be.calledOnce;
			}

			this.resolve();
			return queue.promise;
		});

		it('executes functions async after max concurrency', function() {
			const {queue, spies, concurrency} = this;

			for (const spy of spies) {
				queue.add(spy);
			}

			for (let i = concurrency; i < spies.length; i++) {
				expect(spies[i]).not.to.be.called;
			}

			this.resolves[0]();

			return delay().then(() => {
				expect(spies[concurrency]).to.be.calledOnce;

				this.resolves[1]();
				return delay();
			}).then(() => {
				expect(spies[concurrency + 1]).to.be.calledOnce;

				this.resolves[2]();
				return delay();
			}).then(() => {
				expect(spies[concurrency + 2]).to.be.calledOnce;
				this.resolve();
				return queue.promise;
			});
		});

		it('promise resolves after all iterator promises resolved', function() {
			const {queue} = this,
				p = queue.promise;
			const thenSpy = sinon.fake();
			p.then(thenSpy);

			for (const spy of this.spies) {
				queue.add(spy);
			}

			return delay().then(() => {
				expect(thenSpy).not.to.be.called;
				this.resolve();
				return p;
			});
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}
