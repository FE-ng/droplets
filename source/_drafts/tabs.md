<!--
 * @Author: your name
 * @Date: 2021-07-23 16:35:03
 * @LastEditTime: 2021-07-23 16:52:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/tabs.md
-->

# 场景

很多 web 端项目，业务需要在页面内打开 tab，以切换 tab 来快速切换页面。并且，用户希望在切换 tab 后，保留之前的查询数据、填写的表单、甚至滚动位置等信息。

## 理想状态下的方案效果

- 各种表单、列表数据缓存，切 tab 时，不重新请求数据/加载页面
- 当打开多个详情页 tab 时，分别缓存（分为 search/route 区分，不支持 historyState 区分）
- 支持删除当前缓存
- 支持配置最大缓存个数
- 缓存滚动条位置

此外，需注意的场景（具体还需结合需求）：

- 从列表页点新建时，应无缓存，但从 tab 进入时，新建页面应为缓存

# 方案调研

为达到切换 tab 时的 keep-alive 效果，目前业界已有多种方案，主要分为三大类：组件缓存、路由缓存、数据缓存。本质上前两者都是缓存或者隐藏 dom 结构。下面针对这些方案，做了一些对比：

<!-- | 方案类型 | 业界成熟方案 | git 地址 | 原理 | 缺点 | 备注 | star|
| -------- | ------------ | -------- | ---- | ---- | ---- | ------------- |
|路由缓存 |react-live-route|https://github.com/fi3ework/react-live-route|重写<Route>组件|已经 1 年多不维护了，重写组件对原生库的兼容性比较高|❌|197|
|-|react-keeper|https://github.com/lanistor/react-keeper|重写路由库，替换 react-router|目前 1 年多已经不维护了，不支持滚动条保存|❌|742|
|-|react-router-cache-route|https://github.com/CJY0208/react-router-cache-route/blob/master/README_CN.md|基于<Route>组件现有行为做拓展；display：none|相比 react-activation ，灵活性小；对复杂场景处理比较吃力，例如嵌套路由，不支持路由动画等|❎ 如果只需要 KeepAlive，作者推荐使用 react-activation|567|
|组件缓存|react-keep-alive|https://github.com/StructureBuilder/react-keep-alive/blob/master/README.zh-CN.md|React.createPortal|Context 会有问题，不支持 hook，一些核心 bug 作者始终没有修复|❌|
|550|
||react-activation|https://github.com/CJY0208/react-activation/blob/master/README_CN.md|打破 react 组件的固有层级，避免卸载|实现方式有破坏性|✅ 和 react-router-cache-route 一个作者，支持 hook，支持滚动条|370|
|react-ant|https://github.com/kuhami/react-ant|借助 tab|是在 antd pro 里实践的，结合了 umi-router/dev 等工具|✅ 是一个完整的多 tab 中台方案，其中有值得借鉴的 tab 方案|213|
|数据缓存|redux-persist、redux 等|https://github.com/rt2zz/redux-persist|数据管理工具|开发成本较高|❎ 是目前某些项目中已应用的方案，只依赖 redux，比较成熟，但迁移、开发成本比较大，尤其是在多详情页 tab |景下|-|
|Keep-alive-comp|https://github.com/zero9527/keep-alive/blob/master/README_zh.md|将 state 缓存在浏览器本地，需要在页面加载的时候手动把缓存取出来，再在页面卸载的时候手动将 state、滚动|位置等缓存到本地|开发成本高，页面侵入性大，还不如直接用 redux|❌|0 -->

---

# 初步-对比结论

首推：react-activation 和 react-ant

备选：react-router-cache-route 和 数据缓存

# 尝试后-方案对比

| 方案类型 | 业界成熟方案             | 尝试结果               | 目前发现的问题 | 备注 |
| -------- | ------------------------ | ---------------------- | -------------- | ---- |
| 路由缓存 | react-router-cache-route | ✅ 接入方便 支持滚动条 |

