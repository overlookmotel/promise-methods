/* --------------------
 * promise-methods module
 * Tests for `promisify` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	{promisify} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('promisify()', () => {
	beforeEach(function() {
		this.ret = {a: 1};
		this.spy = sinon.fake((a, b, cb) => {
			cb(null, this.ret);
		});
		this.fn = promisify(this.spy);
	});

	it('returns a function', function() {
		expect(this.fn).to.be.a('function');
	});

	describe('function', () => {
		it('returns a promise', function() {
			const p = this.fn(null, null);
			expect(p).to.be.instanceof(Promise);
			return p;
		});

		describe('is called', () => {
			beforeEach(function() {
				this.args = [{b: 2}, {c: 3}];
				this.ctx = [{d: 4}];
				this.p = this.fn.apply(this.ctx, this.args);
			});

			it('once', function() {
				expect(this.spy).to.be.calledOnce;
				return this.p;
			});

			it('with arguments', function() {
				const {args} = this;
				expect(this.spy).to.be.calledWithExactly(args[0], args[1], sinon.match.func);
				return this.p;
			});

			it('with this context', function() {
				expect(this.spy).to.be.calledOn(this.ctx);
				return this.p;
			});
		});

		describe('calls callback with value', () => {
			it('promise resolves to returned value', function() {
				const p = this.fn(null, null);
				return expect(p).to.eventually.equal(this.ret);
			});
		});

		describe('calls callback with error', () => {
			it('promise rejects with error', () => {
				const err = new Error('e');
				const fn = promisify((cb) => {
					cb(err);
				});
				const p = fn();

				return expect(p).to.be.rejectedWith(err);
			});
		});

		describe('throws error', () => {
			it('promise rejects with error', () => {
				const err = new Error('e');
				const fn = promisify(() => {
					throw err;
				});
				const p = fn();

				return expect(p).to.be.rejectedWith(err);
			});
		});
	});
});
