var copyPush = require('../src/copy-push.js');

var destRoot = './repo';
var destDir = 'dir';

copyPush(destRoot, {
    repoUrl: 'http://git.domain.com/group/repo.git',
    branch: 'dev/test',
    destDir: destDir
});