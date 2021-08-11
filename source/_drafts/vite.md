<!--
 * @Author: your name
 * @Date: 2021-08-11 17:43:34
 * @LastEditTime: 2021-08-11 17:58:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/vite.md
-->

## 引言

基于 webpack 构建的大型项目开发速度已经非常慢了，前端开发者已经逐渐习惯忍受超过 100 秒的启动时间，超过 30 秒的 reload 时间。即便被寄予厚望的 webpack5 内置了缓存机制也不会得到质的提升。但放到十年前，等待时间是几百毫秒。

好在浏览器支持了 ESM import 模块化加载方案，终于原生支持了文件模块化，这使得本地构建不再需要处理模块化关系并聚合文件，这甚至可以将构建时间从 30 秒降低到 300 毫秒。

当然基于 ESM import 的构建框架不止 snowpack 一个，还有比如基于 vue 的 vite，因为浏览器支持模块化是一个标准，而不与任何框架绑定，未来任何构建工具都会基于此特性开发，这意味着在未来的五年，前端构建一定会回到十年前的速度，这个趋势是明显、确定的。

ESM import 带来的最直观的改变有下面三点：

1.  `node_modules`  完全不需要参与到构建过程，仅这一点就足以让构建效率提升至少 10 倍。
2.  模块化交给浏览器管理，修改任何组件都只需做单文件编译，时间复杂度永远是 O(1)，reload 时间与项目大小无关。
3.  浏览器完全模块化加载文件，不存在资源重复加载问题，这种原生的 TreeShaking 还可以做到访问文件时再编译，做到单文件级别的按需构建。

所以可以说 ESM import 模式下的开发效率，能做到与十年前修改 HTML 单文件的零构建效率几乎相当。

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174402.png"  alt="效果图" />

## vite 入门

####  vite 是什么

vite —— 一个由 vue 作者尤雨溪开发的 web 开发工具，它具有以下特点：

1.  快速的冷启动
2.  即时的模块热更新
3.  真正的按需编译

**为什么使用 vite**

当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。大型项目包含数千个模块的情况并不少见。我们开始遇到性能瓶颈 —— 使用 JavaScript 开发的工具通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。而 vite 就可以解决这种问题。

#### 快速上手

