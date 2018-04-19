var path = require('path');
var fs = require('fs');

var ora = require('ora');
var copy = require('copy');
var simpleGit = require('simple-git/promise');

var defauls = require('./defaults.js');

/**
 * pull -> copy -> add -> commit -> push
 * 
 * @param {string} destRoot 
 * @param {object} options
 * @returns {Promise}
 */
function copyPush(destRoot, options) {
    options = Object.assign({}, defauls, options);

    console.log('copy & push');
    console.log('pull -> copy -> add -> commit -> push');
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

function push(destRoot, options, startTime) {
    var addFiles = options.destDir + '/*';

    var stashInfo = 'stash ' + path.resolve(destRoot);
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
              // pull
              .then(() => spinner = ora(pullInfo).start())
              .then(() => git.pull(options.remote, options.branch))
              .then(() => spinner.succeed(pullInfo))
              // checkout
              .then(() => spinner = ora(checkoutInfo).start())
              .then(() => git.checkout(options.branch))
              .then(() => spinner.succeed(checkoutInfo))
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
              });
}

function clone(repoUrl, destRoot) {
    var cloneInfo = 'clone ' + repoUrl + ' -> ' + path.resolve(destRoot);

    var spinner = ora(cloneInfo).start();

    var git = simpleGit();
    return git.clone(repoUrl, destRoot)
              .then(() => spinner.succeed('cloned ' + path.resolve(destRoot)))
              .catch((error) => {
                  spinner.fail('fail :(');
                  console.error(error);
              });
}

module.exports = copyPush;