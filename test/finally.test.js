/* --------------------
 * promise-methods module
 * Tests for `finally` method
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

describe('finally()', function() {
	describe('if promise resolves', function() {
		beforeEach(function() {
			this.ret = {a: 1};
			this.p = Promise.resolve(this.ret);
			this.spy = sinon.fake.returns(456);
			this.p2 = P.finally(this.p, this.spy);
		});

		it('calls callback', function() {
			const {spy, p2} = this;
			expect(spy).not.to.be.called;
			return p2.then(() => {
				expect(spy).to.be.calledOnce;
			});
		});

		it('calls callback with no arguments', function() {
			const {spy, p2} = this;
			return p2.then(() => {
				expect(spy).to.be.calledWithExactly();
			});
		});

		it('calls callback with no this context', function() {
			const {spy, p2} = this;
			return p2.then(() => {
				expect(spy).to.be.calledOn(undefined);
			});
		});

		it('returned promise resolves to original value', function() {
			return expect(this.p2).to.eventually.equal(this.ret);
		});

		it('returned promise rejects with callback\'s error if callback throws', function() {
			const p = Promise.resolve(this.ret);
			const err = new Error('e');
			const spy = sinon.fake.throws(err);
			const p2 = P.finally(p, spy);
			return expect(p2).to.be.rejectedWith(err);
		});

		it('returned promise rejects with callback\'s error if callback returns rejected promise', function() {
			const p = Promise.resolve(this.ret);
			const err = new Error('e');
			const spy = sinon.fake.rejects(err);
			const p2 = P.finally(p, spy);
			return expect(p2).to.be.rejectedWith(err);
		});
	});

	describe('if promise rejects', function() {
		beforeEach(function() {
			this.err = new Error('e');
			this.p = Promise.reject(this.err);
			this.spy = sinon.fake.returns(456);
			this.p2 = P.finally(this.p, this.spy);
		});

		it('calls callback', function() {
			const {spy, p2} = this;
			expect(spy).not.to.be.called;
			return expect(p2).to.be.rejected.then(() => {
				expect(spy).to.be.calledOnce;
			});
		});

		it('calls callback with no arguments', function() {
			const {spy, p2} = this;
			return expect(p2).to.be.rejected.then(() => {
				expect(spy).to.be.calledWithExactly();
			});
		});

		it('calls callback with no this context', function() {
			const {spy, p2} = this;
			return expect(p2).to.be.rejected.then(() => {
				expect(spy).to.be.calledOn(undefined);
			});
		});

		it('returned promise rejects with original rejection reason', function() {
			return expect(this.p2).to.be.rejectedWith(this.err);
		});

		it('returned promise rejects with callback\'s error if callback throws', function() {
			this.p2.catch(() => {});

			const p = Promise.reject(this.err);
			const err = new Error('e');
			const spy = sinon.fake.throws(err);
			const p2 = P.finally(p, spy);
			return expect(p2).to.be.rejectedWith(err);
		});

		it('returned promise rejects with callback\'s error if callback returns rejected promise', function() {
			this.p2.catch(() => {});

			const p = Promise.resolve(this.ret);
			const err = new Error('e');
			const spy = sinon.fake.rejects(err);
			const p2 = P.finally(p, spy);
			return expect(p2).to.be.rejectedWith(err);
		});
	});
});
