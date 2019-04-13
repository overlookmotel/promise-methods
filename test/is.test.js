/* --------------------
 * promise-methods module
 * Tests for `is` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	{is} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('is()', () => {
	it('returns true for a Promise', () => {
		const res = is(new Promise(() => {}));
		return expect(res).to.equal(true);
	});

	it('returns true for a thenable', () => {
		const res = is({then() {}});
		return expect(res).to.equal(true);
	});

	it('returns false for undefined', () => {
		const res = is(undefined);
		return expect(res).to.equal(false);
	});

	it('returns false for null', () => {
		const res = is(null);
		return expect(res).to.equal(false);
	});

	it('returns false for boolean', () => {
		const res = is(true);
		return expect(res).to.equal(false);
	});

	it('returns false for object with no .then property', () => {
		const res = is({});
		return expect(res).to.equal(false);
	});

	it('returns false for object with .then property which is not a function', () => {
		const res = is({then: 123});
		return expect(res).to.equal(false);
	});

	it('returns false for function', () => {
		const res = is(() => {});
		return expect(res).to.equal(false);
	});
});
