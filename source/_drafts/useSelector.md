<!--
 * @Author: your name
 * @Date: 2021-07-23 17:19:31
 * @LastEditTime: 2021-07-23 17:19:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/useSelector.md
-->

## React-Redux hooks

在没有 hooks 之前，我们使用 react-redux 时一般是使用 connect()函数将 React 组件和 Redux store 连接起来。比如下面一个使用 connect()方式实现的示例：

```
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from "../../app/counterSlice";
import styles from "./CounterConnect.module.css";

export function CounterConnectInner({
  count,
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
}) {
// ...
}

const mapStateToProps = (state) => {
  return {
    count: selectCount(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    incrementByAmount: (amount) => dispatch(incrementByAmount(amount)),
    incrementAsync: (amount) => dispatch(incrementAsync(amount)),
  };
};

export const CounterConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterConnectInner);
```

hooks 出现后，react-redux 提供了 useSelector 等 hooks，作为可以替代 connect()高阶组件方式的一种选择。这些 hooks 可以让我们订阅 Redux store 和 dispatch actions，而不用 connect()来包裹我们的 components。下面是使用 hooks 实现的方式：

```
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from "../../app/counterSlice";
import styles from "./CounterUseSelector.module.css";

export function CounterUseSelector() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  // ...
}
```

## 和 connect()方式相比，hooks 方式有什么不同呢？

1.更少的样板代码。useSelector()使我们不再需要区分 UI 组件和 container 组件。

2.useSelector 用于从 Redux 存储的 state 中提取值并订阅该 state。这基本上类似于在 hooks 中实现的 mapStateToProps 函数，但有一些小的差异:

- 不再提供 ownProps API，并且应该使用 useCallback 或 useMemo 来通过自定义逻辑获取它们
- useSelector 默认使用 === 严格相等来检查，而不是浅比较
- 需要考虑使用 reselect 等记忆选择器来提高性能

  3.connect()只有在 props 改变时才会重新渲染，hooks 方式也可以通过使用 React.memo 来实现同样的效果。

```
function CounterUseSelector({ allowValueChange }) {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  // ...
}

export default React.memo(CounterUseSelector)
```

4.可能会出现'stale props' 和 'zombie child' 的问题

在 version 4 之前，一个使用了 mapState 的 list item，如果刚刚被移除，可能会引起错误。在 version 7，React Redux 使用改写部分内部的 React Context 来解决这个问题，但对于 hooks 来说，没有重新渲染 context provider 的方式，所以'stale props' 和 'zombie child' 的问题可能会重新出现。

具体来说，以下情况会引起'stale props':

- 选择器依赖于组件的 props 来提取数据
- 某个 action 会引起父组件的重新渲染并把新的 props 传递给该组件
- 但是该组件的选择器函数会在该组件使用新的 props 重新渲染前执行

由于依赖于 props 和 store state，这种情况可能会拿到错误的数据，甚至会抛出错误。

以下情况会引起'zombie child'：

- 第一次挂载多个嵌套的 connected component，导致子组件先于父组件订阅 store
- dispatch 了一个从 store 中删除数据的 action，例如 todo item
- 父组件会停止渲染子组件
- 然而，因为子组件是先订阅的，subscription 会在父组件停止渲染前执行。当基于 props 读取 store 中的数据时，这个数据已经不存在了，可能会抛出错误

我们可以采取以下方法来避免这些错误：