Vite 需要  [Node.js](https://nodejs.org/en/)  版本 >= 12.0.0。

[react-vite](https://github.com/maguofu/react-vite)

```
npm init @vitejs/app react-vite --template react-ts
cd react-vite
npm install
npm run dev

template可选类型
    vanilla
    vue
    vue-ts
    react
    react-ts
    preact
    preact-ts
    lit-element
    lit-element-ts
    svelte
    svelte-ts
```

开箱即用

ts、tsx、jsx、CSS Modules

CSS 预处理器支持，只需要 npm install less

配置

根目录下的 vite.config.ts 文件

可根据开发、生产环境做特异性配置，比如开发环境下请求代理

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174506.png"  alt="效果图" />

#### [生产版本构建](https://cn.vitejs.dev/guide/build.html)

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174517.png"  alt="效果图" />
自定义配置

构建过程可以通过多种  [构建配置选项](https://cn.vitejs.dev/config/#build-options)  来自定义。特别地，你可以通过  `build.rollupOptions`  直接调整底层的  [Rollup 选项](https://rollupjs.org/guide/en/#big-list-of-options)

代码组织形式分析

浏览器会自动加载导入，vite 会启动一个本地服务器处理不同这些加载请求，对于相对地址的导入，要根据后缀名处理文件内容并返回，对于裸模块导入要修改它的路径为相对地址并再次请求处理。再根据模块 package.json 中的入口文件选项获取要加载的文件。

####     实践

####    New-OMS 接入 vite  分支：vite-test

npm install vite --save-dev

根目录下新建配置文件 vite.config.js

根目录下新建 index.html 作为入口文件，<script type="module" src="./src/index.tsx"></script>

#####     遇到的问题

1、import 引入路径问题，配置别名

2、Inline JavaScript is not enabled. Is it set in your options?

```json
// 不支持使用内联样式
// 降低 less 版本 2.x 或者配置 css 支持内联样式
css: {
    preprocessorOptions: {
        less: {
            // 支持内联 JavaScript
            javascriptEnabled: true,
         }
     }
},

```

3、"'enableES5' is not exported from 'immer'"

immer 版本改为 6.x

4、Uncaught SyntaxError: The requested module '/src/i18n.js' does not provide an export named 'DEFAULT_LOCALE'

不支持 exports.xxx = xxx;写法，改成 export const xxx = xxx;

5、国际化问题（大问题）

react-intl 2.9.0 版本 非 esm 包，高版本没有 locale-data 文件夹，涉及升级问题。

## snowpack 入门

#### 什么是 snowpack     

Snowpack 是用于 Web 应用程序开发的现代轻量级工具链。下一代 web 构建工具。
  对业务代码的模块，基本只需要把 ESM 发布（拷贝）到发布目录，再将模块导入路径从源码路径换为发布路径即可。
  而对 node_modules 则通过遍历 package.json 中的依赖，按该依赖列表为粒度将 node_modules 中的依赖打包。以 node_modules 中每个包的入口作为打包 entry，使用 rollup 生成对应的 ESM 模块文件，放到 web_modules 目录中，最后替换源码的 import 路径，使得可以通过原生 JavaScript Module 来加载 node_modules 中的包。

####   为什么使用 snowpack

- 开发模式启动仅需 50ms 甚至更少。
- 热更新速度非常快。
- 构建时可以结合任何 bundler，比如  [webpack](https://www.npmjs.com/package/@snowpack/plugin-webpack)。
- 内置支持 TS、JSX、CSS Modules 等。
- 支持自定义构建脚本以及三方插件。

#### 快速上手

snowpack 提供了类似 cra 的 cli 工具来快速创建 snowpack 应用， Create Snowpack App (CSA)，我们可以通过 csa 快速创建应用

[Create Snowpack App](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app/cli)

```

npx create-snowpack-app react-snowpack --template @snowpack/app-template-minimal
cd react-snowpack
npm run start

```

当然我们也可以在已有的项目中添加 snowpack.config.js 配置文件来使用 snowpack，这方面与 webpack 等构建工具基本一致。

snowpack2.x 版本配置  [具体配置信息](https://www.snowpack.dev/reference/configuration)

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174932.png"  alt="效果图" />

snowpack 的打包策略与 webpack 不同，使用非捆绑式开发，下面这张图展示了 webpack 和 snowpack 在 build 上的区别，可以看到 webpack 会使用 bundle 将不同模块最终整合起来，这就意味着，每个模块的变动最终都需要重新记性整合，而 snowpack 的每个文件都是单独构建的，并且无限缓存。你的开发环境不会建立一个文件超过一次，你的浏览器也不会下载一个文件两次(直到它改变)。当更新的时候，只需要重新构建改变的那个文件，并将其发送到浏览器即可。

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174946.png"  alt="效果图" />
**Tips: 在使用 css Module 时报错，原因是 React Developer Tools 插件导致，移除就不报错。**

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811174958.png"  alt="效果图" />

**SnowPack Build**

**\_snowpack 下放了环境变量相关的文件，\_snowpack/pkg**则是我们的 npm 依赖映射的 js 文件，同时会有一个 import-map.json 来描述 npm 包与 js 的映射关系。dist 目录下**则是我们的业务代码最终打包出来的文件(每一个导出，对应着一个文件）。
**

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811175011.png"  alt="效果图" />
**

### 适合使用 snowpack 吗?

答案是还不适合用在生产环境。

当然用在开发环境还是可以的，但需要承担三个风险：

1.  开发与生产环境构建结果不一致的风险。
2.  项目生态存在非  [ESM import](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)  模块化包而导致大量适配成本的风险。
3.  项目存在大量 webpack 插件的 magic 魔法，导致标准化后丢失定制打包逻辑的风险。

但可以看到，这些风险的原因都是非标准化造成的。我们站在 2020 年看以前浏览器非标准化 API 适配与兼容工作，可能会觉得不可思议，为什么要与那些陈旧非标准化的语法做斗争；相应的，2030 年看 2020 年的今天可能也觉得不可思议，为什么很多项目存在大量 magic 自定义构建逻辑，明明标准化构建逻辑已经完全够用了 :P。

所以我们要看到未来的趋势，也要理解当下存在的问题，不要在生态尚未成熟的时候贸然使用，但也要跟进前端规范化的步伐，在合适的时机跟上节奏，毕竟 bundleless 模式带来的开发效率提升是非常明显的。

## 对比

|                   | Vite@2.0.3                                                                               | Snowpack@3.0.13                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 支持 Typescript   | 支持：ESbuild （默认无类型检查）                                                         | [支持](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app/app-template-vue-typescript)                                                                         |
| 支持 CSS 预处理器 |  [支持](https://vitejs.dev/guide/features.html#css-pre-processors)                       | 部分支持：官方仅提供了 Sass 和 Postcss，且存在未解决 BUG                                                                                                                         |
| 支持 CSS Modules  | [支持](https://vitejs.dev/guide/features.html#css-modules)                               | 支持                                                                                                                                                                             |
| 支持静态文件      | 支持                                                                                     | 支持                                                                                                                                                                             |
| 开发环境          | no-bundle native ESM（CJS → ESM）no-bundle native ESM（CJS → ESM）                       |
| HMR               | 支持                                                                                     | 支持                                                                                                                                                                             |
| 生产环境          | Rollup                                                                                   | Webpack, Rollup, or even ESbuild                                                                                                                                                 |
| Node API 调用能力 | 支持                                                                                     | 支持                                                                                                                                                                             |
| 低版本浏览器兼容  | [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) | [@snowpack/plugin-webpack](https://www.npmjs.com/package/@snowpack/plugin-webpack)[snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) |

## 总结

vite 是针对 vue3 开发的开发构建工具，从特性的构建流程来看看，vite 和 snowpack 十分接近，从现阶段来说，snowpack 更加成熟，对框架的支持更好，而 vite 肯定对 vue3 生态的支持契合度更好，但是当前建设不够成熟，毕竟还没有发布正式版本。比较大的区别是在需要 bundle 打包的时候 Vite 使用 Rollup 内置配置，而 Snowpack 通过其他插件将其委托给 Parcel/webpack。

目前 vite 在 dev 的时候 HMR 使用 ESM 的方案，当 build 的时候回使用 rollup 进行 bundle 的打包。这个时候就和我们现阶段使用的 webpack 和 rollup 没有区别了，可以看出 vite 的目标非常明确，就是解决开发阶段的构建打包问题，当然这也会带来一个问题就是 dev 环境和 product 环境的打包产物几乎完全不一样，造成开发与生产环境构建结果不一致的风险。
