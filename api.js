'use strict';
var findIndex = require('array-findindex');

// TODO Move ponyfill to separate module.
Array.prototype.findIndex = Array.prototype.findIndex || function (callback, thisArg) {
	return findIndex(this, callback, thisArg);
};

// WARNING: This undocumented API is subject to change.

module.exports = function (process) {
	var unhandledRejections = [];

	process.on('unhandledRejection', function (reason, p) {
		unhandledRejections.push({reason: reason, promise: p});
	});

	process.on('rejectionHandled', function (p) {
		var index = unhandledRejections.findIndex(function (item) {
			return (item.promise === p);
		});

		unhandledRejections.splice(index, 1);
	});

	function currentlyUnhandled() {
		return unhandledRejections.map(function (entry) {
			return {
				reason: entry.reason,
				promise: entry.promise
			};
		});
	}

	return {
		currentlyUnhandled: currentlyUnhandled
	};
};
