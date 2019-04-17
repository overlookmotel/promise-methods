/* --------------------
 * promise-methods module
 * Tests for `tap` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	{tap, defer, wait} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('tap()', () => {
	it('returns a Promise if promise resolves', () => {
		const p = Promise.resolve(123);
		const p2 = tap(p, () => {});
		expect(p2).to.be.instanceof(Promise);
	});

	it('returns a Promise if promise rejects', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const p2 = tap(p, () => {});
		expect(p2).to.be.instanceof(Promise);
		await expect(p2).to.be.rejected;
	});

	it('calls handler with resolution value if promise resolves', async () => {
		const p = Promise.resolve(123);
		const spy = sinon.fake.returns(456);
		await tap(p, spy);
		expect(spy).to.be.calledWithExactly(123);
	});

	it('returned promise resolves to original resolution value', async () => {
		const p = Promise.resolve(123);
		const res = await tap(p, () => 456);
		expect(res).to.equal(123);
	});

	it('does not call handler if promise rejects', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const spy = sinon.fake();
		const p2 = tap(p, spy);
		expect(spy).not.to.be.called;
		await expect(p2).to.be.rejected;
	});

	it('returned promise rejects with rejection reason if promise rejects', async () => {
		const err = new Error('foo');
		const p = Promise.reject(err);
		const p2 = tap(p, () => {});
		await expect(p2).to.be.rejectedWith(err);
	});

	it('if handler returns promise, it is awaited before resolving returned promise', async () => {
		const p = Promise.resolve(123);
		const deferred = defer();
		const p2 = tap(p, () => deferred.promise);

		const spy = sinon.fake();
		p2.then(spy);

		await wait(50);
		expect(spy).not.to.be.called;

		deferred.resolve(456);
		await wait(50);
		expect(spy).to.be.called;

		await p2;
	});

	it('if handler throws, promise rejects with error', async () => {
		const p = Promise.resolve(123);
		const err = new Error('foo');
		const p2 = tap(p, () => { throw err; });
		await expect(p2).to.be.rejectedWith(err);
	});

	it('if handler returns rejected promise, promise rejects with rejection reason', async () => {
		const p = Promise.resolve(123);
		const err = new Error('foo');
		const p2 = tap(p, () => Promise.reject(err));
		await expect(p2).to.be.rejectedWith(err);
	});
});
