/* --------------------
 * promise-methods module
 * Tests for `mapSeries` method
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

describe('mapSeries()', function() {
	beforeEach(function() {
		this.arr = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];

		this.rets = this.arr.map(v => ({b: v.a + 10}));
		this.resolves = [];
		this.promises = this.rets.map((ret, i) => new Promise(resolve => this.resolves[i] = () => resolve(ret)));
		this.resolve = () => this.resolves.forEach(resolve => resolve());

		this.spy = sinon.fake((v, i) => this.promises[i]);
		this.p = P.mapSeries(this.arr, this.spy, {concurrency: this.concurrency});
	});

	it('calls callback sync once with args (value, index, array)', function() {
		const {p, arr, spy} = this;

		expectCalls(spy, arr, 1);

		this.resolve();
		return p;
	});

	it('calls callback async after promises settle with args (value, index, array)', function() {
		const {p, arr, spy} = this;

		this.resolves[0]();

		return delay().then(() => {
			expectCalls(spy, arr, 2);

			this.resolves[1]();
			return delay();
		}).then(() => {
			expectCalls(spy, arr, 3);

			this.resolves[2]();
			return delay();
		}).then(() => {
			expectCalls(spy, arr, 4);

			this.resolves[3]();
			return delay();
		}).then(() => {
			expectCalls(spy, arr, 5);
			this.resolve();
			return p;
		});
	});

	it('promise resolves to iterator results', function() {
		this.resolve();
		return this.p.then(ret => {
			expectResults(ret, this.rets);
		});
	});

	it('promise resolves after all iterator promises resolved', function() {
		const {p} = this;
		const thenSpy = sinon.fake();
		p.then(thenSpy);

		return delay().then(() => {
			expect(thenSpy).not.to.be.called;
			this.resolve();
			return p;
		});
	});

	describe('with empty array', function() {
		it('promise resolves to empty array', function() {
			const p = P.mapSeries([], () => {});
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}

function expectCalls(spy, arr, count) {
	expect(spy).to.have.callCount(count);

	for (let i = 0; i < count; i++) {
		const args = spy.getCall(i).args;
		expect(args.length).to.equal(3);
		expect(args[0]).to.equal(arr[i]);
		expect(args[1]).to.equal(i);
		expect(args[2]).to.equal(arr);
	}
}

function expectResults(ret, rets) {
	expect(ret).to.be.an('array');
	expect(ret).to.have.length(rets.length);

	for (let i = 0; i < rets.length; i++) {
		expect(ret[i]).to.equal(rets[i]);
	}
}
