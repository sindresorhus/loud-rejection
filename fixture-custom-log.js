'use strict';
const loudRejection = require('.');

loudRejection(string => {
	console.log('custom-log', string);
});

Promise.reject(new Error('foo'));
