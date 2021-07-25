<!--
 * @Author: your name
 * @Date: 2021-07-23 17:41:18
 * @LastEditTime: 2021-07-23 17:45:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/react-router.md
-->

# 前言

本文 React-router 版本为 5.2.0，与 4 版本会有一些出入，不过大概思路是一样的

本文出发点为 平时我们都是从上向下的在使用工具，往往忽略了从下向上了解工具内部都做了什么，其中有什么精妙的涉及；以及通过从下向上的了解，从而挖掘工具除了日常使用方式，还能为我们带来什么；此外，也和大家分享一下我在读 React-router 源码的一些思路是什么样的（抛砖引玉，欢迎大家一起交流）

本文主要落脚点为 讲解 cosmos 内实现多 tab 方案（完善中）的前置内容，所以重在讲解 React-Router 的实现思想以及 Route 在不同参数配置下的实现差异，重点部分是 002: Route

本文：

- 只涉及核心、常用 api 的主要实现原理

本文不涉及到：

- MemoryRouter StaticRouter 相关内容
- hash 路由 和 history 路由 的原理和区别
- history 里面具体做了什么
- react-router-dom 相关 api：BrowserRouter HashRouter Link NavLink
- api 具体如何使用的内容：具体可以查看官方 docs

# 000: 从使用看核心组件的作用

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174250.png"  alt="效果图" />

从上面的基本使用，我们可以看出：

**history**：控制页面跳转（不作为 React-router 的内容介绍）（还提供路由所需要的 history、location 等信息）

**Router**：向下传递 history 对象，监听路由变化，并触发重新渲染

**Route**：用来通过匹配路由，判断组件渲染

在子组件中使用 withRouter 包裹：

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174300.png"  alt="效果图" />

```
我们就可以在子组件的props获取下面的属性了：
```

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174311.png"  alt="效果图" />

**withRouter**的功能主要是让子组件获取到路由相关的信息

其中：

**history**：是通过 history 包的 createBrowserHistory 生成的，这里不做过多讲解，想知道具体包含什么字段的同学可以查看下 history 对应的 index.d.ts 文件

**location**：默认为 history.location

**match**：是 React-router 内部处理生成的一个参数，包含 path、url、isExact、params 四个部分

**staticContext**：暂时不做介绍

下面我们逐步看一下这些核心组件是怎么实现的

# 001: Router

作用：创建路由相关的数据

首先为了让 history 等信息传递下去，使用 react 的 context 功能，创建 RouterContext

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174318.png"  alt="效果图" />

```


```

然后将上面 4 个属性作为 RouterContext 的 value

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174330.png"  alt="效果图" />

```
其中this.state.location是对this.props.history进行listen，并把监听到的location进行赋值
```

computeRootMatch 在这里是给 match 赋了一个默认值， 目的是防止 Route 计算 match 时没有 path 参数

```
const computeRootMatch = (pathname) => ({ path: "/", url: "/", params: {}, isExact: pathname === "/" })
```

# 002: Route

作用：根据路径匹配判断渲染内容

首先，需要接收 Router 传下来的 context 信息，并对 context 信息做一些处理

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174346.png"  alt="效果图" />

```
然后，再看看matchPath具体做了什么：
```

主要就是 通过 Route 的 path exact strict sensitive 参数 来生成符合 React-router 规范的 match 信息

1.  根据 exact strict sensitive 解析 path 为正则 regexp，并获取动态参数 keys
2.  根据正则获取正则匹配的 match 信息

3.  不匹配 返回 null
4.  匹配 返回 Route 规范的 match 信息

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174401.png"  alt="效果图" />

match 信息处理完了，得到了新的 props，我们回到主流程上，CoreRoute 做了什么呢？

首先，肯定是通过 context，再往下传递新 props 里的信息

然后，通过 Route 的参数来判断具体操作-如何渲染

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174413.png"  alt="效果图" />

1.  有 match 信息，表示路由匹配 进入下一步判断

1.1 如果 Route 有 children 属性

1.1.1 如果 children 是一个函数，把 props 传递进去

