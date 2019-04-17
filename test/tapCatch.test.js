/* --------------------
 * promise-methods module
 * Tests for `tapCatch` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	{tapCatch, defer, wait} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('tapCatch()', () => {
	it('returns a Promise if promise resolves', () => {
		const p = Promise.resolve(123);
		const p2 = tapCatch(p, () => {});
		expect(p2).to.be.instanceof(Promise);
	});

	it('returns a Promise if promise rejects', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const p2 = tapCatch(p, () => {});
		expect(p2).to.be.instanceof(Promise);
		await expect(p2).to.be.rejected;
	});

	it('calls handler with rejection reason', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const spy = sinon.fake();
		const p2 = tapCatch(p, spy);
		await expect(p2).to.be.rejected;
		expect(spy).to.be.calledWithExactly(err);
	});

	it('returned promise rejects with original rejection reason', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const p2 = tapCatch(p, () => {});
		await expect(p2).to.be.rejectedWith(err);
	});

	it('if handler returns resolved promise, it is awaited before rejecting returned promise', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const deferred = defer();
		const p2 = tapCatch(p, () => deferred.promise);

		const spy = sinon.fake();
		p2.catch(spy);

		await wait(50);
		expect(spy).not.to.be.called;

		deferred.resolve(456);
		await wait(50);
		expect(spy).to.be.called;

		await expect(p2).to.be.rejected;
	});

	it('if handler returns rejected promise, it is awaited before rejecting returned promise', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const deferred = defer();
		const p2 = tapCatch(p, () => deferred.promise);

		const spy = sinon.fake();
		p2.catch(spy);

		await wait(50);
		expect(spy).not.to.be.called;

		deferred.reject(new Error('foo2'));
		await wait(50);
		expect(spy).to.be.called;

		await expect(p2).to.be.rejected;
	});

	it('if handler throws, promise rejects with original rejection reason', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const err2 = new Error('foo2');
		const p2 = tapCatch(p, () => { throw err2; });
		await expect(p2).to.be.rejectedWith(err);
	});

	it('if handler returns rejected promise, promise rejects with original rejection reason', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const err2 = new Error('foo2');
		const p2 = tapCatch(p, () => Promise.reject(err2));
		await expect(p2).to.be.rejectedWith(err);
	});
});
