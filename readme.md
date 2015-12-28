# loud-rejection

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]

> Make unhandled promise rejections fail loudly instead of the default [silent fail](https://gist.github.com/benjamingr/0237932cee84712951a2)

By default, promises fail silently if you don't attach a `.catch()` handler to them.

Use it in top-level things like tests, CLI tools, apps, etc, **but not in reusable modules.**


## Install

```
$ npm install --save loud-rejection
```


## Usage

```js
const loudRejection = require('loud-rejection');
const promiseFn = require('promise-fn');

// Install the unhandledRejection listeners
loudRejection();

promiseFn();
```

Without this module it's more verbose and you might even miss some that will fail silently:

```js
const promiseFn = require('promise-fn');

function error(err) {
	console.error(err.stack);
	process.exit(1);
}

promiseFn().catch(error);
```

### Register script

Alternatively to the above, you may simply require `loud-rejection/register` and the unhandledRejection listener will be automagically installed for you.

This is handy for ES2015 imports:

```js
import 'loud-rejection/register';
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)

[npm-badge]: https://badge.fury.io/js/loud-rejection.svg?branch=master
[npm-url]: https://badge.fury.io/js/loud-rejection
[travis-badge]: https://api.travis-ci.org/sindresorhus/loud-rejection.svg?branch=master
[travis-url]: https://travis-ci.org/sindresorhus/loud-rejection
[coveralls-badge]:https://coveralls.io/repos/sindresorhus/loud-rejection/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/sindresorhus/loud-rejection?branch=master
[david-badge]: https://david-dm.org/sindresorhus/loud-rejection.svg
[david-url]: https://david-dm.org/sindresorhus/loud-rejection
