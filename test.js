/* eslint-disable no-new */
'use strict';
var fn = require('./');

fn();

new Promise(function (resolve, reject) {
	setImmediate(function () {
		reject(new Error('unicorn'));
	});
});
