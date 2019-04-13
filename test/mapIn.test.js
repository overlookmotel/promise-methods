/* --------------------
 * promise-methods module
 * Tests for `mapIn` method
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

describe('mapIn()', function() {
	describe('with default concurrency', function() {
		beforeEach(function() {
			class C {}
			C.prototype.v5 = {a: 5};
			this.obj = new C();
			Object.assign(this.obj, {v1: {a: 1}, v2: {a: 2}, v3: {a: 3}, v4: {a: 4}});

			this.keys = allKeys(this.obj);
			this.rets = this.keys.map(k => ({b: this.obj[k].a + 10}));
			this.resolves = [];
			this.promises = this.rets.map((ret, i) => new Promise(resolve => this.resolves[i] = () => resolve(ret)));
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spy = sinon.fake((v, k) => this.promises[this.keys.indexOf(k)]);
			this.p = P.mapIn(this.obj, this.spy);
		});

		it('calls callback sync for each object property with args (value, key, obj)', function() {
			const {p, obj, keys, spy} = this;

			expectCalls(spy, obj, keys.length);

			this.resolve();

			return p;
		});

		it('promise resolves to iterator results', function() {
			this.resolve();
			return this.p.then(ret => {
				expectResults(ret, this.keys, this.rets);
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
	});

	describe('with set concurrency', function() {
		beforeEach(function() {
			class C {}
			C.prototype.v5 = {a: 5};
			this.obj = new C();
			Object.assign(this.obj, {v1: {a: 1}, v2: {a: 2}, v3: {a: 3}, v4: {a: 4}});

			this.concurrency = 2;

			this.keys = allKeys(this.obj);
			this.rets = this.keys.map(k => ({b: this.obj[k].a + 10}));
			this.resolves = [];
			this.promises = this.rets.map((ret, i) => new Promise(resolve => this.resolves[i] = () => resolve(ret)));
			this.resolve = () => this.resolves.forEach(resolve => resolve());

			this.spy = sinon.fake((v, k) => this.promises[this.keys.indexOf(k)]);
			this.p = P.mapIn(this.obj, this.spy, {concurrency: this.concurrency});
		});

		it('calls callback sync up to max concurrency with args (value, index, array)', function() {
			const {p, obj, spy, concurrency} = this;

			expectCalls(spy, obj, concurrency);

			this.resolve();
			return p;
		});

		it('calls callback async after promises settle with args (value, index, array)', function() {
			const {p, obj, spy, concurrency} = this;

			this.resolves[0]();

			return delay().then(() => {
				expectCalls(spy, obj, concurrency + 1);

				this.resolves[1]();
				return delay();
			}).then(() => {
				expectCalls(spy, obj, concurrency + 2);

				this.resolves[2]();
				return delay();
			}).then(() => {
				expectCalls(spy, obj, concurrency + 3);
				this.resolve();
				return p;
			});
		});

		it('promise resolves to iterator results', function() {
			this.resolve();
			return this.p.then(ret => {
				expectResults(ret, this.keys, this.rets);
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
	});

	describe('with empty object', function() {
		it('promise resolves to empty object', function() {
			const p = P.mapIn({}, () => {});
			return expect(p).to.eventually.deep.equal({});
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}

function expectCalls(spy, obj, count) {
	expect(spy).to.have.callCount(count);

	const keys = allKeys(obj);

	for (let i = 0; i < count; i++) {
		const args = spy.getCall(i).args;
		expect(args.length).to.equal(3);
		expect(args[0]).to.equal(obj[keys[i]]);
		expect(args[1]).to.equal(keys[i]);
		expect(args[2]).to.equal(obj);
	}
}

function expectResults(ret, keys, rets) {
	expect(ret).to.be.an('object');
	expect(ret.__proto__).to.equal(Object.prototype);
	expect(Object.keys(ret)).to.have.length(keys.length);

	for (let i = 0; i < rets.length; i++) {
		expect(ret[keys[i]]).to.equal(rets[i]);
	}
}

function allKeys(obj) {
	const keys = [];
	for (let key in obj) {
		keys.push(key);
	}
	return keys;
}
