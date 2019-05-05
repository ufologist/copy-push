var path = require('path');
var fs = require('fs');

var ora = require('ora');
var copy = require('copy');
var simpleGit = require('simple-git/promise');

var defauls = require('./defaults.js');

/**
 * 一步完成代码的拉取和提交
 * 
 * clone -> pull -> copy -> commit -> push
 * 
 * @param {string} destRoot 本地仓库文件夹路径
 * @param {object} options 配置项
 * @returns {Promise}
 */
function copyPush(destRoot, options) {
    options = Object.assign({}, defauls, options);

    console.log('clone & copy & push');
    console.log('clone -> pull -> copy -> commit -> push');
    console.log('----输入的参数----');
    options.destRoot = destRoot;
    console.log(JSON.stringify(options, null, 4));
    console.log('-----------------');

    var startTime = new Date();

    if (fs.existsSync(destRoot)) {
        return push(destRoot, options, startTime);
    } else if (options.repoUrl) {
        return clone(options.repoUrl, destRoot).then(() => push(destRoot, options, startTime));
    } else {
        throw new Error(path.resolve(destRoot) + ' not exist.');
    }
}

/**
 * 提交代码
 * 
 * @param {string} destRoot 本地仓库文件夹路径
 * @param {object} options 配置项
 * @param {Date} startTime 执行开始时间
 */
function push(destRoot, options, startTime) {
    var addFiles = options.destDir + '/*';

    var stashInfo = 'stash ' + path.resolve(destRoot);
    var fetchInfo = 'fetch ' + options.remote + '/' +  options.branch;
    var checkoutInfo = 'checkout ' + options.branch;
    var pullInfo = 'pull ' + options.remote + '/' + options.branch;
    var copyInfo = 'copy ' + options.src + ' -> ' + path.resolve(destRoot, options.destDir);
    var addInfo = 'add ' + addFiles;
    var commitInfo = 'commit ' + options.message;
    var pushInfo = 'push ' + options.remote + '/' + options.branch;

    var spinner = ora(stashInfo).start();

    var git = simpleGit(destRoot);
    return git.stash()
              .then(() => spinner.succeed(stashInfo))
              // checkout master
              // 由于 fetch 关联分支的命令不能用于当前的分支, 因此先切回 master 分支
              .then(() => git.checkout('master'))
              // fetch
              .then(() => spinner = ora(fetchInfo).start())
              // 为了解决 fetch 之后, 虽然有了远端的分支, 但 checkout 不了分支的问题
              // error: pathspec 'branch-name' did not match any file(s) known to git.
              //
              // https://stackoverflow.com/questions/1783405/how-do-i-check-out-a-remote-git-branch/19442557#19442557
              // This will fetch the remote branch and create a new local branch (if not exists already) with name local_branch_name and track the remote one in it.
              // 
              // https://stackoverflow.com/questions/29028696/why-git-fetch-origin-branchbranch-works-only-on-a-non-current-branch/32561463#32561463
              // fatal: Refusing to fetch into current branch refs/heads/branch-name of non-bare repository
              .then(() => git.fetch([options.remote, options.branch + ':' + options.branch]))
              .then(() => spinner.succeed(fetchInfo))
              // checkout
              .then(() => spinner = ora(checkoutInfo).start())
              .then(() => git.checkout(options.branch))
              .then(() => spinner.succeed(checkoutInfo))
              // pull
              .then(() => spinner = ora(pullInfo).start())
              .then(() => git.pull(options.remote, options.branch))
              .then(() => spinner.succeed(pullInfo))
              // copy
              .then(() => spinner = ora(copyInfo).start())
              .then(() => {
                  return new Promise(function(resolve, reject) {
                      copy(options.src, path.resolve(destRoot, options.destDir), function(error, files) {
                          if (error) throw error;

                          spinner.succeed(copyInfo + ' ' + files.length + ' files');
                          resolve();
                      });
                  });
              })
              // add
              .then(() => spinner = ora(addInfo).start())
              .then(() => git.add(addFiles))
              .then(() => spinner.succeed(addInfo))
              // commit
              .then(() => spinner = ora(commitInfo).start())
              .then(() => git.commit(options.message))
              .then((commitSummary) => spinner.succeed('commit ' + options.message + ' branch: ' +       commitSummary.branch + ' commit: ' + commitSummary.commit))
              // push
              .then(() => spinner = ora(pushInfo).start())
              .then(() => git.push(options.remote, options.branch))
              .then(() => spinner.succeed(pushInfo))
              .then(() => {
                  var endTime = new Date();
                  var cost = endTime.getTime() - startTime.getTime();
                  return spinner.succeed('finish ' + endTime.toLocaleTimeString() + ' cost: ' + cost + 'ms');
              })
              .catch((error) => {
                  spinner.fail('fail :(');
                  console.error(error);
                  process.exit(1);
              });
}

/**
 * 拉取仓库代码
 * 
 * @param {string} repoUrl 远程仓库的 URL
 * @param {string} destRoot 本地文件夹路径
 */
function clone(repoUrl, destRoot) {
    var cloneInfo = 'clone ' + repoUrl + ' -> ' + path.resolve(destRoot);

    var spinner = ora(cloneInfo).start();

    var git = simpleGit();
    return git.clone(repoUrl, destRoot)
              .then(() => spinner.succeed('cloned ' + path.resolve(destRoot)))
              .catch((error) => {
                   spinner.fail('fail :(');
                   console.error(error);
                   process.exit(1);
              });
}

module.exports = copyPush;