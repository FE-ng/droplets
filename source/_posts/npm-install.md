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

## npm

npm 是一个包管理器也可以说是最大的软件仓库，它让 JavaScript 开发者分享、复用代码更方便（有点 maven 的感觉哈）。
在程序开发中我们常常需要依赖别人提供的框架，写 JS 也不例外。这些可以重复的框架代码被称作包（package）或者模块（module），  
一个包可以是一个文件夹里放着几个文件，同时有一个叫做 package.json 的文件。
一个网站里通常有几十甚至上百个 package，分散在各处，通常会将这些包按照各自的功能进行划分（类似我们安卓开发中的划分子模块），  
但是如果重复造一些轮子，不如上传到一个公共平台，让更多的人一起使用、参与这个特定功能的模块。
而 npm 的作用就是让我们发布、下载一些 JS 轮子更加方便。

<!-- # npm install 原理 -->

<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624114733.png"  alt="效果图" />

## npm2

npm 2 在安装依赖包时，采用简单粗暴的递归形式进行安装，  
严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中。  
直到有子依赖包不在依赖其他模块。

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

如此这般 npm install 后，得到的 node_modules 中模块目录结构就是下面这样的：
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625112906.png"  alt="效果图" />

这样的方式优点很明显:

- node_modules 的结构和 package.json 结构一一对应
- 层级结构明显，并且保证了每次安装目录结构都是相同的
- 在已知所需包名和版本号时，甚至可以从别的文件夹手动拷贝需要的包到 node_modules 文件夹中，再手动修改 package.json 中的依赖配置
- 要删除这个包，也可以简单地手动删除这个包的子目录，并删除 package.json 文件中相应的一行即可

但是，试想一下，如果随着开发的进行依赖的模块愈来愈多，node_modules 将成为一个庞然大物，嵌套层级非常之深和地狱式回调如出一辙：
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625113257.png"  alt="效果图" />

- 在不同层级的依赖中，可能引用了同一个模块，导致大量冗余。
- 在 Windows 系统中，文件路径最大长度为 260 个字符，嵌套层级过深可能导致不可预知的问题。

## npm3

为了解决以上问题，NPM 在 3.x 版本做了一次较大更新。其将 2.x 的嵌套结构改为扁平结构：

> 安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在 node_modules 根目录。

所以我们执行`npm install`将会得到扁平的结构(例子中是将 buffer 的依赖 base64-js,ieee754 进行扁平化处理);

<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625114038.png"  alt="效果图" />

> 注意此时的 base-js64 的依赖是^1.0.2 而且实际上是 buffer 的依赖被扁平化之后提升到了 node_modules 中的

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625132259.png"  alt="效果图" />

此时我们如果在模块中又依赖了 `base64-js@1.0.1 ` 即依赖了和 buffer (子依赖)中的 base64-js 一样只是版本不同;

```json
{
  "name": "package-analysis",
  "version": "0.1.0",
  "description": "package-analysis is about....",
  "author": "liufeng <fengliu018@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "buffer": "^5.4.3",
    "ignore": "^5.1.4",
++  "base64-js": "1.0.1"
  }
}
```

当安装到相同模块时(base64-js)，会判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 node_modules 下安装该模块。
此时再执行 npm install 将会得到以下的结构

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625132722.png"  alt="效果图" />

此时我们模块 package-analysis 的依赖base64-js@1.0.1由于在 buffer 中也被依赖了 而且版本较低  
此时 base64-js@1.0.1被提到根目录而 buffer 中的base64-js@1.0.2则被安装到了 buffer 的 node_module 中了

所以如果我们在项目代码中引用了一个模块，模块查找流程如下：

1. 在当前模块路径下搜索
2. 在当前模块 node_modules 路径下搜素
3. 在上级模块的 node_modules 路径下搜索
4. ...
5. 直到搜索到全局路径中的 node_modules

假设我们又依赖了一个包 buffer2@^5.4.3，而它依赖了包 base64-js@1.0.3，则此时的安装结构是下面这样的：
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625133706.png"  alt="效果图" />

因此 npm 3.x 版本并未完全解决老版本的**模块冗余问题**，甚至还会带来新的问题。

假设没有 package-analysis 依赖 base64-js@1.0.1 版本，而你同时依赖了依赖不同 base64-js 版本的 buffer 和 buffer2。  
由于在执行 npm install 的时候，按照 package.json 里依赖的顺序依次解析，则将会由 buffer 和 buffer2 在 package.json 的**放置顺序**
决定 node_modules 的依赖结构：

1. 先依赖 buffer：
   <img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625133940.png"  alt="效果图" />
2. 先依赖 buffer2：
   <img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625134115.png"  alt="效果图" />

另外，为了让开发者在安全的前提下使用最新的依赖包，我们在 package.json 通常只会锁定大版本，这意味着在某些依赖包小版本更新后，  
同样可能造成依赖结构的改动，依赖结构的不确定性可能会给程序带来不可预知的问题。

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

