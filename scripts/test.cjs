// Run the same explicit portable suite in a clean checkout and a research workspace.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const suite = JSON.parse(fs.readFileSync(path.join(root, 'app/tests/suite.json')));
const tests = suite.runtimeAndModelTests.map(file => path.join('app/tests', file));
for (const file of [...tests, ...suite.packagingTests.map(file => path.join('app/tests', file))]) {
  if (!fs.existsSync(path.join(root, file))) throw Error('Missing maintained test: ' + file);
}
function run(command, args) {
  const result = spawnSync(command, args, {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run(process.execPath, ['--test', '--test-concurrency=4', ...tests]);
for (const file of suite.packagingTests) run('python3', [path.join('app/tests', file)]);
