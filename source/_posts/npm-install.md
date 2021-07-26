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

## npm 介绍

npm 是一个包管理器也可以说是最大的软件仓库，它让 JavaScript 开发者分享、复用代码更方便
在程序开发中我们常常需要依赖别人提供的框架。这些可以重复的框架代码被称作包（package）或者模块（module）  
一个包可以是一个文件夹里放着几个文件，同时有一个叫做 package.json 的文件。
一个网站里通常有几十甚至上百个 package，分散在各处，通常会将这些包按照各自的功能进行划分.
但是如果需要重复造轮子，每个开发者都会疲惫不堪.而 npm 的作用就是提供了开源的库让我们发布、下载 JS 轮子更加方便。

## npm install 原理

<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624114733.png"  alt="效果图" />

### 检查配置: .npmrc

1.  手动执行附带参数 `npm install --registry=https://registry.npm.taobao.org`
2.  项目级的 .npmrc 文件 `./.npmrc` 文件
3.  用户级的 .npmrc 文件
    路径: `npm config get userconfig`
    设置: `config set registry https://registry.npm.taobao.org`
4.  全局级的 .npmrc 文件
    路径: `npm config get prefix` `$PREFIX/etc/npmrc`
    设置: `config set registry https://registry.npm.taobao.org -g`
5.  npm 内置
    npm 内置配置文件 基本用不到

### lock 文件有无的区别

无 lock 文件:
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719135722.gif"  alt="效果图" />

有 lock 文件
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719135813.gif"  alt="效果图" />

可以明显看到使用 lock 文件并且和 package 无冲突的时候安装依赖非常的快捷
原因是因为 package-lock.json 中已经缓存了每个包的具体版本和下载链接，不需要再去远程仓库进行查询，然后直接进入文件完整性校验环节，减少了大量网络请求。

### npm install/update

如果想更新已安装模块，就要用到 npm update 命令。

```bash
npm update <packageName>
```

它会先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装。

1. 先到远程仓库查询最新版本
2. 然后对比本地版本，如果本地版本不存在，或者远程版本较新就会比较版本规则, 否则不更新
3. 查看 package.json 中对应的语义版本规则
4. 如果当前新版本符合语义规则，就更新，否则不更新

