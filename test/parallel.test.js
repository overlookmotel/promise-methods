/* --------------------
 * promise-methods module
 * Tests for `parallel` method
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

describe('parallel()', () => {
	describe('with default concurrency', () => {
		beforeEach(function() {
			this.rets = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];
			this.resolves = [];
			this.promises = this.rets.map(
				(ret, i) => new Promise((resolve) => { this.resolves[i] = () => resolve(ret); })
			);
			this.resolve = () => this.resolves.forEach(resolve => resolve());
			this.spies = this.promises.map(promise => sinon.fake.returns(promise));
			this.p = P.parallel(this.spies);
		});

		it('calls all functions sync', function() {
			for (const spy of this.spies) {
				expect(spy).to.be.calledOnce;
			}

			this.resolve();
			return this.p;
		});

		it('returns array of returned values', function() {
			this.resolve();
			return expect(this.p).to.eventually.deep.equal(this.rets);
		});

		it('awaits all returned promises before promise resolves', function() {
			const thenSpy = sinon.fake();
			this.p.then(thenSpy);

			return delay().then(() => {
				expect(thenSpy).not.to.be.called;

				this.resolve();
				return this.p;
			});
		});
	});

	describe('with set concurrency', () => {
		beforeEach(function() {
			this.concurrency = 2;

			this.rets = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];
			this.resolves = [];
			this.promises = this.rets.map(
				(ret, i) => new Promise((resolve) => { this.resolves[i] = () => resolve(ret); })
			);
			this.resolve = () => this.resolves.forEach(resolve => resolve());
			this.spies = this.promises.map(promise => sinon.fake.returns(promise));
			this.p = P.parallel(this.spies, this.concurrency);
		});

		it('calls functions sync up to max concurrency', function() {
			const {p, spies, concurrency} = this;

			for (let i = 0; i < concurrency; i++) {
				expect(spies[i]).to.be.calledOnce;
			}

			this.resolve();
			return p;
		});

		it('returns array of returned values', function() {
			this.resolve();
			return expect(this.p).to.eventually.deep.equal(this.rets);
		});

		it('calls functions async after promises settle', function() {
			const {p, spies, concurrency} = this;

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
				return p;
			});
		});

		it('awaits all returned promises before promise resolves', function() {
			const thenSpy = sinon.fake();
			this.p.then(thenSpy);

			return delay().then(() => {
				expect(thenSpy).not.to.be.called;
				this.resolve();
				return this.p;
			});
		});
	});

	describe('with empty array', () => {
		it('promise resolves to empty array', () => {
			const p = P.parallel([]);
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}
