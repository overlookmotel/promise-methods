/* --------------------
 * promise-methods module
 * Tests for `settle` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	{settle} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('settle()', () => {
	it('resolves to array of result objects when all promise resolve', () => {
		const p = settle([Promise.resolve(123), Promise.resolve(456)]);
		return expect(p).to.eventually.deep.equal([
			{resolved: true, result: 123},
			{resolved: true, result: 456}
		]);
	});

	it('awaits all promises', () => {
		const p1 = Promise.resolve(123);
		const p2 = new Promise(
			resolve => setTimeout(() => resolve(456), 50)
		);

		const p = settle([p1, p2]);
		return expect(p).to.eventually.deep.equal([
			{resolved: true, result: 123},
			{resolved: true, result: 456}
		]);
	});

	it('returns rejection reason in results arr when a promise rejects', () => {
		const err = new Error('e');
		const p = settle([Promise.resolve(123), Promise.reject(err)]);
		return expect(p).to.eventually.deep.equal([
			{resolved: true, result: 123},
			{resolved: false, result: err}
		]);
	});

	it('returns rejection reasons in results arr when multiple promises reject', () => {
		const err1 = new Error('e1'),
			err2 = new Error('e2');
		const p = settle([
			Promise.resolve(123),
			Promise.reject(err1),
			Promise.reject(err2)
		]);

		return expect(p).to.eventually.deep.equal([
			{resolved: true, result: 123},
			{resolved: false, result: err1},
			{resolved: false, result: err2}
		]);
	});

	it('awaits all promises when one rejects', async () => {
		const err = new Error('e');
		const p = settle([
			Promise.reject(err),
			new Promise(
				resolve => setTimeout(() => resolve(123), 50)
			)
		]);

		return expect(p).to.eventually.deep.equal([
			{resolved: false, result: err},
			{resolved: true, result: 123}
		]);
	});

	describe('with empty array', () => {
		it('promise resolves to empty array', () => {
			const p = settle([]);
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});
