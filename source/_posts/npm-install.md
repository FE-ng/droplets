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

<!-- # npm install 原理 -->

<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624114733.png"  alt="效果图" />

在 npm 的早期版本， npm 处理依赖的方式简单粗暴，以递归的形式，严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中。直到有子依赖包不在依赖其他模块。
我们可以来实际测试一下

```json
{
  "name": "package-analysis",
  "version": "0.1.0",
  "description": "package-analysis is about....",
  "author": "liufeng <fengliu018@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "buffer": "^5.4.3",
    "ignore": "^5.1.4"
  }
}
```

我们的模块 package-analysis 现在依赖了：buffer、ignore 连个模块：  
ignore 是一个纯 JS 模块，不依赖任何其他模块，而 buffer 又依赖了下面两个模块：base64-js 、 ieee754。

```json
{
  "dependencies": {
    "base64-js": "^1.3.1",
    "ieee754": "^1.1.13"
  }
}
```

## npm 命令

### npm update

如果想更新已安装模块，就要用到 npm update 命令。

```bash
npm update <packageName>
```

它会先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装。

远程版本是否较新是由 npm 模块仓库提供的信息  
[查询服务网址](https://registry.npmjs.org/)

这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。  
比如，访问 https://registry.npmjs.org/react，就会看到 react 模块所有版本的信息。

```bash
npm view react
# npm view 的别名
npm info react
npm show react
npm v react
```

registry 网址的模块名后面，还可以跟上版本号或者标签，用来查询某个具体版本的信息
返回的 JSON 对象里面，有一个 dist.tarball 属性，是该版本压缩包的网址。
<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624192834.png"  alt="效果图" />
到这个网址下载压缩包，在本地解压，就得到了模块的源码。  
npm install 和 npm update 命令，都是通过这种方式安装模块的。

### 缓存目录

npm install 或 npm update 命令，从 registry 下载压缩包之后，都存放在本地的缓存目录。
这个缓存目录，在 Linux 或 Mac 默认是用户主目录下的.npm 目录，在 Windows 默认是%AppData%/npm-cache。  
通过配置命令，可以查看这个目录的具体位置`npm config get cache`;
在这个目录下又存在我们主要关注是两个目录：

- **content-v2**
  用于存储 tar 包的缓存
- index-v5，content-v2 目录
  用于存储 tar 包的 hash。
  <img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624201056.png"  alt="效果图" />

  {% note info modern %}

  npm 在执行安装时，可以根据 package-lock.json 中存储的 integrity、version、name 生成一个唯一的 key 对应到 index-v5 目录下的缓存记录，  
  从而找到 tar 包的 hash，然后根据 hash 再去找缓存的 tar 包直接使用。
  而这样的缓存策略是从 npm v5 版本开始的，在 npm v5 版本之前，每个缓存的模块在 ~/.npm 文件夹中以模块名的形式直接存储，
  储存结构是{cache}/{name}/{version}。

  {% endnote %}

```
npm cache ls react
~/.npm/react/react/0.14.6/
~/.npm/react/react/0.14.6/package.tgz
~/.npm/react/react/0.14.6/package/
~/.npm/react/react/0.14.6/package/package.json
```

每个模块的每个版本，都有一个自己的子目录，里面是代码的压缩包 package.tgz 文件，以及一个描述文件 package/package.json。
除此之外，还会生成一个{cache}/{hostname}/{path}/.cache.json 文件。比如，从 npm 官方仓库下载 react 模块的时候，  
就会生成 registry.npmjs.org/react/.cache.json 文件。

.npm 目录保存着大量文件，清空它的命令如下。

```bash
 rm -rf ~/.npm/\*
 或者
 npm cache clean
```

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
链接：[一些 package-lock.json 的小知识](https://juejin.cn/post/6844904116108410887)
链接：https://www.zhihu.com/question/62331583/answer/275248129
