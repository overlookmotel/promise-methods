/* --------------------
 * promise-methods module
 * Tests for `props` method
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	{expect} = chai,
	P = require('../lib/');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

describe('props()', () => {
	it('resolves all promises', () => {
		const rets = {
			v1: {a: 1},
			v2: {a: 2},
			v3: {a: 3},
			v4: {a: 4},
			v5: {a: 5}
		};

		class C {}
		C.prototype.v5 = Promise.resolve(rets.v5);
		const obj = new C();
		Object.assign(obj, {
			v1: Promise.resolve(rets.v1),
			v2: Promise.resolve(rets.v2),
			v3: Promise.resolve(rets.v3),
			v4: Promise.resolve(rets.v4)
		});

		const p = P.props(obj);

		return p.then((ret) => {
			expect(ret).to.deep.equal(rets);
			expect(ret.v1).to.equal(rets.v1);
			expect(ret.v2).to.equal(rets.v2);
			expect(ret.v3).to.equal(rets.v3);
			expect(ret.v4).to.equal(rets.v4);
			expect(ret.v5).to.equal(rets.v5);
		});
	});

	it('rejects if a promise rejects', () => {
		const err = new Error('e');
		const p = P.props({
			a: Promise.resolve(123),
			b: Promise.reject(err)
		});
		return expect(p).to.be.rejectedWith(err);
	});

	describe('with empty object', () => {
		it('promise resolves to empty object', () => {
			const p = P.props({});
			return expect(p).to.eventually.deep.equal({});
		});
	});
});
