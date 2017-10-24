var src = './dist/**/*.html';

module.exports = {
    src: src,
    destDir: 'src/main/webapp/views',
    remote: 'origin',
    branch: 'master',
    message: 'sync [' + src + ']'
};