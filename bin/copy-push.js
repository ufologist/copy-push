#!/usr/bin/env node

var yargs = require('yargs');

var pkg = require('../package.json');
var defaults = require('../src/defaults.js');
var copyPush = require('../src/copy-push.js');

var argv = yargs.usage('copy & push@' + pkg.version + '\npull -> copy -> add -> commit -> push').version(pkg.version).option('src', {
    describe: '需要复制的文件(glob)',
    default: defaults.src
}).option('destRoot', {
    describe: '复制文件到哪个项目(git项目的根目录)'
}).option('destDir', {
    describe: '复制文件到哪个目录(相对于 destRoot 目录)',
    default: defaults.destDir
}).option('remote', {
    describe: '远程仓库',
    default: defaults.remote
}).option('branch', {
    describe: '分支名',
    default: defaults.branch
}).option('message', {
    describe: '提交信息',
    default: defaults.message
}).option('repoUrl', {
    describe: 'git 远程仓库的 URL'
}).demandOption(['destRoot']).argv;

copyPush(argv.destRoot, argv);