const test = require('ava');
const path = require('path');
const {spawnSync} = require('child_process');

function run(name) {
	const node = process.argv[0];
	const args = [path.join(__dirname, 'fixture', name)];

	return spawnSync(node, args);
}

test('Catch error later', async t => {
	t.plan(3);

	const result = run('success.js');

	t.ifError(result.error);
	t.is(result.status, 0);
	t.is(result.stderr.toString(), 'The error was caught unicorn\n');
});

test('Unhandled rejection', async t => {
	t.plan(3);

	const result = run('failing.js');

	t.ifError(result.error);
	t.not(result.status, 0);
	t.regexTest(/Error: unicorn/, result.stderr.toString());
});
