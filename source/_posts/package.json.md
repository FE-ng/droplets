---
title: 认识 package.json
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210623160551.png
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

### files

"files"属性的值是一个格式是文件正则的数组，内容是模块下文件名或者文件夹名，  
如果是文件夹名，则文件夹下所有的文件也会被包含进来（除非文件被另一些配置排除了）;  
npm 包作为依赖安装时要包括的文件，，["*"] 代表所有文件。
也可以使用 npmignore 来忽略个别文件。 files 字段优先级最大，不会被 npmignore 和.gitignore 覆盖。

### main

main 属性指定了程序的主入口文件。  
意思是，如果你的模块被命名为 foo，用户安装了这个模块并通过 require("foo")来使用这个模块，  
那么 require 返回的内容就是 main 属性指定的文件中 module.exports 指向的对象。  
它应该指向模块根目录下的一个文件。对大对数模块而言，这个属性更多的是让模块有一个主入口文件，然而很多模块并不写这个属性。
默认值是模块根目录下面的 `index.js` 文件。

### bin

很多模块有一个或多个需要配置到 PATH 路径下的可执行模块，  
npm 让这个工作变得十分简单（实际上 npm 本身也是通过 bin 属性安装为一个可执行命令的）  
如果要用 npm 的这个功能，在 package.json 里边配置一个 bin 属性。
bin 属性是一个已命令名称为 key，本地文件名称为 value 的 map 如下：

```json
{ "bin": { "myapp": "./cli.js" } }
```

模块安装的时候，若是全局安装，则 npm 会为 bin 中配置的文件在 bin 目录(/usr/local/node_modules/.bin/)下创建一个软连接  
（对于 windows 系统，默认会在 C:\Users\username\AppData\Roaming\npm 目录下），  
如果是全局安装，npm 将会使用符号链接把这些文件链接到
如果是本地安装，会链接到./node_modules/.bin/。
若是局部安装，则会在项目内的./node_modules/.bin/目录下创建一个软链接。  
因此，按上面的例子，当你安装 myapp 的时候，npm 就会为 cli.js 在/usr/local/bin/myapp 路径创建一个软链接。  
如果你的模块只有一个可执行文件，并且它的命令名称和模块名称一样，你可以只写一个字符串来代替上面那种配置，例如：

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}
```

作用和如下写法相同:

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": { "my-program": "./path/to/program" }
}
```

### repository

指定一个代码存放地址 便于用户进行查看和贡献

```javascript
"repository" :
  {
    "type" : "git",
    "url" : "http://github.com/npm/npm.git"
  }
```

或者 `github:user/repo`

### scripts

scripts 属性是一个对象，里边指定了项目的生命周期个各个环节需要执行的命令。  
key 是生命周期中的事件，value 是要执行的命令。  
具体的内容有 install start stop 等

### config

用来设置一些项目不怎么变化的项目配置，例如 port 等。
用户用的时候可以使用如下用法：

```javascript
http.createServer(...).listen(process.env.npm_package_config_port)
```

可以通过 npm config set foo:port 80 来修改 config。

```json
{ "name": "foo", "config": { "port": "8080" } }
```

### dependencies

dependencies 属性是一个对象，配置模块依赖的模块列表，key 是模块名称，value 是版本范围，  
版本范围是一个字符，可以被一个或多个空格分割。  
dependencies 也可以被指定为一个 git 地址或者一个压缩包地址。
`dependencies` 字段指定了项目运行所依赖的模块（生产环境使用），如 antd、 react、 moment 等插件库：

它们是我们生产环境所需要的依赖项，在把项目作为一个 npm 包的时候，用户安装 npm 包时只会安装 dependencies 里面的依赖。

