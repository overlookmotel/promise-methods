/* --------------------
 * promise-methods module
 * Tests for `wait` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	sinon = require('sinon'),
	chaiAsPromised = require('chai-as-promised'),
	sinonChai = require('sinon-chai'),
	{expect} = chai,
	{wait} = require('../index');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// Tests

describe('wait()', () => {
	it('returns a promise', () => {
		const p = wait();
		expect(p).to.be.instanceof(Promise);
		return p;
	});

	it('promise resolves after specifed ms', () => {
		const p = wait(100);
		const thenSpy = sinon.fake();
		const p2 = p.then(thenSpy);

		expect(thenSpy).not.to.be.called;

		return delay(80).then(() => {
			expect(thenSpy).not.to.be.called;
			return delay(40);
		}).then(() => {
			expect(thenSpy).to.be.calledOnce;
			return p2;
		});
	});

	it('if wait undefined, promise resolves after 0 ms', () => {
		const p = wait();
		const thenSpy = sinon.fake();
		const p2 = p.then(thenSpy);

		expect(thenSpy).not.to.be.called;

		return delay().then(() => {
			expect(thenSpy).to.be.calledOnce;
			return p2;
		});
	});
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms || 50));
}