1.1.2 如果 children 不是一个函数，直接渲染 children

1.2 如果 Route 有 component 属性

1.2.1 通过 React.createElement 生成 dom

1.3 如果 Route 有 render 属性

1.3.1 返回 render(props)

1.4 没有上边的任何一个属性，不渲染

1.  如果不 match，路由不匹配，什么都不渲染

# 003: withRouter

作用：被包裹的组件传递 RouterContext

withRouter 其实就是个高阶函数，不做过多讲解

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174424.png"  alt="效果图" />

# 003.5: 插播

从 withRouter 和 Route 的实现来看，他们其实有一个共同的作用 -- 把 RouteContext 传下去

所以，当使用了如下 Route 用法时：

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174434.png"  alt="效果图" />

```
在页面的主文件中，不需要再包裹一层withRouter，因为Route已经将RouteContext传递下去了
```

# 004: Switch

作用：只渲染第一个匹配的路由组件

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174445.png"  alt="效果图" />

首先，同样的传递 context

然后，遍历 this.props.children

1.  如果当前没有 match 信息，且是一个符合规范的 child，则使用 matchPath 计算 match 信息，且保存 child 信息

1.  其中，path 为 child.props.path || child.props.from 是为了兼容 Route 子组件和 Redirect 子组件

1.  否则，不做任何操作

由上一步，如果获取到第一个匹配的 element，则返回，否则什么都不返回

# 004.5: 插播

在使用 Switch 时，已经对所有下面的 children 做了一次遍历，并判断出应该渲染哪个路由 且 计算好了 computedMatch，所以在 Route 实现中有如下代码：

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174458.png"  alt="效果图" />

```


```

# 005: Redirect

作用：重定向

同样的，要消费 RouteContext，这样在 location 变化的时候才会触发重新渲染，然后执行以下步骤：

1.  判断使用什么方法重定向，默认为 replace
2.  根据 Switch 的 computedMatch 或 to 属性 创建 location

3.  generatePath 可以根据路由的 to 属性和 params 生成真实路径

4.  触发跳转

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174508.png"  alt="效果图" />

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174516.png"  alt="效果图" />

```
Lifecycle只是对三个生命周期函数的一层封装：
```

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174526.png"  alt="效果图" />

```


```

**注**：一般情况下，Redirect 需要和 Switch 配合使用，因为在 Redirect 内部，并没有对 from 参数做任何处理，只有 Switch 才对 Redirect 的 from 参数做了处理 -- 判断如果匹配了 from，则生成有效的 match 信息，渲染对应组件

如果 Redirect 外面没有包裹 Switch，就会发生不管路由有没有匹配 from，都会跳转到 to 页面的情况

# 006: Prompt

作用：用于路由切换提示。这在某些场景下是非常有用的，比如用户在某个页面修改数据，离开时，提示用户是否保存

1.  如果 when 为 falsy，则不继续
2.  调用 history.block 函数来注册 release 函数，参数为 message，history.block 默认为 window.confirm

3.  也可以通过 BrowserRouter 或 HashRouter 组件 自定义 getUserConfirmation 参数，替换 window.confirm

4.  监听路由变化时，组件执行 onUnmount，即 release
5.  message 变化时，重新注册新的 release

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723174540.png"  alt="效果图" />

# 007: Hooks

React-router 还提供了一些 hooks 供 16.8 版本以上的 React 项目使用，实现原理也很简单：

**useHistory：**React.useContext(RouterContext).history

**useLocation**：React.useContext(RouterContext).location

**useParams**：

```
React.useContext(RouterContext).match ? React.useContext(RouterContext).match.params : {}
```

**useRouteMatch**：

```
const location = useLocation(); const match = useContext(RouterContext).match; return path ? matchPath(location.pathname, path) : match;
```

# 后语

上面就是 React-router 的核心代码原理分析，希望对大家有所帮助

如有错误，欢迎指正 讨论

6.0-beta 版去年就已经完成了，但是一直没有正式发版，期待内部实现有更多的优化
