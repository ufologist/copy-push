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
    var addFiles = options.destDir + '/*';

    var stashInfo = 'stash';
    var checkoutInfo = 'checkout ' + options.branch;
    var pullInfo = 'pull ' + path.resolve(destRoot) + ' ' + options.remote + '/' + options.branch;
    var copyInfo = 'copy ' + options.src + ' -> ' + path.resolve(destRoot, options.destDir);
    var addInfo = 'add ' + addFiles;
    var commitInfo = 'commit ' + options.message;
    var pushInfo = 'push ' + path.resolve(destRoot) + ' ' + options.remote + '/' + options.branch;

    var git;
    if (fs.existsSync(destRoot)) {
        git = simpleGit(destRoot);
    } else {
        throw new Error(path.resolve(destRoot) + ' not exist.');
    }

    // stash
    var spinner = ora(stashInfo).start();
    return git.stash()
              .then(() => spinner.succeed(stashInfo))
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

                          spinner.succeed('copy ' + files.length + ' files');
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

module.exports = copyPush;