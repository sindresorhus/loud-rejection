'use strict';
const Promise = require('bluebird');
const loudRejection = require('.');

loudRejection();

const promises = {};

console.log('started');

function reject(key, reason) {
	// IMPORTANT: key is always logged to stdout
	// Make sure to remember that when grepping output (keep key and message different).
	console.log('Rejecting:', key);
	promises[key] = new Promise(((resolve, reject) => {
		reject(reason);
	}));
}

function handle(key) {
	promises[key].catch(() => {});
}

process.on('message', message => {
	switch (message.action) {
		case 'reject-error':
			return reject(message.key, new Error(message.message));
		case 'reject-value':
			return reject(message.key, message.value);
		case 'reject-nothing':
			return reject(message.key);
		case 'reinstall':
			return loudRejection();
		case 'handle':
			return handle(message.key);
		default:
			console.error('Unknown message received:', message);
			process.exit(1);
	}
});

process.send({status: 'ready'});

setTimeout(() => {}, 30000);
