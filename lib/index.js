/* --------------------
 * promise-methods module
 * Entry point
 * ------------------*/

'use strict';

// Imports
const promisify = require('./promisify'),
	promiseTry = require('./try'),
	method = require('./method'),
	wait = require('./wait'),
	defer = require('./defer'),
	promiseFinally = require('./finally'),
	Queue = require('./queue'),
	parallel = require('./parallel'),
	series = require('./series'),
	all = require('./all'),
	props = require('./props'),
	propsOwn = require('./propsOwn'),
	forEach = require('./forEach'),
	map = require('./map'),
	forIn = require('./forIn'),
	forOwn = require('./forOwn'),
	mapIn = require('./mapIn'),
	mapOwn = require('./mapOwn'),
	forEachSeries = require('./forEachSeries'),
	mapSeries = require('./mapSeries'),
	forInSeries = require('./forInSeries'),
	forOwnSeries = require('./forOwnSeries'),
	mapInSeries = require('./mapInSeries'),
	mapOwnSeries = require('./mapOwnSeries');

// Exports
module.exports = {
	/*
	 * Main exports
	 */

	// Function methods
	promisify,
	try: promiseTry,
	method,

	// Deferred
	defer,

	// Misc methods
	wait,
	finally: promiseFinally,

	// Queue methods
	parallel,
	series,
	Queue,

	// Collection methods
	all,
	props,
	propsOwn,

	// Collection iteration methods
	forEach,
	map,
	forIn,
	forOwn,
	mapIn,
	mapOwn,
	forEachSeries,
	mapSeries,
	forInSeries,
	forOwnSeries,
	mapInSeries,
	mapOwnSeries,

	/*
	 * Longer named exports
	 */

	// Function methods
	promiseTry,
	promiseMethod: method,

	// Deferred
	promiseDefer: defer,

	// Misc methods
	promiseWait: wait,
	promiseFinally,

	// Queue methods
	promiseParallel: parallel,
	promiseSeries: series,
	PromiseQueue: Queue,

	// Collection methods
	promiseAll: all,
	promiseProps: props,
	promisePropsOwn: propsOwn,

	// Collection iteration methods
	promiseForEach: forEach,
	promiseMap: map,
	promiseForIn: forIn,
	promiseForOwn: forOwn,
	promiseMapIn: mapIn,
	promiseMapOwn: mapOwn,
	promiseForEachSeries: forEachSeries,
	promiseMapSeries: mapSeries,
	promiseForInSeries: forInSeries,
	promiseForOwnSeries: forOwnSeries,
	promiseMapInSeries: mapInSeries,
	promiseMapOwnSeries: mapOwnSeries
};
