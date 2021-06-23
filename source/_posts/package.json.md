---
title: 认识 package.json
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210610131437.png
date: 2021-06-23 11:00:54
categories:
  - npm
tags:
  - npm
  - package
  - 包管理
---

# 定义

如果使用 JavaScript、或者曾经与 JavaScript 项目、Node.js 或前端项目进行过交互，那么对 package.json 文件一定也不会陌生。
package.json 文件有一下这些功能和作用:

- 是项目的清单。
- 列出了项目依赖的包以及依赖包的版本
- 使用语义版本控制项目可以使用的包的版本
- 使构建可复制，因此更容易与其他开发人员共享
- 是工具的配置中心。
- npm 和 yarn 管理项目的依赖项以及项目的元数据文件。

## 字段解析

package.json 配置的字段有很多需要对其有一个系统的认识。

> 注意: package.json 必须是一个严格的 json 文件，而不仅仅是 js 里边的一个对象。很多属性可以通过 npm-config 生成。

### name

**name** 属性就是模块的名称
package.json 中**最重要**同时也是**必须**的属性是 `name` 和 `version` 两个属性，
否则模块就无法被安装，而这两个属性一起形成了一个 npm 模块的唯一标识符。
模块中内容变更的同时，模块版本也应该一起变化。
而命名也有其规则:

- name 必须不超过 214 个字节，包括前缀名称在内（如 xxx/module）。
- name 不能以 underscore(\_)或 dot(.)开头
- 不能含有大写字母
- name 会成为 url 的一部分，不能含有 url 非法字符

官网文档的关于命名的一些建议：

- 不要使用和 node 核心模块一样的名称
- name 中不要含有"js"和"node"。假设我们需要使用 js 写入 package.json 文件,可以使用"engines"字段进行 所以没有必要包含'js'和'node 字段'.
- name 属性会成为模块 url、命令行中的一个参数或者一个文件夹名称，任何非 url 安全的字符在 - name 中都不能使用，也不能以"\_"或"."开头
- name 可能会作为参数传递给 require()，因此描述起来应该简约。
- 创建一个模块前可以先到[npm 官网](https://www.npmjs.com/)查询 name 是否已经被占用.

名称可以选择用作用域作为前缀 e.g. `@myorg/mypackage`. (npm-scope)[http://caibaojian.com/npm/misc/scope.html]

### version

version 字段必须是可以被 (node-semver)[https://github.com/npm/node-semver] 解析的，因为它作为一个依赖捆绑在 npm 中。

### description

描述开发的包的作用，方便别人了解模块的作用，助于使用者搜索发现

### keywords

关键词 也是用于描述包的用途 方便被检索 SEO

### homepage

项目主页 url

> 这个项目主页 url 和 url 属性不同，如果你填写了 url 属性，npm 注册工具会认为你把项目发布到其他地方了，获取模块的时候不会从 npm 官方仓库获取，而是会重定向到 url 属性配置的地址。

### bugs

填写一个 bug 提交地址或者一个邮箱，方便对问题进行反馈，例如：

```json
{
  "url": "https://github.com/owner/project/issues",
  "email": "project@hostname.com"
}
```

### license

模块的开源协议，让用户知道他们有何权限来使用你的模块，以及使用该模块有哪些限制。
最简单的，例如你用 BSD-3-Clause 或 MIT 之类的协议;
[协议列表]https://spdx.org/licenses/)

### author, contributors

作者和贡献者的信息

```json
{
  "name": "Barney Rubble",
  "email": "b@rubble.com",
  "url": "http://barnyrubble.tumblr.com/"
}
```

简写形式:
`Barney Rubble b@rubble.com (http://barnyrubble.tumblr.com/)`

## 创建 package.json

1.  使用 CLI

```bash
npm init
```

这将启动一个命令行问卷，分别询问一下内容后。

- package name: (hexo-site) // 包名
- version: (0.0.0) // 版本号
- entry point: (.commitlintrc.js) // 入口
- git repository: (https://github.com/FE-ng/droplets.git) // git 仓库地址
- keywords: // 关键词
- author: // 作者
- license: (ISC) // 使用的开源策略

执行完毕之后将会根据填写的内容自动生成一个 json 文件
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210623111519.png"  alt="效果图" />

2.  使用默认的 package.json

使用 -yes 或者 -y 后缀 执行`npm init`即可;

```bash
 npm init --yes
```

此模式下将会创建:

- name: the current directory name //当前目录的名字
- version: always 1.0.0 // 默认版本 1.0.0
- description: info from the readme, or an empty string "" // 从 README 文件中提取的描述详情, 没有的话默认为空字符串
- main: always index.js // 默认 index.js 为入口
- scripts: by default creates an empty test script // 自动创建一个空的测试脚本
- keywords: empty // 关键词 用于 npm search 时的搜索 默认为空
- author: empty // 作者 默认为空
- license: ISC // 开源策略 默认 ISC
- bugs: info from the current directory, if present // bug 反馈地址
- homepage: info from the current directory, if present // 包的地址

还可以为 init 命令设置几个配置选项。

> npm set init.author.email "wombat@npmjs.com"
> npm set init.author.name "ag_dubs"
> npm set init.license "MIT"

## 自定义 package.json 的构建询问(用于脚手架的处理)

npm init 命令的原理并不复杂，调用脚本，输出一个初始化的 package.json 文件。
所以相应地，定制 npm init 命令的实现方式也很简单，在 Home 目录创建一个 .npm-init.js(`~/.npm-init.js`) 即可
例如:

```JavaScript
module.exports = {
  customField: 'Custom Field',
  otherCustomField: 'This field is really cool'
}
```

再次使用 `npm init`时 package.json 的输出文件将会包括这些内容

```JavaScript
{
  customField: 'Custom Field',
  otherCustomField: 'This field is really cool'
}
```

参考文献:

1. https://www.npmjs.cn/getting-started/using-a-package.json/
