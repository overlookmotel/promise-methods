/* --------------------
 * promise-methods module
 * Tests for `forEach` method
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

describe('forEach()', () => {
	describe('with default concurrency', () => {
		beforeEach(function() {
			this.arr = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];

			this.promises = [];
			this.resolves = [];
			this.arr.forEach((v, i) => {
				this.promises[i] = new Promise((resolve) => { this.resolves[i] = resolve; });
			});
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spy = sinon.fake((v, i) => this.promises[i]);
			this.p = P.forEach(this.arr, this.spy);
		});

		it('calls callback sync for each array item with args (value, index, array)', function() {
			const {p, arr, spy} = this;

			expectCalls(spy, arr, arr.length);

			this.resolve();

			return p;
		});

		it('promise resolves to undefined', function() {
			this.resolve();
			return expect(this.p).to.eventually.equal(undefined);
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
	});

	describe('with set concurrency', () => {
		beforeEach(function() {
			this.arr = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}];
			this.concurrency = 2;

			this.promises = [];
			this.resolves = [];
			this.arr.forEach((v, i) => {
				this.promises[i] = new Promise((resolve) => { this.resolves[i] = resolve; });
			});
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spy = sinon.fake((v, i) => this.promises[i]);
			this.p = P.forEach(this.arr, this.spy, {concurrency: this.concurrency});
		});

		it('calls callback sync up to max concurrency with args (value, index, array)', function() {
			const {p, arr, spy, concurrency} = this;

			expectCalls(spy, arr, concurrency);

			this.resolve();
			return p;
		});

		it('calls callback async after promises settle with args (value, index, array)', function() {
			const {p, arr, spy, concurrency} = this;

			this.resolves[0]();

			return delay().then(() => {
				expectCalls(spy, arr, concurrency + 1);

				this.resolves[1]();
				return delay();
			}).then(() => {
				expectCalls(spy, arr, concurrency + 2);

				this.resolves[2]();
				return delay();
			}).then(() => {
				expectCalls(spy, arr, concurrency + 3);
				this.resolve();
				return p;
			});
		});

		it('promise resolves to undefined', function() {
			this.resolve();
			return expect(this.p).to.eventually.equal(undefined);
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
	});

	describe('with empty array', () => {
		it('promise resolves to undefined', () => {
			const p = P.forEach([], () => {});
			return expect(p).to.eventually.equal(undefined);
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}

function expectCalls(spy, arr, count) {
	expect(spy).to.have.callCount(count);

	for (let i = 0; i < count; i++) {
		const {args} = spy.getCall(i);
		expect(args.length).to.equal(3);
		expect(args[0]).to.equal(arr[i]);
		expect(args[1]).to.equal(i);
		expect(args[2]).to.equal(arr);
	}
}
