'use strict';

// WARNING: This undocumented API is subject to change.

// TODO Move ponyfill to separate module.
var findIndex;
if (Array.prototype.findIndex) {
	findIndex = function (arr, callback, thisArg) {
		return arr.findIndex(callback, thisArg);
	};
} else {
	findIndex = require('array-findindex');
}

module.exports = function (process) {
	var unhandledRejections = [];

	process.on('unhandledRejection', function (reason, p) {
		unhandledRejections.push({reason: reason, promise: p});
	});

	process.on('rejectionHandled', function (p) {
		var index = findIndex(unhandledRejections, function (item) {
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
