require('../..')();

var p = new Promise(function (resolve, reject) {
	setTimeout(reject, 20, new Error('unicorn'));
});

setTimeout(function () {
	p.catch(function (err) {
		console.error('The error was caught', err.message);
	});

	p = null;
});
