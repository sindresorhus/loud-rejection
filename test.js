'use strict';
const fn = require('./');
const test = require('ava');
fn();

function fire() {
	return new Promise(function (resolve, reject) {
		setImmediate(function () {
			reject(new Error('unicorn'));
		});
	});
}

function testExit(onConsole) {
	const _error = console.error;

	console.error = onConsole;
	process.emit('exit');
	console.error = _error;
}

test.serial('Never handle rejection', t => {
	t.plan(2);

	const promise = fire();

	setTimeout(() => {
		testExit(msg => {
			t.regexTest(/unicorn/, msg);
		});

		// Clean up
		promise.catch(() => {});

		setTimeout(() => {
			t.pass('Process is still alive');
		}, 10);
	}, 10);
});

test.serial('Handle rejection later', t => {
	t.plan(2);

	const promise = fire();

	setTimeout(() => {
		promise.catch(function (err) {
			t.is(err.message, 'unicorn');
		});

		testExit(() => {
			t.fail();
		});

		setTimeout(() => {
			t.pass('Process is still alive');
		}, 10);
	}, 10);
});