版本的定义需要遵循[semver](http://caibaojian.com/npm/misc/semver.html)

### devDependencies

如果有人想要下载并使用你的模块，也许他们并不希望或需要下载一些你在开发过程中使用的额外的测试或者文档框架。  
在这种情况下，最好的方法是把这些依赖添加到 devDependencies 属性的对象中。  
这些模块会在 npm link 或者 npm install 的时候被安装，也可以像其他 npm 配置一样被管理。  
`devDependencies` 字段指定了项目开发所需要的模块（开发环境使用），如 webpack、typescript、babel 等：  
在代码打包提交线上时，我们并不需要这些工具，所以我们将它放入 devDependencies 中  
对于一些跨平台的构建任务，例如把 CoffeeScript 编译成 JavaScript，  
就可以通过在 package.json 的 script 属性里边配置 prepublish 脚本来完成这个任务，  
然后需要依赖的 coffee-script 模块就写在 devDependencies 属性中。  
例如:

```json
{
  "name": "ethopia-waza",
  "description": "a delightfully fruity coffee varietal",
  "version": "1.2.3",
  "devDependencies": {
    "coffee-script": "~1.6.3"
  },
  "scripts": {
    "prepublish": "coffee -o lib/ -c src/waza.coffee"
  },
  "main": "lib/waza.js"
}
```

prepublish 脚本会在发布之前运行，因此用户在使用之前就不用再自己去完成编译的过程了。在开发模式下，运行 npm install 也会执行这个脚本（见 npm script 文档），因此可以很方便的调试。

### peerDependencies

有时候做一些插件开发，比如 grunt 等工具的插件，它们往往是在 grunt 的某个版本的基础上开发的，  
而在他们的代码中并不会出现 require("grunt")这样的依赖，dependencies 配置里边也不会写上 grunt 的依赖， dependencies 为了说明此模块只能作为插件跑在宿主的某个版本范围下，可以配置 peerDependencies：

```json
{
  "name": "tea-latte",
  "version": "1.3.5",
  "peerDependencies": {
    "tea": "2.x"
  }
}
```

上面这个配置确保再 npm install 的时候 tea-latte 会和 2.x 版本的 tea 一起安装，  
而且它们两个的依赖关系是同级的：

```
├── tea-latte@1.3.5
└── tea@2.2.0
```

这个配置的目的是让 npm 知道，如果要使用此插件模块，请确保安装了兼容版本的宿主模块。

### bundleDependencies

指定发布的时候会被一起打包的模块。

### optionalDependencies

如果一个依赖模块可以被使用， 同时你也希望在该模块找不到或无法获取时 npm 继续运行，  
你可以把这个模块依赖放到 optionalDependencies 配置中。这个配置的写法和 dependencies 的写法一样，  
不同的是这里边写的模块安装失败不会导致 npm install 失败。  
当然，这种模块就需要你自己在代码中处理模块确实的情况了，例如：

```javascript
try {
  var foo = require('foo');
  var fooVersion = require('foo/package.json').version;
} catch (er) {
  foo = null;
}
if (notGoodFooVersion(fooVersion)) {
  foo = null;
}

// .. then later in your program ..

if (foo) {
  foo.doFooThings();
}
```

{% note info modern %}
optionalDependencies 中的配置会覆盖 dependencies 中的配置，最好只在一个地方写。
{% endnote %}

### engines

你可以指定项目运行的 node 版本范围，如下：

```json
{ "engines": { "node": ">=0.10.3 <0.12" } }
```

和 dependencies 一样，如果你不指定版本范围或者指定为\*，任何版本的 node 都可以。
也可以指定一些 npm 版本可以正确的安装你的模块，例如：

```json
{ "engines": { "npm": "~1.0.20" } }
```

### private

如果这个属性被设置为 true，npm 将拒绝发布它，这是为了防止一个私有模块被无意间发布出去。  
如果你只想让模块被发布到一个特定的 npm 仓库，如一个内部的仓库，可在下面的 publishConfig 中配置仓库参数。

### publishConfig

这个配置是会在模块发布时用到的一些值的集合。如果你不想模块被默认被标记为最新的，或者默认发布到公共仓库，可以在这里配置 tag 或仓库地址。

### man

制定一个或通过数组制定一些文件来让 linux 下的 man 命令查找文档地址。  
如果只有一个文件被指定的话，安装后直接使用 man+模块名称，而不管 man 指定的文件的实际名称。例如:

```json
{
  "name": "foo",
  "version": "1.2.3",
  "description": "A packaged foo fooer for fooing foos",
  "main": "foo.js",
  "man": "./man/doc.1"
}
```

通过 man foo 命令会得到 ./man/doc.1 文件的内容。  
如果 man 文件名称不是以模块名称开头的，安装的时候会给加上模块名称前缀。因此，下面这段配置：

```json
{
  "name": "foo",
  "version": "1.2.3",
  "description": "A packaged foo fooer for fooing foos",
  "main": "foo.js",
  "man": ["./man/foo.1", "./man/bar.1"]
}
```

会创建一些文件来作为 man foo 和 man foo-bar 命令的结果。  
man 文件必须以数字结尾，或者如果被压缩了，以.gz 结尾。数字表示文件将被安装到 man 的哪个部分。

```json
{
  "name": "foo",
  "version": "1.2.3",
  "description": "A packaged foo fooer for fooing foos",
  "main": "foo.js",
  "man": ["./man/foo.1", "./man/foo.2"]
}
```

会创建 man foo 和 man 2 foo 两条命令。

### directories

CommonJs 通过 directories 来制定一些方法来描述模块的结构，  
npm 的[package.json 文件](https://registry.npmjs.org/npm/latest)中有这个字段的内容。

### directories.lib

告诉用户模块中 lib 目录在哪，这个配置目前没有任何作用，但是对使用模块的人来说是一个很有用的信息。

### directories.bin

如果你在这里指定了 bin 目录，这个配置下面的文件会被加入到 bin 路径下，如果你已经在 package.json 中配置了 bin 目录，那么这里的配置将不起任何作用。

### directories.man

指定一个目录，目录里边都是 man 文件，这是一种配置 man 文件的语法糖。

### directories.doc

在这个目录里边放一些 markdown 文件，可能最终有一天它们会被友好的展现出来（应该是在 npm 的网站上）

### directories.example

放一些示例脚本，或许某一天会有用 - -！
目前这个配置没有任何作用.

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
2. http://caibaojian.com/npm/files/package.json.html
3. https://zoucz.com/blog/2016/02/17/npm-package/
4. https://juejin.cn/post/6844904159226003463

Semver:
https://juejin.cn/post/6844903516754935816
