---
title: 需要完成的任务清单
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210611140112.png
date: 2021-06-11 14:06:12
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
14. > snowpack vite esbuild rollup sevlte webpack parcel petite-vue alpine
15. > oneTab 中的页面处理
16. > juejin 收藏的理解消化
17. > 微信收藏理解总结
18. > bilibili 总结
19. > 收藏夹|阅读清单处理
20. > lerna
21. > 算法 数据结构
22. > ~~blog 增加评论功能~~
23. > ~~首页 loading 效果更改~~
24. > ~~github 个人首页装饰(数据统计 仓库)~~ 待更换样式
25. > ~~icon 除黑白边~~
26. > vscode 插件补充
27. > github action CI/CD [自动化发布 npm 包及生成 Github Changelog](https://banyudu.com/posts/auto_publish_npm_and_generate_github_changelog.882513)
28.

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
`git branch | grep "fix" | xargs git branch -D`
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

<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210618160630.png"  alt="效果图" />

```javascript
function nextSmaller(n) {
  const [firstN, ...restN] = String(n).split('').map(Number);
  const arr = [...restN].sort();
  arr.unshift(firstN);
  if (String(n) === arr.join('')) {
    if (Math.min(...restN) >= firstN) return -1;
    if (Math.min(...restN) === 0) {
      const secN = [...new Set(restN)].sort()[1] || 0;
      if (firstN <= secN) return -1;
      return +(
        secN +
        restN
          .join('')
          .replace(secN, firstN)
          .split('')
          .sort((a, b) => b - a)
          .join('')
      );
    } else {
      return +(
        Math.min(...restN) +
        restN
          .join('')
          .replace(Math.min(...restN), firstN)
          .split('')
          .sort((a, b) => b - a)
          .join('')
      );
    }
  }
  return +arr.join('');
}
```

[async pool promise](https://juejin.cn/post/6976028030770610213?utm_source=gold_browser_extension)

<img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210621144901.png"  alt="效果图" />

[用户行为回溯](https://www.rrweb.io/)
[prettier 配置](https://prettier.io/playground/)
https://hejialianghe.gitee.io/computerNetwork/tools.html#_5-5-1-%E7%BD%91%E7%BB%9C%E4%BC%98%E5%8C%96%E6%8C%87%E6%A0%87

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723162120.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723173034.png"  alt="效果图" />

https://sudos.tools/markdown-to-react

[职业规划理解篇](https://mp.weixin.qq.com/s/c6honI0cBIYar9ZgMkcB7Q)

[iptv](https://iptv-org.github.io/iptv/countries/cn.m3u)
[clash](https://sspool.herokuapp.com/)

<!--
 * @Author: your name
 * @Date: 2021-03-24 17:31:13
 * @LastEditTime: 2021-03-25 16:46:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /starry-river/docs/lerna.md
-->

# Monorepo VS MultiRepo

https://juejin.cn/post/6944877410827370504

# 管理模式

使用 lerna 管理项目时，可以选择两种模式。

- 默认的为固定模式(Fixed mode)，当使用 lerna init 命令初始化项目时，就默认为固定模式，也可以使用 lerna init --independent 命令初始化项目，这个时候就为独立模式(Independent mode)。
  固定模式中，packages 下的所有包共用一个版本号(version)，会自动将所有的包绑定到一个版本号上(该版本号也就是 lerna.json 中的 version 字段)，所以任意一个包发生了更新，这个共用的版本号就会发生改变。
- 独立模式允许每一个包有一个独立的版本号，在使用 lerna publish 命令时，可以为每个包单独制定具体的操作，同时可以只更新某一个包的版本号。此种模式时，lerna.json 中的 version 字段指定为 independent 即可。

## lerna clean

删除所有包的 node_modules 目录

## lerna changed

列出下次发版 lerna publish 要更新的包。

# lerna publish

lerna bootstrap --hoist

会打 tag，上传 git,上传 npm。

组件库问题

- node 持续(错误时不中断)
- 快速搭建组件脚本
- 文档完善

- 不同 package 中相同命名的组件问题 √
- install 脚本需要优化
- 导航自定义 √

-
- ts 使用问题 √
- lerna 的使用 √
- lint-stage 失效的问题 原因: husky 的版本 v4 到 v5 或者 v6 时配置的方有 breaking change √
- 增加 stylelint 并支持保存自动修改可以修改的部分 √

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210812170727.png"  alt="效果图" />

变基 rebase （onto） merge 快进（fast-forward， --no--ff）三方合并（哪三方） 如果远程变基了怎么处理
https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA
三棵树 reset checkout git checkout --orphan
https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E7%BD%AE%E6%8F%AD%E5%AF%86
revert
rerere？
四种文件状态
git 文件夹目录存储的东西以及意义
git fetch || git pull
误删除 reflog
git 小游戏https://learngitbranching.js.org/?NODEMO=&locale=zh_CN

https://juejin.im/post/6844904019245137927#heading-7
https://juejin.im/post/6844903986839945229 内部文件

# Git 2.0 以下版本

#只作用于文件的新增和修改
$ git add .  
#只作用于文件的修改和删除
$ gti add -u #作用于文件的增删改
$ git add -A

# Git 2.0 版本

$ git add . 等价于 $ git add -A

git merge https://juejin.im/post/6844904191203213326#heading-3
通过 File->Preferences->Settings 显示隐藏文件.git

https://blog.cti.app/archives/1344

底层命令建立一个 commit
https://juejin.im/post/6844904053370159112
索引(暂存区)根据图示，我理解是一个中间态的 tree；如果没有暂存区的话，每次的改动 add 之后 git 都需要在本地仓库内生成一个新的 tree，应该是比较混乱和高成本的。有了这个暂存区，每次改动并 add 之后，只更新这个中间态的 tree，然后等你确认好了之后 commit，这时候才真正的产生一个 tree，并在此基础上产生 commit。有点类似虚拟 DOM 与真实 DOM 的感觉。个人理解，欢迎讨论。
内部对象 https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%AF%B9%E8%B1%A1
https://blog.coding.net/blog/principle-of-git

解析.git 文件夹，深入了解 git 内部原理https://juejin.im/post/6844903986839945229#heading-0
https://stackoverflow.com/questions/18137175/in-git-what-is-the-difference-between-origin-master-vs-origin-master
git blame https://segmentfault.com/a/1190000004446181
http://www.ruanyifeng.com/blog/2018/12/git-bisect.html
.git/refs https://jingsam.github.io/2018/10/12/git-reference.html
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210812171054.png"  alt="效果图" />
git fsck --lost-found
find .git/objects -type f | xargs ls -lt | sed 3q
查找.git/objects 文件夹下的普通文件 按照时间排序后 打印在终端里 sed 3q 是打印 3 行 sed 100q 是打印 100 行
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210812171127.png"  alt="效果图" />

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210812171204.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210812171220.png"  alt="效果图" />
