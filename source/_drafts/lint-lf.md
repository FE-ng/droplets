<!--
 * @Author: your name
 * @Date: 2021-07-28 18:02:06
 * @LastEditTime: 2021-07-29 11:09:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/lint-lf.md
-->

### 原理

node 命令行工具其实原理就是利用 node 执行一段 js 代码，进行相关的文件或者其他操作

### 两种运行方式

一般来说，用 node 运行 js 文件可以有两种方式

1. 直接指定用 node 运行`node ./bin/tool.js xxx`
2. 全局安装后，用`tool xxx`运行

说说第二种方式怎么实现：

首先文件目录如下：

```
tool
├── bin
│    └── tool.js
├── package.json
```

根据网上的教程，js 文件里第一行需要写上`#! /usr/bin/env node`

这句话的意思就是指定用 node 来解释脚本。因为第二种方式并没有在命令行中指定用 node，所以需要在代码中指定

然后，在 package.json 中添加 bin 字段

```
"bin": {
    // 命令名称：命令对应需要运行的脚本位置
    "tool": "bin/tool.js"
}
```

在根目录运行`sudo npm install . -g`，安装完成后就能使用第二种方式运行了。

### 需求实现

#### 第一个目标

在命令行中，输入名称参数，然后根据模板文件生成目标文件

开始文件目录可能是这样，pageA 为模板:

```
├── PageA.vue
└── pageA
    ├── AccountDialog.vue
    ├── DataTable.vue
    └── Toolbar.vue
```

然后在命令行输入

```
node ./tool/bin/tool.js supplier
```

然后生成文件，生成后目录如下

```
├── PageA.vue
└── pageA
    ├── AccountDialog.vue
    ├── DataTable.vue
    └── Toolbar.vue
├── Supplier.vue
└── supplier
    ├── AccountDialog.vue
    ├── DataTable.vue
    └── Toolbar.vue
```

这个原理就是用`process.argv`获取输入的参数，再拷贝文件，替换名称.常用的 fs 模块用到的 api 有：

1. fs.readFileSync (同步读取文件)
2. fs.readFile (异步读取文件)
3. fs.writeFile (异步写文件)
4. fs.mkdirSync (同步生成文件夹)

在 readFile 的时候，最好指定输出格式为'utf-8'.

#### 第二个目标

仅仅复制替换名称还不够，现在需要能够往文件里增添代码，比如在 store 中，引入新创建的文件，然后在 modules 字段里注册

```
...
import pageA from './modules/pageA'
// 自动引入supplier
import supplier from './modules/supplier'

Vue.use(Vuex)

const store = new Vuex.Store({
  ...
  modules: {
    pageA,
    // 自动注册
    supplier
  }
})

export default store
```

- 在需要添加的文件中加入占位符,用正则进行匹配,简单实用,缺点就是需要对代码进行改动;
- 分析代码的语法，将代码解析成 ast 抽象语法树，遍历 ast,在合适位置插入构造好的语句，最后把新的 ast 还原成代码，最后写入目标位置

用到的工具有：

1. esprima 解析工具
2. estraverse 遍历工具
3. escodegen 还原工具

#### 把代码解析成 ast

```
let ast = esprima.parseModule(code)
```

有一个[在线网址](http://esprima.org/demo/parse.html)可以看看解析出来是个什么东西

可以发现解析出来的是一个巨大的对象，层层嵌套

#### 构造语句

我们需要插入两条语句，一条是 import ...，另一条是在 modules 中的一个 property，通过观察可以仿造出语句的结构

```ts
const moduleName = 'supplier';
const row = `./modules/${moduleName}`;
// import语句
const importObj = {
  type: 'ImportDeclaration',
  specifiers: [
    {
      type: 'ImportDefaultSpecifier',
      local: {
        type: 'Identifier',
        name: `${moduleName}`,
      },
    },
  ],
  source: {
    type: 'Literal',
    value: `./modules/${moduleName}`,
    raw: `${row}`,
  },
};
// property语句
const PropertyObj = {
  type: 'Property',
  key: {
    type: 'Identifier',
    name: `${moduleName}`,
  },
  computed: false,
  value: {
    type: 'Identifier',
    name: `${moduleName}`,
  },
  kind: 'init',
  method: false,
  shorthand: true,
};
```

好了，接下来就是遍历了，找到合适的位置把语句对象 push 进去就行了。这个就不细说了

#### 遍历

可以利用工具，也可以自己遍历

```js
estraverse.traverse(ast, {
  enter: (node) => {
    if (node.type === 'ImportDeclaration') {
      console.log(node);
    }
  },
});
```

#### 还原

```js
const result = escodegen.generate(ast);
```

#### 最后写入

```js
fs.writeFile(path, result, (error) => {
  console.log(error);
});
```

可以发现原理很简单，真正的难点其实还是解析 ast 和还原的过程，可是这些步骤都有人帮我们写出了现成的工具。给大佬递茶。。。

缺点：

用 ast 重新生成的代码，格式不是很对，少换行

### 后续

感觉简单的复制替换还是有点死板，应该让页面是可配置的.
