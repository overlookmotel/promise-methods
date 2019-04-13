/* --------------------
 * promise-methods module
 * Tests for `try` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	{promiseTry} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('try()', () => {
	describe('calls function', () => {
		beforeEach(function() {
			this.ret = {a: 1};
			this.spy = sinon.fake.returns(this.ret);
			this.p = promiseTry(this.spy);
		});

		it('once', function() {
			expect(this.spy).to.be.calledOnce;
			return this.p;
		});

		it('with no arguments', function() {
			expect(this.spy).to.be.calledWithExactly();
			return this.p;
		});

		it('with no context', function() {
			expect(this.spy).to.be.calledOn(undefined);
			return this.p;
		});
	});

	describe('when function returns plain value', () => {
		beforeEach(function() {
			this.ret = {a: 1};
			this.p = promiseTry(() => this.ret);
		});

		it('returns a promise', function() {
			expect(this.p).to.be.instanceof(Promise);
			return this.p;
		});

		it('returns promise resolving to original\'s return value', function() {
			return expect(this.p).to.eventually.equal(this.ret);
		});
	});

	describe('when function returns promise', () => {
		beforeEach(function() {
			this.ret = {a: 1};
			this.promise = Promise.resolve(this.ret);
			this.p = promiseTry(() => this.promise);
		});

		it('returns a promise', function() {
			expect(this.p).to.be.instanceof(Promise);
			return this.p;
		});

		it('returns function\'s returned promise', function() {
			expect(this.p).to.equal(this.promise);
			return this.p;
		});
	});

	describe('when function throws', () => {
		beforeEach(function() {
			this.err = new Error('e');
			this.p = promiseTry(() => { throw this.err; });
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