远程版本是否较新是由 npm 模块仓库提供的信息  
[查询服务网址](https://registry.npmjs.org/)

这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。  
比如，访问 https://registry.npmjs.org/react ,就会看到 react 模块所有版本的信息。

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

### 完整性

在下载依赖包之前，我们一般就能拿到 npm 对该依赖包计算的 hash 值，例如我们执行 `npm v` 命令，紧跟 `tarball`(下载链接) 的就是 `shasum(hash) `：  
`npm v react`
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719143926.png"  alt="效果图" />

用户下载依赖包到本地后，需要确定在下载过程中没有出现错误，所以在下载完成之后需要在本地在计算一次文件的 hash 值，如果两个 hash 值是相同的，则确保下载的依赖是完整的，如果不同，则进行重新下载。

### 缓存

`npm install` 或 `npm update` 命令，从 registry 下载压缩包之后，除了将依赖包安装在 node_modules 目录下外, 本地的缓存目录也会储存一份。
通过配置命令，可以查看这个目录的具体位置`npm config get cache`;
在 Linux 或 Mac 默认是在用户主目录下的`.npm/_cacache` 目录， Windows 默认是在`%AppData%/npm-cache`。

在这个目录下又存在我们主要关注是两个目录：

- **content-v2**
  用于存储 tar 包的缓存
- index-v5
  用于存储 tar 包的 hash。
    <!-- <img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624201056.png"  alt="效果图" /> -->
    <img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719140714.png"  alt="效果图" />
    npm 在执行安装时，可以根据 package-lock.json 中存储的 integrity、version、name 生成一个唯一的 key 对应到 index-v5 目录下的缓存记录，从而找到 tar 包的 hash，然后根据 hash 再去找缓存的 tar 包直接使用。

我们可以找一个包在缓存目录下搜索测试一下，在 index-v5 搜索一下包路径：

```bash
grep https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz -r index-v5
```

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719141447.png"  alt="效果图" />
可以看到我们找到了不少符合预期的数据, 我们选取一个进行 json 格式化

```json
{
  "key": "pacote:range-manifest:https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz:sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
  "integrity": "sha512-C2EkHXwXvLsbrucJTRS3xFHv7Mf/y9klmKDxPTE8yevCoH5h8Ae69Y+/lP+ahpW91crnzgO78elOk2E6APJfIQ==",
  "time": 1605774290276,
  "size": 1,
  "metadata": {
    "id": "base64-js@1.5.1",
    "manifest": {
      "name": "base64-js",
      "version": "1.5.1",
      "dependencies": {},
      "optionalDependencies": {},
      "peerDependenciesMeta": {},
      "devDependencies": {
        "babel-minify": "^0.5.1",
        "benchmark": "^2.1.4",
        "browserify": "^16.3.0",
        "standard": "*",
        "tape": "4.x"
      },
      "bundleDependencies": false,
      "peerDependencies": {},
      "deprecated": false,
      "_resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "_integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "_shasum": "1b1b440160a5bf7ad40b650f095963481903930a",
      "_shrinkwrap": null,
      "_id": "base64-js@1.5.1"
    },
    "type": "finalized-manifest"
  }
}
```

上面的 `_shasum` 属性 `1b1b440160a5bf7ad40b650f095963481903930a` 即为 tar 包的 hash， hash 的前几位 1b1b 即为缓存的前两层目录，我们进入到 content-v2 进行查看;
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719142651.png"  alt="效果图" />
果然`440160a5bf7ad40b650f095963481903930a`这个压缩后的依赖包确实存在

{% note info modern %}

npm 在执行安装时，可以根据 package-lock.json 中存储的 integrity、version、name 生成一个唯一的 key 对应到 index-v5 目录下的缓存记录，  
 从而找到 tar 包的 hash，然后根据 hash 再去找缓存的 tar 包直接使用。
而这样的缓存策略是从 npm v5 版本开始的，在 npm v5 版本之前，每个缓存的模块在 ~/.npm 文件夹中以模块名的形式直接存储，
储存结构是{cache}/{name}/{version}。

{% endnote %}

### npm 管理缓存数据的命令

- `npm cache add`: 官方解释说这个命令主要是 npm 内部使用，但是也可以用来手动给一个指定的 package 添加缓存。
- `npm cache clean`：删除缓存目录下的所有数据，为了保证缓存数据的完整性，需要加上 --force 参数。
- `npm cache verify`：验证缓存数据的有效性和完整性，清理垃圾数据。
  基于缓存数据，npm 提供了离线安装模式，分别有以下几种：
- `--prefer-offline`：优先使用缓存数据，如果没有匹配的缓存数据，则从远程仓库下载。
- `--prefer-online`：优先使用网络数据，如果网络数据请求失败，再去请求缓存数据，这种模式可以及时获取最新的模块。
- `--offline`：不请求网络，直接使用缓存数据，一旦缓存数据不存在，则安装失败。

## npm install 总结

- 检查 .npmrc 文件
- 无 lock 文件：
  - 从 npm 远程仓库获取包信息
  - 根据 package.json 构建依赖树，构建过程：
    - 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 node_modules 根目录。
    - 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 node_modules 下放置该模块。
    - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
  - 在缓存中依次查找依赖树中的每个包
    - 不存在缓存：
      - 从 npm 远程仓库下载包
      - 校验包的完整性
      - 校验不通过：
        - 重新下载
      - 校验通过：
        - 将下载的包复制到 npm 缓存目录
        - 将下载的包按照依赖结构解压到 node_modules
    - 存在缓存：将缓存按照依赖结构解压到 node_modules
  - 将包解压到 node_modules
  - 生成 lock 文件
- 有 lock 文件：
  - 检查 package.json 中的依赖版本是否和 package-lock.json 中的依赖有冲突。
  - 如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程相同

上面的过程简要描述了 `npm install` 的大概过程，这个过程还包含了一些其他的操作，例如执行定义的一些生命周期函数，我们可以执行 `npm install package --timing=true --loglevel=verbose` 来查看某个包具体的安装流程和细节

<details>
<summary><b>-----查看流程-----</b></summary>
<img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210624114733.png"  alt="效果图" />
</details>

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

## package-lock.json 的作用

为了解决 npm install 的不确定性问题(package.json 文件中的语义版本锁定，安装源也不固定)，  
导致我们在协同开发和线上构建时，不同开发者 npm i 得到的依赖版本可能有一定差异的现象。

在 npm 5.x 版本新增了 package-lock.json 文件，而安装方式还沿用了 npm 3.x 的扁平化的方式。

package-lock 是 package.json 中列出的每个依赖项的大型列表，应安装的特定版本，模块的位置（URI），  
验证模块完整性的哈希，它需要的包列表 ，以及依赖项列表。
我们看一个具体的例子
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210719112625.png"  alt="效果图" />

1. name: lock 的包名和 package.json 中的 name 保持一致。
2. lockfileVersion:
   lock 文件的版本在 npm7 中有了显著的改变
   - 没有值: 来自 NPM v5 之前版本的一个历史深远的 shrinkwrap 版本。
   - 1: npm v5 and v6 执行得到的
   - 2: npm v7 使用的 lockfile 版本，它向后兼容 v1 的 lockfiles。
   - 3: npm v7 创建而成, 不再向后兼容.不维护 v6 的版本后就会在未来使用, 该文件将会被隐藏路径成为`node_modules/.package-lock.json`
3. version: 指模块的版本 遵循 semver;
4. resolved: 模块的下载地址
5. integrity: 模块的 hash 值用于校验完整性
6. requires: 依赖

对于是否将 package-lock.json 文件上传到远程仓库，也有许多有趣的讨论，  
**[例如 package-lock.json 需要写进 .gitignore 吗？](https://www.zhihu.com/question/264560841)**
lock 文件上传到远程仓库时，可能遇到的一些问题和解决方法。

## 关于旧的 npm 版本的表现:

**查阅资料得知，自 npm 5.0 版本发布以来，npm i 的规则发生了三次变化。**

1. npm 5.0.x 版本，不管 package.json 怎么变，npm i 时都会根据 lock 文件下载
   [package-lock.json file not updated after package.json file is changed · Issue #16866 · npm/npm](https://github.com/npm/npm/issues/16866)  
    这个 issue 控诉了这个问题，明明手动改了 package.json，为啥不给我升级包！然后就导致了 5.1.0 的问题...
2. 5.1.0 版本后 npm install 会无视 lock 文件 去下载最新的 npm 然后有人提了这个  
   [issue why is package-lock being ignored? · Issue #17979 · npm/npm](https://github.com/npm/npm/issues/17979)
   控诉这个问题，最后演变成 5.4.2 版本后的规则。
3. 5.4.2 版本后 [why is package-lock being ignored? · Issue #17979 · npm/npm](https://github.com/npm/npm/issues/17979)

最终才有了 **在npm@5.4.2版本后的表现**

## 在npm@5.4.2版本后的表现：

1. 无 package-lock.json
   npm i 根据 package.json 进行安装，并生成 package-lock.json

2. package.json 和 package-lock.json 的版本不兼容
   npm i 会以 package.json 为准进行安装，并更新 package-lock.json

3. package.json 和 package-lock.json 的版本兼容
   npm i 会以 package-lock.json 为准进行安装。

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

> **基于以上几种特性，使用 npm ci 能够有效防止线上构建的依赖与开发者本地不一致的问题。**

## npm7

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628200407.png"  alt="效果图" />

近期 组内的小伙伴有遇到如上的问题乍一看不止所云 但是提示却写的非常的明确 提取到 root 里面的 eslint 依赖是eslint@7.29.0  
而内置的eslint-config-airbnb@18.2.1却希望宿主的 eslint 版本是^5.16.0 || ^6.8.0 || ^7.2.0;
eslint-plugin-react-hooks@1.7.0希望宿主的 eslint 版本是^3.0.0-^6.0.0;
二者产生了冲突从而无法建立依赖数报错;
解决方式也写的比较明确 `npm install --force` 或者 npm `install --legacy-peer-deps `;

经过查证 我们发现

除了一些新特性和不兼容更改之外。与 npm 6 相比，我们对 npm 7 的性能方面产生了一些重要的影响，其中包括：

- 依赖包数量上减少了 54%（npm 7 67 个，npm 6 123 个）
- 代码测试覆盖率增加了 54%(npm 7 94% vs npm 6 77%)
- 因此性能得到了比较大的提升

### 增加 lockfileVersion@2+ 支持 yarn.lock

> Our new package-lock format will unlock the ability to do deterministically reproducible builds and includes
> everything npm will need to fully build the package tree. Prior to npm 7 yarn.lock files were ignored, the npm cli
> can now use yarn.lock as source of package metadata and resolution guidance.

新的 package 格式会解锁 lock 文件能够进行定性且可执行重复构建的能力, 包含构建时所需要的一切;

该格式也会向后兼容 npm 6 用户

在以前的版本中，yarn.lock 文件被忽略，npm CLI 现在可以使用 yarn.lock 作为 package 元数据和依赖的来源。
如果存在 yarn.lock，则 npm 还将使它与 package 的内容保持最新。

使用 npm 7 并且在有 v1 的 lockfile 的项目中执行 npm install，则会把 lock file 文件的内容取代成 v2 的格式。
如果想避免这种行为，可以通过执行 npm install --no-save

### 自动安装 peer dependencies

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

## 如何解决 package-lock.json 的冲突

package-lock.json 文件不由开发者自行写入，在协同开发时，某一方若更新了依赖，很容易产生大量冲突，且难以逐个解决。

1. npm 文档中推荐的两种方式：

从 5.7.0 版本的 npm 开始，解决 package-lock.json 的冲突可以通过解决 package.json 的冲突后，运行 npm install [--package-lock-only] 来完成。npm 会自动解析 package-lock.json 中的冲突，并生成一个有着合理的 tree 结构，且包含了两个分支的所有依赖的 lock 文件。
文档中还提到了一个 npm-merge-driver 工具，可以帮助开发者解决 package-lock.json 的冲突。

2. 至于旧版本的 npm，可以尝试对于 package-lock.json 文件，忽略掉冲突，并重新 npm i。

最好将文件重置到非自己开发分支的状态，便于合并之后的验证。  
例如，对于将 master 合进自己开发的特性分支的情况（如 git pull origin master），对于冲突，选择 Accept All Incoming。

## pnpm

目前 GitHub 已经有近 12k 的 star ，并且已经相对成熟且稳定了。它由 npm/yarn 衍生而来，但却解决了 npm/yarn 内部潜在的 bug，并且极大了地优化了性能，扩展了使用场景

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210726145050.png"  alt="效果图" />

> Fast, disk space efficient package manager

因此，pnpm 本质上就是一个包管理器，这一点跟 npm/yarn 没有区别，但它作为杀手锏的两个优势在于:

- 包安装速度极快；
- 磁盘空间利用非常高效。

```bash
# node 版本v12.17.0+
npm i -g pnpm
```

### 安装速度快

pnpm 安装包的速度究竟有多快？先以 React 包为例来对比一下:

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210726145206.png"  alt="效果图" />

可以看到，作为黄色部分的 pnpm，在绝多大数场景下，包安装的速度都是明显优于 npm/yarn，速度会比 npm/yarn 快 2-3 倍。
对 yarn 比较熟悉的同学可能会说，yarn 不是有 [PnP 安装模式](https://classic.yarnpkg.com/en/docs/pnp/)吗？

> 直接去掉 node_modules，将依赖包内容写在磁盘，节省了 node 文件 I/O 的开销，这样也能提升安装速度。（具体原理见这篇文章(https://loveky.github.io/2019/02/11/yarn-pnp/)）

接下来，我们以这样一个[仓库](https://github.com/pnpm/benchmarks-of-javascript-package-managers)为例，我们来看一看 benchmark 数据，主要对比一下 pnpm 和 yarn PnP:

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210726145507.png"  alt="效果图" />

从中可以看到，总体而言，pnpm 的包安装速度还是明显优于 yarn PnP 的。

### 磁盘使用高效

pnpm 内部使用基于内容寻址的文件系统来存储磁盘上所有的文件，这个文件系统出色的地方在于:

> 不会重复安装同一个包。用 npm/yarn 的时候，如果 100 个项目都依赖 lodash，那么 lodash 很可能就被安装了 100 次，磁盘中就有 100 个地方写入了这部分代
> 码。但在使用 pnpm 只会安装一次，磁盘中只有一个地方写入，后面再次使用都会直接使用 [hardlink](https://droplets.vercel.app/56693d8f9f77/#“软链接”和“硬链接”);

即使一个包的不同版本，pnpm 也会极大程度地复用之前版本的代码。举个例子，比如 lodash 有 100 个文件，更新版本之后多了一个文件，那么磁盘当中并不会重新写入 101 个文件，而是保留原来的 100 个文件的 hardlink，仅仅写入那一个新增的文件。

### 依赖管理

从之前对 npm 发展和遇到的问题 (buffer,buffer2 依赖) 我们可以知道
一些共同依赖的不同版本在 package.json 中的位置会影响最终的构建结果，
这是为什么会产生依赖结构的不确定的问题所在，也是 lock 文件诞生的原因;
但无论是 package-lock.json(npm 5.x 才出现)还是 yarn.lock，都是为了保证 install 之后都产生确定的 node_modules 结构。
尽管如此，npm/yarn 本身还是存在扁平化算法复杂和 package 非法访问的问题，影响性能和安全。

pnpm 的作者`Zoltan Kochan`发现 yarn 并没有打算去解决上述的这些问题，于是另起炉灶，写了全新的包管理器，开创了一套新的依赖管理机制.

真正的文件都在.pnpm 中
目录结构都是<package-name>@version/node_modules/<package-name>。
.pnpm 目录下虽然呈现的是扁平的目录结构，但仔细想想，顺着软链接慢慢展开，其实就是嵌套的结构！

> 将包本身和依赖放在同一个 node_module 下面，与原生 Node 完全兼容，又能将 package 与相关的依赖很好地组织到一起，设计十分精妙。

现在来看根目录下的 node_modules 下面不再是眼花缭乱的依赖，而是跟 package.json 声明的依赖基本保持一致。即使 pnpm 内部有一些包会设置依赖提升，被提升到根目录 node_modules 当中，但整体上，根目录的 node_modules 比以前还是清晰和规范了许多。

### 安全

pnpm 这种依赖管理的方式也很巧妙地规避了非法访问依赖的问题，也就是只要一个包未在 package.json 中声明依赖，那么在项目中是无法访问的

但在 npm/yarn 当中是做不到的，那你可能会问了，如果 A 依赖 B， B 依赖 C，那么 A 就算没有声明 C 的依赖，由于有依赖提升的存在，C 被装到了 A 的 node_modules 里面，那我在 A 里面用 C，跑起来没有问题呀，我上线了之后，也能正常运行啊。不是挺安全的吗？

还真不是。

第一，你要知道 B 的版本是可能随时变化的，假如之前依赖的是C@1.0.1，现在发了新版，新版本的 B 依赖 C@2.0.1，那么在项目 A 当中 npm/yarn install 之后，装上的是 2.0.1 版本的 C，而 A 当中用的还是 C 当中旧版的 API，可能就直接报错了。

第二，如果 B 更新之后，可能不需要 C 了，那么安装依赖的时候，C 都不会装到 node_modules 里面，A 当中引用 C 的代码直接报错。

还有一种情况，在 monorepo 项目中，如果 A 依赖 X，B 依赖 X，还有一个 C，它不依赖 X，但它代码里面用到了 X。由于依赖提升的存在，npm/yarn 会把 X 放到根目录的 node_modules 中，这样 C 在本地是能够跑起来的，因为根据 node 的包加载机制，它能够加载到 monorepo 项目根目录下的 node_modules 中的 X。但试想一下，一旦 C 单独发包出去，用户单独安装 C，那么就找不到 X 了，执行到引用 X 的代码时就直接报错了。

这些，都是依赖提升潜在的 bug。如果是自己的业务代码还好，试想一下如果是给很多开发者用的工具包，那危害就非常严重了。

npm 也有想过去解决这个问题，指定--global-style 参数即可禁止变量提升，但这样做相当于回到了当年嵌套依赖的时代，一夜回到解放前，前面提到的嵌套依赖的缺点仍然暴露无遗。

npm/yarn 本身去解决依赖提升的问题貌似很难完成，不过社区针对这个问题也已经有特定的解决方案: dependency-check，地址: https://github.com/dependency-check-team/dependency-check

但不可否认的是，pnpm 做的更加彻底，独创的一套依赖管理方式不仅解决了依赖提升的安全问题，还大大优化了时间和空间上的性能。

## 参考文献

链接：[一些 package-lock.json 的小知识](https://juejin.cn/post/6844904116108410887)
链接：https://www.zhihu.com/question/62331583/answer/275248129

https://myan.im/2018/03/24/you-dont-know-npm/index.html
http://www.ruanyifeng.com/blog/2016/01/npm-install.html
https://cloud.tencent.com/developer/article/1555982
https://segmentfault.com/a/1190000013962514
https://www.zhihu.com/question/264560841

[npm-hooks](https://segmentfault.com/a/1190000004881684)

[npm install xxxx --legacy-peer-deps 到底做了些什么？ v7](https://juejin.cn/post/6971268824288985118)
https://stackoverflow.com/questions/66020820/npm-when-to-use-force-and-legacy-peer-deps
https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh
https://www.cnblogs.com/zhaohui-116/p/14285015.html
https://segmentfault.com/q/1010000011571000
https://zhuanlan.zhihu.com/p/237532427
https://github.com/rogeriochaves/npm-force-resolutions/issues

https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/
[npm docs](https://docs.npmjs.com/)
https://jishuin.proginn.com/p/763bfbd3bcff
