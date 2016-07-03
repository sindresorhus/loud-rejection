'use strict';
var loudRejection = require('./');

loudRejection(function (str) {
	console.log('custom-log', str);
});

Promise.reject(new Error('foo'));