- 在选择器中，不要依赖于 props 来提取数据
- 如果需要依赖 props 来提取数据，要使代码更健壮。比如不要直接使用  state.todos\[[props.id](http://props.id/)\].name ,首先先读取  state.todos\[[props.id](http://props.id/)\] ，确定存在后再读取  [todo.name](http://todo.name/)
- 因为 connect 增加了对 context provider 的必要的订阅并且在组件重新渲染时延迟计算子组件的订阅，所以把使用 useSelector 的 connected components 放在上层会避免这些错误

# useSelector

## useSelector 作用

调用此 Hook API 时会在 store 上注册监听器。 当 Store::state 变化时，组件会 checkForUpdates，利用 equalityFn 判断是否进行更新。

## 缺点

没有对 selector 函数做 memorize 优化

## 解决方案

使用 reselect 对 selector 做 memorize 处理

## reselect 作用

对 selector 函数(等效于 mapStateToProps 函数)做 memorize 优化，如果 selector 的入参没有发生变化，则返回上一次执行的缓存。

reselect 源码其实很短，主要是实现了一个记忆函数

```
function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
    let lastArgs = null
    let lastResult = null
    // we reference arguments instead of spreading them for performance reasons
    return function () {
      if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
        // apply arguments instead of spreading for performance.
        lastResult = func.apply(null, arguments)
      }
  
      lastArgs = arguments
      return lastResult
    }
  }
```

## useSelector 源码细节

在使用 hooks 之前，需要将 store 注入到组件中

```
const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

注意：这个 Provider 是 react-redux 封装后的 Provider，不是 Context.Provider，Context.Provider 的属性是 value。

封装的 Provider 为：

```
function Provider({ store, context, children }) {
/**
 *  contextValue 分为两部分，
 *  一个是在外面传过来的store，
 *  一个是内部定义的Subscription实例，
 *  并用useMemo记忆
 */
  const contextValue = useMemo(() => {
    console.log('store :>> ', store);
    const subscription = new Subscription(store)
    subscription.onStateChange = subscription.notifyNestedSubs
    return {
      store,
      subscription
    }
  }, \[store\])


  const previousState = useMemo(() => store.getState(), \[store\])

  useEffect(() => {
    const { subscription } = contextValue
    // 订阅
    subscription.trySubscribe()

    if (previousState !== store.getState()) {
      // 如果状态发生改变通知订阅者
      subscription.notifyNestedSubs()
    }
    return () => {
      // 销毁时取消订阅
      subscription.tryUnsubscribe()
      subscription.onStateChange = null
    }
  }, \[contextValue, previousState, store\])

  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

useSelector 的核心部分为 useSelectorWithStoreAndSubscription

```
function useSelectorWithStoreAndSubscription(
  selector,
  equalityFn,
  store,
  contextSub
) {
  // 强刷新函数
  const \[, forceRender\] = useReducer(s => s + 1, 0)


  const subscription = useMemo(() => new Subscription(store, contextSub), \[
    store,
    contextSub
  \])
  // 通过useRef()来使取相同的引用
  const latestSubscriptionCallbackError = useRef()
  const latestSelector = useRef()
  const latestStoreState = useRef()
  const latestSelectedState = useRef()


  // 取到store的state
  const storeState = store.getState()
  let selectedState

  try {
    if (
      selector !== latestSelector.current ||
      storeState !== latestStoreState.current ||
      latestSubscriptionCallbackError.current
    ) {
      selectedState = selector(storeState)
    } else {
      selectedState = latestSelectedState.current
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current) {
      err.message += `\\nThe error may be correlated with this previous error:\\n${latestSubscriptionCallbackError.current.stack}\\n\\n`
    }

    throw err
  }
  // useIsomorphicLayoutEffect在浏览器环境使用useLayoutEffect,在服务端使用useEffect
  useIsomorphicLayoutEffect(() => {
    latestSelector.current = selector
    latestStoreState.current = storeState
    latestSelectedState.current = selectedState
    latestSubscriptionCallbackError.current = undefined
  })

  useIsomorphicLayoutEffect(() => {
    function checkForUpdates() {
      try {
        const newSelectedState = latestSelector.current(store.getState())
        // 使用equalityFn函数来比较本次和上次的selectedState。equalityFn可以通过useSelector函数的第二个参数传入，默认为===严格相等的比较
        if (equalityFn(newSelectedState, latestSelectedState.current)) {
          return
        }
        // 将latestSelectedState.current设为最新的值
        latestSelectedState.current = newSelectedState
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        latestSubscriptionCallbackError.current = err
      }
      // 由于改变的是ref，不会重新渲染，需要手动触发
      forceRender()
    }
    // 在subscription中store.subscribe(onStateChange),store改变会调用checkForUpdates,从而重新渲染
    subscription.onStateChange = checkForUpdates
    subscription.trySubscribe()

    checkForUpdates()

    return () => subscription.tryUnsubscribe()
  }, \[store, subscription\])

  return selectedState
}
```

通过 store.subscribe(listener)，将 checkForUpdate 作为 listener，当 store 改变并且选取的 state 上次不同时，会调用 forceRender()重新渲染。

## 总结

1.useSelector 让我们使用 react-redux 更加方便，可以用来代替 connect()的方式。

2.使用方式为 const count = useSelector(selectCount);

3.useSelector 本身没有记忆功能，可以用 reselect 来增加记忆功能，避免重复进行复杂的计算

4.useSelector 可能会出现一些预料之外的问题，写代码时应避免出现这些问题
