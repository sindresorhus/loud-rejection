import {fork} from 'child_process';
import test from 'ava';
import getStream from 'get-stream';
import delay from 'delay';
import execa from 'execa';

function tick(time) {
	// slow things down for reliable tests on Travis CI
	return delay(process.env.CI ? time * 10 : time);
}

test.cb.beforeEach(t => {
	const child = fork('fixture.js', {silent: true});

	const exit = new Promise((resolve, reject) =>
		child.on('exit', code =>
			(code > 0 ? reject : resolve)(code)
		)
	);

	t.context = {
		// tell the child to create a promise, and reject it
		rejectWithError: (key, message) => child.send({
			action: 'reject-error',
			key,
			message
		}),
		rejectWithValue: (key, value) => child.send({
			action: 'reject-value',
			key,
			value
		}),
		rejectWithNothing: key => child.send({
			action: 'reject-nothing',
			key
		}),

		// tell the child to handle the promise previously rejected
		handle: key => child.send({
			action: 'handle',
			key
		}),

		// tell the child to reinstall loudRejection
		reinstall: () => child.send({action: 'reinstall'}),

		// kill the child (returns a promise for when the child is done)
		kill: () => {
			child.kill();
			return exit;
		},

		// the stdout of the child. Useful for debug
		stdout: getStream(child.stdout),

		// the stderr of the child. This is where unhandledRejections will be logged
		stderr: getStream(child.stderr),

		// promise for when the child has exited
		exit
	};

	child.on('message', message => {
		if (message.status !== 'ready') {
			t.fail(`I got a message I don't understand: ${JSON.stringify(message)}`);
		}

		t.end();
	});
});

test('no rejections', async t => {
	const child = t.context;

	await tick(20);
	await child.kill();

	t.is(await child.stderr, '');
});

test('one unhandled rejection', async t => {
	const child = t.context;

	child.rejectWithError('a', 'foo123');
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /foo123/);
});

test('two unhandled rejections', async t => {
	const child = t.context;

	child.rejectWithError('a', 'foo456');
	child.rejectWithError('b', 'bar789');
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /foo456/);
	t.regex(await child.stderr, /bar789/);
});

test('one rejection that is handled before exit', async t => {
	const child = t.context;

	child.rejectWithError('a', 'foo123');
	await tick(20);
	child.handle('a');
	await tick(20);
	await child.kill();

	t.is(await child.stderr, '');
});

test('two rejections, first one handled', async t => {
	const child = t.context;

	child.rejectWithError('a', 'foo987');
	child.rejectWithError('b', 'bar654');
	await tick(20);
	child.handle('a');
	await tick(20);
	await child.kill();

	t.false(/foo987/.test(await child.stderr));
	t.regex(await child.stderr, /bar654/);
});

test('two rejections, last one handled', async t => {
	const child = t.context;

	child.rejectWithError('a', 'foo987');
	child.rejectWithError('b', 'bar654');
	await tick(20);
	child.handle('b');
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /foo987/);
	t.false(/bar654/.test(await child.stderr));
});

test('rejection with a string value', async t => {
	const child = t.context;

	child.rejectWithValue('a', 'foo123');
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /Promise rejected with value: 'foo123'/);
});

test('rejection with a falsy value', async t => {
	const child = t.context;

	child.rejectWithValue('a', false);
	child.rejectWithValue('a', 0);
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /Promise rejected with value: false/);
	t.regex(await child.stderr, /Promise rejected with value: 0/);
});

test('rejection with no value', async t => {
	const child = t.context;

	child.rejectWithNothing();
	await tick(20);
	await child.kill();

	t.regex(await child.stderr, /Promise rejected with value: undefined/);
});

test('custom log function', async t => {
	// TODO: use execa `reject: false` option
	const stdout = await execa('node', ['fixture-custom-log.js']).catch(err => err.stdout);
	t.is(stdout.split('\n')[0], 'custom-log Error: foo');
});
