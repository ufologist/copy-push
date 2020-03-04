var childProcess = require('child_process');

/**
 * 获取 Git 最近一次的提交日志
 * 
 * @return {string}
 */
function getLatestGitLog() {
    var log = '';
    try {
        log = childProcess.execSync('git log -1 --pretty=format:"%h %cn %cd" --date=iso').toString();
        // 去除最后的换行字符
        log = log.substring(0, log.length - 1);
    } catch (error) {
        console.warn('getLatestGitLog error', error.message);
    }
    return log;
}

/**
 * 获取 Git 远端项目名
 * 
 * @return {string}
 */
function getRemoteRepoName() {
    var remoteRepoName = '';
    try {
        // 获取 origin 远端的URL, 例如 https://github.com/ufologist/copy-push.git
        remoteRepoName = childProcess.execSync('git config --get remote.origin.url').toString();
        remoteRepoName = remoteRepoName.substring(remoteRepoName.lastIndexOf('/') + 1, remoteRepoName.length - 1);
    } catch (error) {
        console.warn('getRemoteRepoName error', error.message);
    }
    return remoteRepoName;
}

/**
 * 获取 Git 当前分支名
 * 
 * @return {string}
 */
function getBranchName() {
    var branchName = '';
    try {
        branchName = childProcess.execSync('git symbolic-ref --short HEAD').toString();
        branchName = branchName.substring(0, branchName.length - 1);
    } catch (error) {
        console.warn('getBranchName error', error.message);
    }
    return branchName;
}

var src = './dist/**/*.html';
// 例如: 'sync [./dist/**/*.html] copy-push.git:dev cecb481 who 2020-03-04 14:58:08 +080;
var message = 'sync [' + src + '] ' + getRemoteRepoName() + ':' + getBranchName() + ' ' + getLatestGitLog();

module.exports = {
    src: src,
    destDir: 'src/main/webapp/views',
    remote: 'origin',
    branch: 'master',
    message: message
};