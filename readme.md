# loud-rejection [![Build Status](https://travis-ci.org/sindresorhus/loud-rejection.svg?branch=master)](https://travis-ci.org/sindresorhus/loud-rejection) [![Coverage Status](https://coveralls.io/repos/github/sindresorhus/loud-rejection/badge.svg?branch=master)](https://coveralls.io/github/sindresorhus/loud-rejection?branch=master)

> Make unhandled promise rejections fail loudly instead of the default [silent fail](https://gist.github.com/benjamingr/0237932cee84712951a2)

By default, promises fail silently if you don't attach a `.catch()` handler to them.

This tool keeps track of unhandled rejections globally. If any remain unhandled at the end of your process, it logs them to STDERR.

Use this in top-level things like tests, CLI tools, apps, etc, **but not in reusable modules.**<br>
Not needed in the browser as unhandled rejections are shown in the console.

> #### ⚠️ &nbsp; Breaking change in minor version
> Since v1.1.0, loud-rejection no longer kills your process in the event of an unhandled rejection. It just logs them to STDERR when the process ends.

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


## API

### loudRejection([log])

#### log

Type: `Function`<br>
Default: `console.error`

Custom logging function to print the rejected promise. Receives the error stack.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
