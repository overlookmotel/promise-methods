/* --------------------
 * promise-methods module
 * Tests for `all` method
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

/* jshint expr: true */
/* global describe, it */

describe('all()', function() {
	it('resolves all promises', function() {
		const p = P.all([Promise.resolve(123), Promise.resolve(456)]);
		return expect(p).to.eventually.deep.equal([123, 456]);
	});

	it('rejects if a promise rejects', function() {
		const err = new Error('e');
		const p = P.all([Promise.resolve(123), Promise.reject(err)]);
		return expect(p).to.be.rejectedWith(err);
	});
});
