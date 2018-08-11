/* --------------------
 * promise-methods module
 * Tests for `series` method
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

/* jshint expr: true */
/* global describe, it, beforeEach */

describe('series()', function() {
	beforeEach(function() {
		this.rets = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];
		this.resolves = [];
		this.promises = this.rets.map((ret, i) => new Promise(resolve => this.resolves[i] = () => resolve(ret)));
		this.resolve = () => this.resolves.forEach(resolve => resolve());
		this.spies = this.promises.map(promise => sinon.fake.returns(promise));
		this.p = P.series(this.spies);
	});

	it('calls 1st function sync', function() {
		const {p, spies} = this;

		expect(spies[0]).to.be.calledOnce;

		this.resolve();
		return p;
	});

	it('calls functions async after promises settle', function() {
		const {p, spies} = this;

		for (let i = 1; i < spies.length; i++) {
			expect(spies[i]).not.to.be.called;
		}

		this.resolves[0]();

		return delay().then(() => {
			expect(spies[1]).to.be.calledOnce;

			this.resolves[1]();
			return delay();
		}).then(() => {
			expect(spies[2]).to.be.calledOnce;

			this.resolves[2]();
			return delay();
		}).then(() => {
			expect(spies[3]).to.be.calledOnce;

			this.resolves[3]();
			return delay();
		}).then(() => {
			expect(spies[4]).to.be.calledOnce;

			this.resolve();
			return p;
		});
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

	describe('with empty array', function() {
		it('promise resolves to empty array', function() {
			const p = P.series([]);
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}
