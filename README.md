# copy-push

[![NPM version][npm-image]][npm-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/copy-push.svg?style=flat-square
[npm-url]: https://npmjs.org/package/copy-push
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/ufologist/copy-push/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/copy-push/blob/master/CHANGELOG.md

一步完成文件的复制和提交(git)

## 为什么做这个

前后端分离的开发过程中, 每次前端将静态资源文件上传到 CDN 之后, 还需要将页面放置到后端项目的目录中, 然后再提交到 git.

因此每次都需要重复的执行: `pull -> copy -> add -> commit -> push`, 整个过程很是繁琐.

对于重复的工作, 很懒的我们肯定是需要自动化工具代劳之.

## 使用方法

* 全局安装使用

  ```
  npm install copy-push -g
  cd fe-project
  copy-push --destRoot=../backend-project --destDir=dir
  ```

  也可以局部安装, 配置在 `npm scripts` 中来使用

  ```
  cd fe-project
  npm install copy-push --save-dev
  ```

  ```
  "scripts": {
      "copy-push": "copy-push --destRoot=../backend-project --destDir=dir"
  }
  ```

  ```
  npm run copy-push
  ```
* 做为模块使用

  ```
  npm install copy-push --save-dev
  cd fe-project
  ```

  ```javascript
  // fe-project/copy-push.js
  var copyPush = require('copy-push');

  var destRoot = '../backend-project';
  var destDir = 'dir';

  copyPush(destRoot, { // 详见参数说明
      destDir: destDir
  });
  ```

## 参数说明

全局安装使用时, 可以运行 `copy-push --help` 来查看参数说明

| 参数      | 说明                | 默认值 | 是否必选 |
|-----------|--------------------|--------|------|
| src       | 需要复制的文件(glob)| ./dist/**/*.html |       |
| destRoot  | 复制文件到哪个项目(git项目的根目录)       |        |  是    |
| destDir   | 复制文件到哪个目录(相对于 destRoot 目录)|  src/main/webapp/views    | |
| remote    | 远程仓库            |  origin    ||
| branch    | 分支名              |  master     ||
| message   | 提交信息            | sync [./dist/**/*.html] ||

## 示例

[截图]