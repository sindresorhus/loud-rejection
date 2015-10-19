'use strict';
var installed = false;

function outputRejectedMessage(err) {
	if (err instanceof Error) {
		console.error(err.stack);
	} else if (err) {
		console.error('Promise rejected with value:', err);
	} else {
		console.error('Promise rejected no value');
	}
}

module.exports = function () {
	var unhandledRejections = [];

	if (installed) {
		console.trace('WARN: loud rejection called more than once');
		return;
	}

	installed = true;

	process.on('unhandledRejection', function (reason, p) {
		unhandledRejections.push({reason: reason, p: p});
	});

	process.on('rejectionHandled', function (p) {
		var index = unhandledRejections.reduce(function (result, item, idx) {
			return (item.p === p ? idx : result);
		}, -1);
		unhandledRejections.splice(index, 1);
	});

	process.on('exit', function () {
		if (unhandledRejections.length > 0) {
			unhandledRejections.forEach(function (x) {
				outputRejectedMessage(x.reason);
			});
			process.exitCode = 1;
		}
	});
};
