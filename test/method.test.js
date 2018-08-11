/* --------------------
 * promise-methods module
 * Tests for `method` method
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

describe('method()', function() {
	it('returns a function', function() {
		const fn = P.method(() => {});
		expect(fn).to.be.a('function');
	});

	describe('returned function', function() {
		describe('calls original', function() {
			beforeEach(function() {
				this.ret = {a: 1};
				this.spy = sinon.fake.returns(this.ret);
				this.fn = P.method(this.spy);
			});

			it('once', function() {
				const p = this.fn();
				expect(this.spy).to.be.calledOnce;
				return p;
			});

			it('with arguments', function() {
				const arg1 = {b: 2}, arg2 = {c: 3};
				const p = this.fn(arg1, arg2);
				expect(this.spy).to.be.calledWithExactly(arg1, arg2);
				return p;
			});

			it('with this context', function() {
				const ctx = {b: 2};
				const p = this.fn.call(ctx);
				expect(this.spy).to.be.calledOn(ctx);
				return p;
			});
		});

		describe('when original returns plain value', function() {
			beforeEach(function() {
				this.ret = {a: 1};
				this.fn = P.method(() => this.ret);
				this.p = this.fn();
			});

			it('returns a promise', function() {
				expect(this.p).to.be.instanceof(Promise);
				return this.p;
			});

			it('returns promise resolving to original\'s return value', function() {
				return expect(this.p).to.eventually.equal(this.ret);
			});
		});

		describe('when original returns promise', function() {
			beforeEach(function() {
				this.ret = {a: 1};
				this.promise = Promise.resolve(this.ret);
				this.fn = P.method(() => this.promise);
				this.p = this.fn();
			});

			it('returns a promise', function() {
				expect(this.p).to.be.instanceof(Promise);
				return this.p;
			});

			it('returns original\'s returned promise', function() {
				expect(this.p).to.equal(this.promise);
				return this.p;
			});
		});

		describe('when original throws', function() {
			beforeEach(function() {
				this.err = new Error('e');
				this.fn = P.method(() => {throw this.err;});
				this.p = this.fn();
			});

			it('returns a promise', function() {
				expect(this.p).to.be.instanceof(Promise);
				return expect(this.p).to.be.rejected;
			});

			it('returns promise rejected with thrown error', function() {
				return expect(this.p).to.be.rejectedWith(this.err);
			});
		});
	});
});
