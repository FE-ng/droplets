---
title: npm install 原理
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210623160551.png
date: 2021-06-24 11:48:29
categories:
  - npm
tags:
  - npm
  - package
  - 包管理
---

<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624114733.png"  alt="效果图" />

## package-lock.json 的作用

由于 package.json 文件中的语义版本锁定，安装源也不固定，我们在协同开发和线上构建时，不同开发者 npm i 得到的依赖版本可能会有一定差异。  
而 package-lock.json 的出现，正是为了保证我们依赖版本的一致性。  
对于是否将 package-lock.json 文件上传到远程仓库，也有许多有趣的讨论，  
**[例如 package-lock.json 需要写进 .gitignore 吗？](https://www.zhihu.com/question/264560841)**
这里讨论的是将该文件上传到远程仓库时，可能遇到的一些问题和解决方法。
package-lock.json 的表现

## 在npm@5.4.2版本后的表现：

1. 无 package-lock.json
   npm i 根据 package.json 进行安装，并生成 package-lock.json

2. package.json 和 package-lock.json 的版本不兼容
   npm i 会以 package.json 为准进行安装，并更新 package-lock.json

3. package.json 和 package-lock.json 的版本兼容
   npm i 会以 package-lock.json 为准进行安装。

## 关于旧的 npm 版本的表现，

**查阅资料得知，自 npm 5.0 版本发布以来，npm i 的规则发生了三次变化。**

1. npm 5.0.x 版本，不管 package.json 怎么变，npm i 时都会根据 lock 文件下载
   [package-lock.json file not updated after package.json file is changed · Issue #16866 · npm/npm](https://github.com/npm/npm/issues/16866)  
    这个 issue 控诉了这个问题，明明手动改了 package.json，为啥不给我升级包！然后就导致了 5.1.0 的问题...
2. 5.1.0 版本后 npm install 会无视 lock 文件 去下载最新的 npm 然后有人提了这个  
   [issue why is package-lock being ignored? · Issue #17979 · npm/npm](https://github.com/npm/npm/issues/17979)
   控诉这个问题，最后演变成 5.4.2 版本后的规则。
3. 5.4.2 版本后 [why is package-lock being ignored? · Issue #17979 · npm/npm](https://github.com/npm/npm/issues/17979)

最终才有了 **在npm@5.4.2版本后的表现**

## npm ci

由于以上 5.4.2 版本的第 1、2 点的存在，即使有 package-lock.json 文件，配合 npm i，  
我们也不能保证线上**构建时的依赖版本与本地开发时的一致**。
npm ci 是类似于 npm i 的命令。npm ci 与 npm i 主要的差异有：

- 使用 npm ci 的项目必须存在 package-lock.json 或 npm-shrinkwrap.json 文件，否则无法执行
- 如果 package-lock.json 或 npm-shrinkwrap.json 中的依赖与 package.json 中不一致（即以上 2 的情况），  
  npm ci 会报错并退出，而不是更新 lock 文件
- npm ci 只会安装整个项目，无法单独安装某个依赖项目
- 如果项目中已有 node_modules，该文件夹会在 npm ci 执行安装前自动被移除
- 该命令不会写入 package.json 或 lock 文件，安装的行为是完全被固定的。

**基于以上几种特性，使用 npm ci 能够有效防止线上构建的依赖与开发者本地不一致。**

## 如何解决 package-lock.json 的冲突

package-lock.json 文件不由开发者自行写入，在协同开发时，某一方若更新了依赖，很容易产生大量冲突，且难以逐个解决。

1. npm 文档中推荐的两种方式：

从 5.7.0 版本的 npm 开始，解决 package-lock.json 的冲突可以通过解决 package.json 的冲突后，运行 npm install [--package-lock-only] 来完成。npm 会自动解析 package-lock.json 中的冲突，并生成一个有着合理的 tree 结构，且包含了两个分支的所有依赖的 lock 文件。
文档中还提到了一个 npm-merge-driver 工具，可以帮助开发者解决 package-lock.json 的冲突。

2. 至于旧版本的 npm，可以尝试对于 package-lock.json 文件，忽略掉冲突，并重新 npm i。

最好将文件重置到非自己开发分支的状态，便于合并之后的验证。  
例如，对于将 master 合进自己开发的特性分支的情况（如 git pull origin master），对于冲突，选择 Accept All Incoming。

参考文献
链接：https://juejin.cn/post/6844904116108410887
链接：https://www.zhihu.com/question/62331583/answer/275248129
