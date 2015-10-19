'use strict';
var weak = require('weak');
var installed = false;

module.exports = function () {
	if (installed) {
		console.trace('WARN: loud rejection called more than once');
		return;
	}

	installed = true;

	var error = new Set();
	var store = new WeakMap();

	function blowUp(reason) {
		return function () {
			error.delete(reason);
			throw reason;
		};
	}

	process.on('unhandledRejection', function (reason, p) {
		store.set(p, {ref: weak(p, blowUp(reason)), reason: reason});
		error.add(reason);
	});

	process.on('rejectionHandled', function (p) {
		weak.removeCallbacks(store.get(p).ref);
		error.delete(store.get(p).reason);
	});

	process.on('exit', function () {
		if (error.size) {
			throw error.values().next().value;
		}
	});
};