display：none 无法配合 Transition
地图页面缓存后，展示有时有问题/报错
依赖 pathname+search 缓存有问题
【来自 issue】嵌套路由需要保证叶节点的 CacheRoute，其路径上的 Route 需要也都是 CacheRoute
如果只需要 KeepAlive，作者推荐使用 react-activation
相比 react-activation，灵活性小
组件缓存

react-activation

❌

一些依赖 context 的功能异常，需要手动修复 context，比如 Route 的 match 等信息

和 react-router-cache-route 一个作者

react-ant

❌ 需要紧密结合 umi/dva

数据缓存

redux-persist、redux 等

✅ 方案最成熟

开发成本较高，尤其是在多详情页 tab 场景下

尝试后-结论
业务使用比较紧急的情况：直接使用 react-router-cache-route

后续完整方案：借鉴 route cache 的思路，结合 cosmos 输出一份完整的解决方案，方便团队后续维护

使用注意事项：

1. 场景：在 sds 项目中 有顺丰地图的页面使用时 来回切 tab 会出现地图加载不完整的情况

   原因：高度动态计算导致的

   解决：把计算结果放在 redux 里缓存

# 我们在理论篇已经明确了方案 -- 基于 react-router 进行扩展

001 背景思路整理

那当我们把数据保存在 React state 里的时候，为什么 react-router 不能缓存？怎么扩展才能缓存？

这就要先从 react-router 的内部实现说起：

《React-router 基本原理篇》已有详细介绍，所以下面简单概括一下：

Router 会创建 history location 等路由信息 并 存储在 context 里
Switch 会遍历子元素，通过 child（目前只考虑是 Route 的情况） .path 和 当前 location 计算匹配信息 - match
match 则渲染 Route 并 将 match 信息作为 computedMatch 传递给 Route
否则卸载
Route 也会计算 match 信息（如果有 computedMatch 会直接使用该计算 match 结果）
match 渲染
unmatch 不渲染

解答第一个问题：为什么 react-router 不能缓存？ -- 组件卸载了，里面的 state 信息当然也就消失了

解答第二个问题：怎么扩展才能缓存？-- 避免组件卸载

Switch 逻辑不能通过任何配置来避免 unmatch 的组件卸载，所以需要重写一个 CacheSwitch

Route 可以通过控制 computedMatch 参数避免卸载，再通过一些处理来实现缓存，所以扩展成一个组件 CacheRoute 即可

002 CacheSwitch
回顾 React-router 内 Switch 思路

摘自《React-router 基本原理篇》

首先，通过 RouterContext 获取 location 信息

然后，声明 element match 变量，forEach 遍历 this.props.children

如果当前 match 为 null，且是一个符合规范的 child，则使用 matchPath 计算 match 信息并保存，且保存 child 信息为 element
其中，path 为 child.props.path || child.props.from 是为了兼容 Route 子组件和 Redirect 子组件
注意，此时计算的 match 结果，如果不匹配则为 null
否则，不做任何操作
最后，判断如果有 match 信息，则意味着获取到了第一个匹配的 element，则返回 element 并 注入 computedMatch 字段 为 match 计算结果 同时传递 location 信息，否则什么都不返回

功能点梳理

拥有只渲染第一个匹配的组件的基本功能
子组件兼容 CacheRoute 和 Route
避免 Switch 判断 unmatch 导致的组件卸载

实现思路

首先，还是获取 location match（重命名为 contextMatch）信息，并兼容新旧版本的 React-router

然后，声明\_\_matchedAlready 变量，map 遍历 this.props.children，元素为 element

如果 element 不符合规范，则直接返回 null
计算 match 信息
如果**matchedAlready 为 true，则 match 为 null
否则根据 element.props.path|from location contextMatch 计算
声明 child 变量
判断是 CacheRoute 还是 Route
如果是普通 Route
如果 match && !**matchedAlready，child 赋值 element 的克隆，并赋值 location 和 computedMatch 信息
否则，child 赋值 null
如果是 CacheRoute
child 赋值 element 的克隆，并赋值 location 和 computedMatch
computedMatch 属性为计算的 match 信息
如果 match 为 null，添加 computedMatchForCacheRoute: { [COMPUTED_UNMATCH_KEY]: true }属性标识（在 CacheRoute 内会使用）
COMPUTED_UNMATCH_KEY 为一个常量
判断**matchedAlready 不为 true 时，赋值**matchedAlready 为!!match
返回 child

