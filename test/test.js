var copyPush = require('copy-push');

var destRoot = '../backend-project';
var destDir = 'dir';

copyPush(destRoot, {
    destDir: destDir
});