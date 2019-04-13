/* --------------------
 * promise-methods module
 * Tests for `all` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	P = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('all()', () => {
	it('resolves all promises', () => {
		const p = P.all([Promise.resolve(123), Promise.resolve(456)]);
		return expect(p).to.eventually.deep.equal([123, 456]);
	});

	it('rejects if a promise rejects', () => {
		const err = new Error('e');
		const p = P.all([Promise.resolve(123), Promise.reject(err)]);
		return expect(p).to.be.rejectedWith(err);
	});

	describe('with empty array', () => {
		it('promise resolves to empty array', () => {
			const p = P.all([]);
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});