至此，我们在 Switch 中避免了子组件卸载，并且通过一些字段来标识 是否真实匹配路由

流程图
SFTC-FE > Tabs 缓存方案 实现篇 > image2021-5-28_15-27-34.png
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723165118.png"  alt="效果图" />

# 详细实现

1 架子
class CacheSwitch extends Switch { // 1. getContext 函数 render() { const { location, match: contextMatch } = this.getContext(); let \_\_matchedAlready = false; // 确保 switch 下 只匹配第一个 match 的组件 return ( <Updatable when={isMatch(contextMatch)}> // 只在 match 信息生效的时候更新子组件，when 是 shouldComponentUpdate 里的返回值 {() => ( <SwitchFragment> {React.Children.map(this.props.children, (element) => { if (!React.isValidElement(element)) { return null; } // 2. element 处理 })} </SwitchFragment> )} </Updatable> ); } } // 3. propTypes 声明 // 4. 注入默认参数 -- which 工具函数 判断组件是不是 CacheRoute
2 注入默认参数 - which 工具函数
get 类似 lodash 里的用法，主要是做了一层捕获错误的兼容

CacheSwitch.defaultProps = { which: element => get(element, 'type.\_\_name') === 'CacheRoute', };

3 propTypes 声明
// 主要区别在于 // 1. 旧版多了一个 contextTypes // 2. 旧版的 loaction 没有 isRequired // 附加原因 // 1. 旧版的 match 信息 在 context.router.route 里 // 2. 旧版的 location 可能是 props.location 也可能是 route.location if (isUsingNewContext) { CacheSwitch.propTypes = { children: PropTypes.node, location: PropTypes.object.isRequired, match: PropTypes.object.isRequired, which: PropTypes.func, }; CacheSwitch = withRouter(CacheSwitch); } else { CacheSwitch.contextTypes = { router: PropTypes.shape({ route: PropTypes.object.isRequired, }).isRequired, }; CacheSwitch.propTypes = { children: PropTypes.node, location: PropTypes.object, which: PropTypes.func, }; }

4 getContext 函数
// 判断新旧版本 react-router const isUsingNewContext = isExist(\_\_RouterContext) || isExist(useHistory); getContext = () => { if (isUsingNewContext) { const { location, match } = this.props; return { location, match }; } const { route } = this.context.router; const location = this.props.location || route.location; return { location, match: route.match, }; }

5 element 处理
const path = element.props.path || element.props.from; const match = **matchedAlready ? null : path ? matchPath( location.pathname, { ...element.props, path, }, contextMatch, ) : contextMatch; let child; if (this.props.which(element)) { // 是 CacheRoute child = React.cloneElement(element, { location, computedMatch: match, ...(isNull(match) ? { computedMatchForCacheRoute: { [COMPUTED_UNMATCH_KEY]: true, }, } : null), }); } else { child = match && !**matchedAlready ? React.cloneElement(element, { location, computedMatch: match, }) : null; } if (!**matchedAlready) { **matchedAlready = !!match; } return child;

003 CacheRoute

回顾 React-router 内 Route 思路

摘自《React-router 基本原理篇》

首先，需要接收 Router 传下来的 context 信息，并对 context 信息做一些处理

获取 location
计算 match 信息（如果有 props.computedMatch 则直接使用）
然后，根据 match 信息进行渲染

有 match 信息，表示路由匹配 进入下一步判断
1.1 如果 Route 有 children 属性

1.1.1 如果 children 是一个函数，把 props 传递进去

1.1.2 如果 children 不是一个函数，直接渲染 children

1.2 如果 Route 有 component 属性

1.2.1 通过 React.createElement 生成 dom

1.3 如果 Route 有 render 属性

1.3.1 返回 render(props)

1.4 没有上边的任何一个属性，不渲染

如果不 match，路由不匹配，什么都不渲染

功能点梳理

组件缓存
支持多缓存，比如多个详情页打开时 需要分别缓存，但对应的 Route.path 其实是一个

实现思路

回顾：我们通过 CacheSwitch 我们做了一层额外判断，并得到这样的效果

当 Route 真正 match 的时候，这时 computedMatch 属性为 match 信息
当 Route 不 match 的时候，computedMatch 属性为 null，并给 props 赋值了 computedMatchForCacheRoute 属性
并且我们 Route 会处理 computedMatch 等重新计算 match 信息，当有 match 的时候，会渲染并赋值 match 给子组件

首先，解析 CacheRoute.props

computedMatchForCacheRoute 和 multiple 我们需要特殊处理一下，单独拿出来
剩下的参数里，一类为 CacheRoute 参数配置相关的，稍后再说，命名为 configProps
一类为 Route 渲染组件相关的，比如：children、render、component，这些我们需要手动处理一下，所以单独拿出来
剩下的为 ReactRouter 里 Router Switch 传递下来的参数，比如 match computedMatch 等信息，使用 restProps 表示然后，做一下手脚，让 unmatch 的组件也通过 Route 的 computedMatch 检查
如果有 computedMatchForCacheRoute 字段，直接赋值给 restProps.computedMatch
再声明一个 cache 变量，赋值为{}，用作多缓存时使用，下面会讲

然后，把 restProps 传递给 Route，Route 会把传过来的 真的假的 computedMatch，输出成 match 传给 children

<Route {...restProps}> {(props) => { // ... 加工 }} </Route>
至此，我们已经通过一些特殊操作（冒充 computedMatch）避免 Route 发现 unmatch 导致组件卸载

下面，我们再处理 Route 子组件的加工

首先，我们要在子组件中判断是不是真的 match，使用 isMatchCurrentRoute 表示，工具函数如下：

isMatch = match => isExist(match) && get(match, COMPUTED_UNMATCH_KEY) !== true
然后，我们需要处理一个 multiple 字段，用来表示缓存个数，最小为 1，如果是 true 则为 Infinity 无穷大

当 multiple && isMatchCurrentRoute 时，需要处理缓存

以 location.pathname + location.search 作为 key，保存在 cache 里
value 里保存当前时间戳-updateTime pathname search props
依据 updateTime multiple cache 的长度判断是否需要删除缓存
然后正式渲染组件

multiple 时，遍历 cache
当 pathname+search 匹配时，recomputedMatch 为 props.match 或 props.computedMatch
否则 recomputedMatch 为 null
启用 renderSingle 函数，传递参数，并标记 multiple: true，且更新 match 为 recomputedMatch
否则直接执行 renderSingle 函数，传递参数，并标记 multiple: false

至此，我们又通过 multiple 字段 结合 location.pathname + location.search 将需要的数据缓存到 cache，并实现了 cache 数据 超过 multiple 限制后的 自动删除（删除后自然就没有数据 也就不会保存渲染的 dom 了）

此时，renderSingle 接收到的参数有三种 match 信息：

null
{\_\_isComputedUnmatch: true}
有内容的真实 match
单缓存时，路径匹配的 match 为类型 3，不匹配的为 2

多缓存时，search 匹配 match 为类型 3，不匹配的为 1

接下来，renderSingle 函数主要功能是 应用 CacheComponent 达到组件缓存的功能，由于实现比较复杂，放在下一部分 - CacheComponent 单独讲

流程图

SFTC-FE > Tabs 缓存方案 实现篇 > image2021-5-28_15-29-8.png
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723165209.png"  alt="效果图" />
详细实现

1 架子
class CacheRoute extends Component { static \_\_name = 'CacheRoute' // 1. 注入默认参数 - multiple // 2. propTypes 声明 cache = {} render() { // 3. 准备工作 return (<Route {...restProps}> (props) => { const { match, computedMatch, location } = props; const isMatchCurrentRoute = isMatch(props.match); const { pathname: currentPathname, search: currentSearch } = location; // 4. 处理缓存 // 5. 根据 multiple 最终处理 )} </Route>) } }

2 注入默认参数 - multiple
static defaultProps = { multiple: false, }

3 propTypes 声明
static propTypes = { component: PropTypes.elementType || PropTypes.any, render: PropTypes.func, children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]), computedMatchForCacheRoute: PropTypes.object, multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), }

4 准备工作
let { children, render, component, className, when, behavior, cacheKey, unmount, saveScrollPosition, computedMatchForCacheRoute, multiple, // 允许按动态路由参数区分不同缓存，值为数字时表示最大缓存份数，超出最大值时将清除最早更新的缓存 ...restProps // 过滤掉一些 CacheRoute 自定义的 props } = this.props; const configProps = { when, className, behavior, cacheKey, unmount, saveScrollPosition, }; if (computedMatchForCacheRoute) { // CacheSwitch 里 match 为 null 的 restProps.computedMatch = computedMatchForCacheRoute; } if (isNumber(multiple)) { // 最小为 1 即只缓存当前的组件 multiple = clamp(multiple, 1) } else if (!!multiple) { multiple = Infinity }

5 处理缓存
if (multiple && isMatchCurrentRoute) { this.cache[currentPathname + currentSearch] = { updateTime: Date.now(), pathname: currentPathname, search: currentSearch, props }; Object.entries(this.cache) .sort(([, prev], [, next]) => next.updateTime - prev.updateTime) .forEach(([cacheKey], idx) => { if (idx >= multiple) { delete this.cache[cacheKey]; } }); }

6 根据 multiple 最终处理
return multiple ? ( <Fragment> {Object.entries(this.cache).map(([multipleCacheKey, { pathname, search, props }]) => { const recomputedMatch = multipleCacheKey === currentPathname + currentSearch ? match || computedMatch : null; return ( <Fragment key={`${pathname}${search || ''}`}> {this.renderSingle({ ...props, ...configProps, pathname, search, multiple: true, match: recomputedMatch, })} </Fragment> ); })} </Fragment> ) : ( this.renderSingle({ ...props, ...configProps, pathname: currentPathname, search: currentSearch, multiple: false, }) );

004 CacheComponent

功能点梳理

总的来说就一句话，不 match 的不更新，match 的用缓存

那么如何达到这个效果呢，请往下看

实现思路

组件初始加载时，注册 state 为 { cached: false, matched: false }
state 更新逻辑
当真正 match 时，更新 cached 为 true，matched 为 true
不 match 时
更新 matched 为 false
还需要根据 when 参数，判断是否取消缓存，判断取消时，cached ： false
组件更新逻辑
之前 match 现在不 match 时
现在 match 时
缓存状态更改时
渲染逻辑
当 cached 且 matched，正常渲染
当 cached 且 !matched，正常渲染 + display: none
否则，不渲染

流程图
SFTC-FE > Tabs 缓存方案 实现篇 > image2021-5-28_15-29-46.png
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210723165251.png"  alt="效果图" />

# 详细实现

1 架子
export default class CacheComponent extends React.Component { static \_\_name = 'CacheComponent' // 1 注入默认参数 // 2 propTypes 声明 }

2 注入默认参数
static defaultProps = { when: 'forward', unmount: false, saveScrollPosition: false, behavior: matched => matched ? undefined : { style: { display: 'none' } } }

3 propTypes 声明
static propsTypes = { history: PropTypes.object.isRequired, match: PropTypes.object.isRequired, children: PropTypes.func.isRequired, className: PropTypes.string, when: PropTypes.oneOfType([ PropTypes.func, PropTypes.oneOf(['forward', 'back', 'always']) ]), behavior: PropTypes.func, unmount: PropTypes.bool, saveScrollPosition: PropTypes.bool }
