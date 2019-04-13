/* --------------------
 * promise-methods module
 * Tests for `allAwait` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	{allAwait, defer, wait} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('allAwait()', () => {
	it('resolves all promises', () => {
		const p = allAwait([Promise.resolve(123), Promise.resolve(456)]);
		return expect(p).to.eventually.deep.equal([123, 456]);
	});

	it('awaits all promises', () => {
		const p1 = Promise.resolve(123);
		const p2 = new Promise(
			resolve => setTimeout(() => resolve(456), 50)
		);

		const p = allAwait([p1, p2]);
		return expect(p).to.eventually.deep.equal([123, 456]);
	});

	it('rejects if a promise rejects', () => {
		const err = new Error('e');
		const p = allAwait([Promise.resolve(123), Promise.reject(err)]);
		return expect(p).to.be.rejectedWith(err);
	});

	describe('rejects with first rejection reason', () => {
		it('when all promises reject', () => {
			const err1 = new Error('e1'),
				err2 = new Error('e2');
			const p1 = new Promise((resolve, reject) => {
				setImmediate(() => reject(err1));
			});
			const p2 = Promise.reject(err2);

			const p = allAwait([p1, p2]);
			return expect(p).to.be.rejectedWith(err2);
		});

		it('when some promises reject', () => {
			const p1 = Promise.resolve(123);
			const err2 = new Error('e2'),
				err3 = new Error('e3');
			const p2 = new Promise((resolve, reject) => {
				setImmediate(() => reject(err2));
			});
			const p3 = Promise.reject(err3);

			const p = allAwait([p1, p2, p3]);
			return expect(p).to.be.rejectedWith(err3);
		});
	});

	it('awaits all promises when one rejects', async () => {
		const deferred = defer();
		const err = new Error('e');
		let p = allAwait([
			Promise.reject(err),
			deferred.promise
		]);

		let settled = false;
		p = p.then(
			(res) => {
				settled = true;
				return res;
			},
			(_err) => {
				settled = true;
				throw _err;
			}
		);

		p.catch(() => {}); // Avoid unhandled rejection

		await wait();
		expect(settled).to.equal(false);

		deferred.resolve(123);
		await wait();
		expect(settled).to.equal(true);

		expect(p).to.be.rejectedWith(err);
	});

	describe('with empty array', () => {
		it('promise resolves to empty array', () => {
			const p = allAwait([]);
			return expect(p).to.eventually.deep.equal([]);
		});
	});
});
