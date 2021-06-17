---
title: 需要完成的任务清单
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210611140112.png
categories:
  - 推荐
tags:
  - task
  - list
---

# Todo

需要完成的 task, 挖坑开始:

1. > js 中的精度问题
2. > js 的隐式转换问题
3. > js RegExp 总结分享
4. > git 分享的记录
5. > git 分支内容的补充
6. > git 子仓库介绍
7. > haomo 项目总结 通用: 视频流的建立
8. > styleComponents 的动画使用
9. > npm npx cnpm yarn pnpm ?
10. > Rxjs 流式管理
11. > github vue 项目中的记录的转移
12. > github node 使用的记录的转移
13. > node 邮件 定时邮件模块
14. > snowpack vite esbuild rollup sevlte webpack parcel
15. > oneTab 中的页面处理
16. > juejin 收藏的理解消化
17. > 微信收藏理解总结
18. > lerna
19. > 算法 数据结构
20. > ~~blog 增加评论功能~~
21. > ~~首页 loading 效果更改~~
22. > ~~github 个人首页装饰(数据统计 仓库)~~ 待更换样式
23. > ~~icon 除黑白边~~
24. > vscode 插件补充

defaults write com.dteoh.SlowQuitApps whitelist -array-add com.microsoft.VSCode

defaults read com.dteoh.SlowQuitApps whitelist

alt + s 开关 chrome vim
killall SlowQuitApps

{ "key": "cmd+q", "command": "-workbench.action.quit", "when": "isMac" },
{ "key": "cmd+q cmd+q", "command": "workbench.action.quit", "when": "isMac" },

git branch | grep "fix" | xargs git branch -D

更新远程的删除信息 git fetch -p origin
列出分支信息 git branch -[area?] --[mergeParams] [branchName?]
删除分支本地 git branch -[del] [branchName]
删除远程分支 git push origin -[del] [branchName]

- ‘？’：表示可选参数
- ‘area’: 默认为将语法适用于本地分支
  - ‘r’: 仅适用于远程分支
  - ‘a’: 显示全部（本地 + 远程）
- 'mergeParams':

  - --merged 已经合并到 master|main 的分支
  - --no-merged 还未合并到 master|main 的分支

- git fetch -p origin | git branch --merged | xargs git branch -d | xargs git push origin -d

git branch --merged | egrep -v "(^\*|master|dev)" | xargs git branch -d

修改分支名，实现无缝衔接
开发中的大佬都是拥有极快手速的人，建了个分支一不小心打错了某个字母或者两个字母打反了，可能就与本意存在较大误差了，Git 提供一种已经拉取了分支，在上面开发了不少的内容，但后来发现原本拉的分支名字就有问题的修复方法。

例如，我们的想新建的分支名为 feature/story-13711，却写成了 feature/stor-13711：

语法：git branch -m <oldbranch> <newbranch>

命令：git branch -m feature/stor-13711 feature/story-13711

不确定哪个分支有自己提交的 commit
工作中会经常碰到一种场景，某个提交先后合并到了各个分支上，但后来发现提交的这个修改是有问题的，需要排查到底哪个分支包含这个提交，然后将其修复掉。

需要先确定有问题的提交的 commit-id :

8(1).png

然后查看本地所有的分支：

8(2).png

可以看到本地有 4 个分支，本地的分支数量非人为控制的，在使用状态的分支直接删掉也不合适，分支数量达到一定程度，一个一个分支查找也不现实。Git 提供了一种能够直接通过 commit-id 查找出包含该内容分支的命令。

语法：git branch --contains <commit-id>

命令：git branch --contains 700920

命令执行后可以看到包含该问题提交的分支如下图所示，就可以很方便的在对应分支上修复内容啦。

8(3).png

可在第三分支上进行新建分支操作
git checkout -b fix-firstMounted origin/master

思考: 问能够在第三方分支上进行 merge 操作么?
eg: 位于分支 A 想要将库里的 B merge into C ?
结论: 感觉并不是 git 没有想过而是 git 觉得没有必要 因为 merge 就意味着会存在冲突的情况 如果不在 merge 的源分支上不能及时处理冲突 也不能推送 因此有问题

有时候，你可能想强制 git 创建一个 merge commit，这样你就知道一个分支被合并到哪里了。在这种情况下，你可以通过合并-no- off 标志来阻止 git 执行“快进”。

git merge --no-ff make_function

fatal: The upstream branch of your current branch does not match
the name of your current branch. To push to the upstream branch
on the remote, use

    git push origin HEAD:main

To push to the branch of the same name on the remote, use

    git push origin HEAD

fatal: The current branch test has no upstream branch.

To push the current branch and set the remote as upstream, use

    git push --set-upstream origin test

1.  Which one of these lines is correct?
    git checkout 'another_branch'
    Or

git checkout origin 'another_branch'
Or

git checkout origin/'another_branch'
And what is the difference between them?

If another_branch already exists locally and you are not on this branch, then git checkout another_branch switches to the branch.

If another_branch does not exist but origin/another_branch does, then git checkout another_branch is equivalent to git checkout -b another_branch origin/another_branch; git branch -u origin/another_branch. That's to create another_branch from origin/another_branch and set origin/another_branch as the upstream of another_branch.

If neither exists, git checkout another_branch returns error.

git checkout origin another_branch returns error in most cases. If origin is a revision and another_branch is a file, then it checks out the file of that revision but most probably that's not what you expect. origin is mostly used in git fetch, git pull and git push as a remote, an alias of the url to the remote repository.

git checkout origin/another_branch succeeds if origin/another_branch exists. It leads to be in detached HEAD state, not on any branch. If you make new commits, the new commits are not reachable from any existing branches and none of the branches will be updated.

2.

```javascript
// 闭包的应用
function zero(fn) {
  return fn !== undefined ? fn(0) : 0;
}
function one(fn) {
  return fn !== undefined ? fn(1) : 1;
}
function two(fn) {
  return fn !== undefined ? fn(2) : 2;
}
function three(fn) {
  return fn !== undefined ? fn(3) : 3;
}
function four(fn) {
  return fn !== undefined ? fn(4) : 4;
}
function five(fn) {
  return fn !== undefined ? fn(5) : 5;
}
function six(fn) {
  return fn !== undefined ? fn(6) : 6;
}
function seven(fn) {
  return fn !== undefined ? fn(7) : 7;
}
function eight(fn) {
  return fn !== undefined ? fn(8) : 8;
}
function nine(fn) {
  return fn !== undefined ? fn(9) : 9;
}

function plus(fn) {
  return (num) => num + fn;
}
function minus(fn) {
  return (num) => num - fn;
}
function times(fn) {
  return (num) => num * fn;
}
function dividedBy(fn) {
  return (num) => ~~(num / fn);
}
```
