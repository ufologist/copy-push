# CHANGELOG

* v1.2.1 2020-3-4

  * fix: 构建机上 `git remote get-url origin --push` 报错: `error: Unknown subcommand: get-url`
    * 因此修改为 `git config --get remote.origin.url`
    * [In git v2.7.0+, a subcommand get-url was introduced to git-remote command.](https://stackoverflow.com/questions/15715825/how-do-you-get-the-git-repositorys-name-in-some-git-repository)
  * fix: 构建机上 `git log -1 --pretty=format:"%h %cn %cd" --date=format:"%Y-%m-%d %H:%M:%S"` 报错: `fatal: unknown date format format:%Y-%m-%d %H:%M:%S`
    * 因此修改为 `git log -1 --pretty=format:"%h %cn %cd" --date=iso`

* v1.2.0 2020-3-4

  * feat: 在 copy-push 默认的提交信息中增加远端项目名, 当前分支名和最近一次的提交日志

* v1.1.3 2019-5-5

  * [fix] 解决 `fetch` 之后只有远程分支没有本地分支, 无法 `checkout` 的问题

* v1.1.2 2018-7-19

  * [fix] 修复本地分支与要提交到的分支有冲突, 造成 push 失败的问题

    优化提交的流程为: `fetch -> checkout -> pull -> copy -> add -> commit -> push`

* v1.1.1 2018-4-20

  * [fix] 修复出错后没有退出进程的问题

* v1.1.0 2018-4-19

  添加直接 `git clone` 远程仓库的方法
  * 如果发现没有本地仓库文件夹, 则先 `clone` 远程仓库
  * 如果已经存在本地仓库, 则直接走原来的流程

* v1.0.2 2018-3-6

  修改提交流程, 先 `pull` 远程分支再 `checkout` 分支

* v1.0.1 2017-12-14

  添加 `stash` 和 `checkout` 步骤, 否则会需要手工先切分支

* v1.0.0 2017-10-24

  初始版本