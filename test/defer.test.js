/* --------------------
 * promise-methods module
 * Tests for `defer` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	{defer} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('defer()', () => {
	beforeEach(function() {
		this.d = defer();
	});

	describe('returns an object', () => {
		it('with promise property', function() {
			expect(this.d.promise).to.be.instanceof(Promise);
		});

		it('with resolve property', function() {
			expect(this.d.resolve).to.be.a('function');
		});

		it('with reject property', function() {
			expect(this.d.reject).to.be.a('function');
		});
	});

	describe('calling resolve/reject fulfills promise', () => {
		it('resolve', function() {
			const {d} = this;
			const res = {a: 1};
			d.resolve(res);
			return expect(d.promise).to.eventually.equal(res);
		});

		it('reject', function() {
			const {d} = this;
			const err = new Error('e');
			d.reject(err);
			return expect(d.promise).to.be.rejectedWith(err);
		});
	});
});
