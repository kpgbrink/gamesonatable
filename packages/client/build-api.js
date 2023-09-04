const crossSpawn = require('cross-spawn');
const { chdir, } = require('node:process');
chdir('../api');
process.exitCode = crossSpawn.sync('npm', ['run', 'build'], { stdio: 'inherit' }).status;