为了解决 npm install 的不确定性问题(package.json 文件中的语义版本锁定，安装源也不固定)，  
导致我们在协同开发和线上构建时，不同开发者 npm i 得到的依赖版本可能有一定差异的现象。

在 npm 5.x 版本新增了 package-lock.json 文件，而安装方式还沿用了 npm 3.x 的扁平化的方式。

对于是否将 package-lock.json 文件上传到远程仓库，也有许多有趣的讨论，  
**[例如 package-lock.json 需要写进 .gitignore 吗？](https://www.zhihu.com/question/264560841)**
lock 文件上传到远程仓库时，可能遇到的一些问题和解决方法。

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

## npm7

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628200407.png"  alt="效果图" />

近期 组内的小伙伴有遇到如上的问题乍一看没有遇见过 但是提示却写的非常的明确 提取到 root 里面的 eslint 依赖是eslint@7.29.0  
而内置的eslint-config-airbnb@18.2.1却希望宿主的 eslint 版本是^5.16.0 || ^6.8.0 || ^7.2.0;
eslint-plugin-react-hooks@1.7.0希望宿主的 eslint 版本是^3.0.0-^6.0.0;
二者产生了冲突从而无法建立依赖数报错;
解决方式也写的比较明确 `npm install --force` 或者 npm `install --legacy-peer-deps `;

经过查证 我们发现

除了一些新特性和不兼容更改之外。与 npm 6 相比，我们对 npm 7 的性能方面产生了一些重要的影响，其中包括：

- 依赖包数量上减少了 54%（npm 7 67 个，npm 6 123 个）
- 代码测试覆盖率增加了 54%(npm 7 94% vs npm 6 77%)
- 因此性能得到了比较大的提升

### 修改 lock

一个需要注意的改动是新的 lockfile 格式，该格式会向后兼容 npm 6 用户

在以前的版本中，yarn.lock 文件被忽略，npm CLI 现在可以使用 yarn.lock 作为 package 元数据和依赖的来源。
如果存在 yarn.lock，则 npm 还将使它与 package 的内容保持最新。

使用 npm 7 并且在有 v1 的 lockfile 的项目中执行 npm install，则会把 lock file 文件的内容取代成 v2 的格式。
如果想避免这种行为，可以通过执行 npm install --no-save
自处 v1 和 v2 格式的区别可以埋个坑

### peer dependencies

但和上面提到过的问题息息相关的也就只有这个特性了;
npm 7 中引入的一项新功能是自动安装 peer dependencies。在 npm 的之前版本（4-6）中，peer dependencies 冲突会有版本不兼容的警告，开发人员需要自己管理和安装 peerDependencies, 有冲突仍会安装依赖并不会抛出错误。但在 npm 7 中，新的 peer dependencies 可确保在 node_modules 树中 peerDependencies 的位置处或之上找到有效匹配的 peerDependencies。如果存在无法自动解决的依赖冲突，将会阻止安装。

可以通过使--force 选项重新安装来绕过冲突，或者选择--legacy-peer-deps 选项 peer dependencies 的依赖关系（类似于 npm 版本 4-6）。

由于许多包都依赖宽松的 peer dependencies 解析，npm 7 将打印警告并解决包依赖树中存在的大多数同级冲突，因此这些冲突不能手动处理。要在所有层级强制执行严格正确的 peer dependencies 依赖关系，请使用--strict-peer-deps 选项。

### 完全支持 node_modules 内的符号链接

此前，npm 将有向有环的包依赖展开成树结构，导致冗余，也容易出现版本冲突
此版本里，npm 将会把有向有环的包尽可能展平，并使用符号链接形成原有依赖
使用了 @npmcli/arborist 包实现了符号链接和相关算法，性能更好、更可控、更少 bug
使用了 npm link 替代之前 npm install --link

### 环境变量修改

追加 npm*package_resolved、npm_package_integrity、npm_command
移除 npm_package*_、npm*config*_
PATH 环境变量将包含全部的 node_modules/.bin 目录

### npx 使用 npm exec 进行重构，并内置在新版本中

### 支持了 acceptDependencies 声明，允许手工声明覆盖一些包的依赖版本

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

https://myan.im/2018/03/24/you-dont-know-npm/index.html
http://www.ruanyifeng.com/blog/2016/01/npm-install.html
https://cloud.tencent.com/developer/article/1555982
https://segmentfault.com/a/1190000013962514
https://www.zhihu.com/question/264560841

https://hejialianghe.gitee.io/computerNetwork/tools.html#_5-5-1-%E7%BD%91%E7%BB%9C%E4%BC%98%E5%8C%96%E6%8C%87%E6%A0%87

npm-hooks
https://segmentfault.com/a/1190000004881684

[npm install xxxx --legacy-peer-deps 到底做了些什么？](https://juejin.cn/post/6971268824288985118)
https://stackoverflow.com/questions/66020820/npm-when-to-use-force-and-legacy-peer-deps
https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh
https://www.cnblogs.com/zhaohui-116/p/14285015.html
