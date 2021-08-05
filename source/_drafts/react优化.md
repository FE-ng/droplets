<!--
 * @Author: your name
 * @Date: 2021-08-05 11:09:48
 * @LastEditTime: 2021-08-05 11:10:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/react优化.md
-->

**1\. Hooks 按需更新**  
        如果自定义 Hook 暴露多个状态，而调用方只关心某一个状态，那么其他状态改变就不应该触发组件重新 Render。

```
export const useNormalDataHook = () => {
  const \[data, setData\] = useState({ info: null, count: null })
  useEffect(() => {
    const timer = setInterval(() => {
      setData(data => ({
        ...data,
        count: data.count + 1,
      }))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  })

  return data
}
```

如上所示，useNormalDataHook  暴露了两个状态 info 和 count 给调用方，如果调用方只关心 info 字段，那么 count 改变就没必要触发调用方组件 Render。  
      按需更新主要通过两步来实现

**参考**[Hooks 的按需更新](https://codesandbox.io/s/qks82?file=/src/hooks.js)

1.  根据调用方使用的数据进行依赖收集，Demo 中使用  Object.defineProperties 实现。
2.  只在依赖发生改变时才触发组件更新。

**2.避免滥用 useMemo**  
      使用 useMemo 当 deps 不变时，直接返回上一次计算的结果，从而使子组件跳过渲染。  
      但是当返回的是原始数据类型（如字符串、数字、布尔值）。即使参与了计算，只要 deps 依赖的内容不变，返回结果也很可能是不变的。此时就需要权衡这个计算的时间成本和 useMemo 额外带来的空间成本（缓存上一次的结果）了。  
      此外，如果 useMemo 的 deps 依赖数组为空，这样做说明你只是希望存储一个值，这个值在重新 render 时永远不会变。  
      比如：

```
const Comp = () => {
    const data = useMemo(() => ({ type: 'xxx' }), \[\]);
    return <Child data={data}>;
}
```

可以被替换为：

```
const Comp = () => {
    const { current: data } = useRef({ type: 'xxx' });
    return <Child data={data}>;
}
```

甚至：

```
const data = { type: 'xxx' };
const Comp = () => {
    return <Child data={data}>;
}
```

此外，如果 deps 频繁变动，我们也要思考，使用 useMemo 是否有必要。因为 useMemo 占用了额外的空间，还需要在每次 render 时检查 deps 是否变动，反而比不使用 useMemo 开销更大。

**3.按优先级更新，及时响应用户**  
      优先级更新是批量更新的逆向操作，其思想是：优先响应用户行为，再完成耗时操作。

常见的场景是：页面弹出一个 Modal，当用户点击 Modal 中的确定按钮后，代码将执行两个操作。a) 关闭 Modal。b) 页面处理 Modal 传回的数据并展示给用户。当 b) 操作需要执行 500ms 时，用户会明显感觉到从点击按钮到 Modal 被关闭之间的延迟。

