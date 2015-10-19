/* eslint-disable no-new */

require('../..')();

new Promise(function (resolve, reject) {
	setTimeout(reject, 20, new Error('unicorn'));
});