**例子参考**：[优先级 demo](https://codesandbox.io/s/youxianjigengxinlijixiangyingyonghucaozuo-g5v2f)。

在该例子中，用户添加一个整数后，页面要隐藏输入框，并将新添加的整数加入到整数列表，将列表排序后再展示。以下为一般的实现方式，将 slowHandle 函数作为用户点击按钮的回调函数。

```
const slowHandle = () => {
  setShowInput(false)
  setNumbers(\[...numbers, +inputValue\].sort((a, b) => a - b))
}
```

slowHandle() 执行过程耗时长，用户点击按钮后会明显感觉到页面卡顿。如果让页面优先隐藏输入框，用户便能立刻感知到页面更新，不会有卡顿感。

**  实现优先级更新的要点是将耗时任务移动到下一个宏任务中执行，优先响应用户行为。**  
    例如在该例中，将 setNumbers 移动到 setTimeout 的回调中，用户点击按钮后便能立即看到输入框被隐藏，不会感知到页面卡顿。优化后的代码如下。

```
const fastHandle = () => {
  // 优先响应用户行为
  setShowInput(false)
  // 将耗时任务移动到下一个宏任务执行
  setTimeout(() => {
    setNumbers(\[...numbers, +inputValue\].sort((a, b) => a - b))
  })
}
```

**4\. 在需要的情况下对 Context 进行读写分离**  
    现在有一个全局日志记录的需求，我们想通过 Provider 去做，代码如下：

```
import React, { useContext, useState } from "react";
import "./styles.css";

const LogContext = React.createContext();

function LogProvider({ children }) {
  const \[logs, setLogs\] = useState(\[\]);
  const addLog = (log) => setLogs((prevLogs) => \[...prevLogs, log\]);
  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
}

function Logger1() {
  const { addLog } = useContext(LogContext);
  console.log('Logger1 render')
  return (
    <>
      <p>一个能发日志的组件1</p>
      <button onClick={() => addLog("logger1")}>发日志</button>
    </>
  );
}

function Logger2() {
  const { addLog } = useContext(LogContext);
  console.log('Logger2 render')
  return (
    <>
      <p>一个能发日志的组件2</p>
      <button onClick={() => addLog("logger2")}>发日志</button>
    </>
  );
}

function LogsPanel() {
  const { logs } = useContext(LogContext);
  return logs.map((log, index) => <p key={index}>{log}</p>);
}

export default function App() {
  return (
    <LogProvider>
      {/* 写日志 */}
      <Logger1 />
      <Logger2 />
      {/* 读日志 */}
      <LogsPanel />
      </div>
    </LogProvider>
  );
}
```

上面的代码中 Logger 组件只负责发出日志，它是不关心 logs 的变化的，在任何组件调用 addLog 去写入日志的时候，理想的情况下应该只有 LogsPanel 这个组件发生重新渲染。  
        但是这样的代码写法却会导致每次任意一个组件写入日志以后，所有的 Logger 和 LogsPanel 都发生重新渲染。

这肯定不是我们预期的，假设在现实场景的代码中，能写日志的组件可多着呢，每次一写入就导致全局的组件都重新渲染？这当然是不能接受的，发生这个问题的本质原因[官网 Context 的部分](https://link.juejin.cn/?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fcontext.html%23contextprovider)已经讲得很清楚了：

![](http://wiki.sftcwl.com/download/attachments/54725666/%E6%88%AA%E5%B1%8F2021-08-02%20%E4%B8%8A%E5%8D%8810.56.02.png?version=1&modificationDate=1628048444000&api=v2 'SFTC-FE > React开发中的小优化 > 截屏2021-08-02 上午10.56.02.png')

当 LogProvider 中的 addLog 被子组件调用，导致 LogProvider 重渲染之后，必然会导致传递给 Provider 的 value 发生改变，由于 value 包含了 logs 和 setLogs 属性，所以两者中任意一个发生变化，都会导致所有的订阅了 LogProvider 的子组件重新渲染。

那么解决办法是什么呢？其实就是读写分离，我们把 logs（读）和 setLogs（写）分别通过不同的 Provider 传递，这样负责写入的组件更改了 logs，其他的「写组件」并不会重新渲染，只有真正关心 logs 的「读组件」会重新渲染。

```
function LogProvider({ children }) {
  const \[logs, setLogs\] = useState(\[\]);
  const addLog = useCallback((log) => {
    setLogs((prevLogs) => \[...prevLogs, log\]);
  }, \[\]);
  return (
    <LogDispatcherContext.Provider value={addLog}>
      <LogStateContext.Provider value={logs}>
        {children}
      </LogStateContext.Provider>
    </LogDispatcherContext.Provider>
  );
}
```

刚刚也提到，需要保证 value 的引用不能发生变化，所以这里自然要用  useCallback  把  addLog  方法包裹起来，才能保证  LogProvider  重渲染的时候，传递给的 LogDispatcherContext 的 value 不发生变化。

**      例子[Context 读写分离](https://codesandbox.io/s/react-genghaodecontext-forked-zfw91?file=/src/App.js)**

现在我从任意「写组件」发送日志，都只会让「读组件」LogsPanel  渲染。  
**请注意：读写分离是在组件「只需要读或只需要写」的情况下的优化，两者都需要，肯定没法做这个优化了**

**    包装 Context 的使用**  
    上面的案例中，我们在子组件中获取全局状态，都是直接裸用  useContext：

```
import React from 'react'
import { LogStateContext } from './context'

function App() {
  const logs = React.useContext(LogStateContext)
}
```

但是是否有更好的代码组织方法呢？比如这样：

```
import React from 'react'
import { useLogState } from './context'

function App() {
  const logs = useLogState()
}
```

```
// context
import React from 'react'

const LogStateContext = React.createContext();

export function useLogState() {
  return React.useContext(LogStateContext)
}
```

**组合多个 Context，优化代码**  
        假设我们使用上面的办法管理一些全局的小状态，Provider 变的越来越多了，有时候会遇到嵌套地狱的情况：

```
const StateProviders = ({ children }) => (
  <LogProvider>
    <UserProvider>
      <MenuProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </MenuProvider>
    </UserProvider>
  </LogProvider>
)

function App() {
  return (
    <StateProviders>
      <Main />
    </StateProviders>
  )
}
```

有没有办法解决呢？当然有，我们参考  redux  中的  compose  方法，自己写一个  composeProvider  方法：

```
function composeProviders(...providers) {
  return ({ children }) =>
    providers.reduce(
      (prev, Provider) => <Provider>{prev}</Provider>,
      children,
    )
}
```

代码就可以简化成这样：

```
const StateProviders = composeProviders(
  LogProvider,
  UserProvider,
  MenuProvider,
  AppProvider,
)

function App() {
  return (
    <StateProvider>
      <Main />
    </StateProvider>
  )
}
```
