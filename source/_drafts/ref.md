<!--
 * @Author: your name
 * @Date: 2021-07-23 17:28:49
 * @LastEditTime: 2021-07-23 17:49:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/ref.md
-->

## 一、 为什么选择 Hook ？

- 逻辑更易复用
- 清爽的代码风格
- 易拓展的组件

## 二、React Refs

过去，在 class component 中，React Ref 经常与 DOM 保持紧密关联，但是自从出现了 React Hook 以后，Ref 的使用也不再变得只是与 Dom 相关的 Api，而是可以表示对任何内容的引用（DOM 节点，JavaScript 值等）

### 2.1 除去 Dom 元素看 Ref

#### 2.1.1 特性

首先看以下栗子：

```
function Counter() {
  const [count, setCount] = useState(0);
 
  function onClick() {
    const newCount = count + 1;
 
    setCount(newCount);
  }
 
  return (
    <div>
      <p>{count}</p>
 
      <button type="button" onClick={onClick}>
        Increase
      </button>
    </div>
  );
}

```

这是一个简单的递增函数组件，接下来我们将引用了`React.useRef：`

function Counter() {

```
  const hasClickedButton = React.useRef(false);
 
  const [count, setCount] = React.useState(0);
 
  function onClick() {
    const newCount = count + 1;
 
    setCount(newCount);
 
    hasClickedButton.current = true;
    console.log("hasClickedButton",hasClickedButton)
  }
 
  console.log('Has clicked button? ' + hasClickedButton.current);
 
  return (
    <div>
      <p>{count}</p>
 
      <button type="button" onClick={onClick}>
        Increase
      </button>
    </div>
  );
}

```

控制台打印结果：

![](https://gitee.com/RenYaNan/wx-photo/raw/master/2020-11-12/1605173513450-%E6%88%AA%E5%B1%8F2020-11-12%20%E4%B8%8B%E5%8D%885.31.11.png)

可以看出 useRef Hook 返回值是一个对象，其具有两个特点：

- 具有 current 属性，该属性是可变的
- 它可以在组件生命周期中随时更改

接下来看看下面这个栗子：

```
function Counter() {
  const hasClickedButton = useRef(false);
 
  const [count, setCount] = useState(0);
 
  function onClick() {
    // const newCount = count + 1;
 
    // setCount(newCount);
 
    hasClickedButton.current = true;
  }
  console.log('Has clicked button? ' + hasClickedButton.current);
 
  return (
    <div>
      <p>{count}</p>
 
      <button type="button" onClick={onClick}>
        Increase
      </button>
    </div>
  );
}
```

将 React ref 设置为新值时，它不会触发组件的重新渲染。尽管`setCount`在上一个示例中，会更新组件的状态并使组件重新渲染，但是 ref 值的变化根本不会触发重新渲染：

每当我们需要跟踪某种状态而无需使用 React 的重新渲染机制时，ref 都可以用作 React 中功能组件的**实例变量**。例如，我们可以跟踪组件是第一次渲染还是重新渲染：

```
function ComponentWithRefInstanceVariable() {
  const [count, setCount] = React.useState(0);
 
  function onClick() {
    setCount(count + 1);
  }
 
  const isFirstRender = useRef(true);
 
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  });
 
  return (
    <div>
      <p>{count}</p>
 
      <button type="button" onClick={onClick}>
        Increase
      </button>
      <p>{isFirstRender.current ? 'First render.' : 'Re-render.'}</p>
    </div>
  );
}

```

在这个示例中，我们将 ref 的 current 属性初始化为 true，然后，我们利用 useEffect（在没有依赖项数组的情况下运行），在第一次渲染组件后更新 ref 的当前属性。而这个示例最后也向我们展示了将 ref 的 current 属性设置为 false 是不会触发重新渲染的。利用这一特性，我们可以创建一个 useEffect 挂钩，该挂钩仅在每次组件更新时都运行其逻辑，而不在初始渲染时运行。这可能是每个 React 开发人员在某个时候会需要的功能：

```
function ComponentWithRef() {
  const [count, setCount] = useState(0);
 
  function onClick() {
    setCount(count + 1);
  }
 
  const isFirstRender = useRef(true);
 
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      console.log("re-render");
    }
  });
 
  return (
    <div>
      <p>{count}</p>
 
      <button type="button" onClick={onClick}>
        Increase
      </button>
    </div>
  );
}

```

初次渲染并不会输出“re-render”,只有点击 button 更新组件后才会输出。故每当需要跟踪 React 组件中的状态而该状态不应该触发组件的重新渲染时，都可以使用 React 的 useRef Hooks 为其创建一个实例变量。 而不使用自创对象的原因官网也说明了，useRef 会在每次渲染时返回同一个 ref 对象，但是自创的{current:xxx}每次渲染时都会建立一个新的。

#### 2.1.1 简单的使用

1.渲染计数

React 最令人窒息的问题，大概就是他的性能了吧。它的性能简直就是磨人的小妖精，哪怕脑子再清醒，你也很难去判断一个组件在一堆“屎山”之下会更新、渲染几次，直到某一天性能崩溃，你才想起回头看看究竟是怎么回事。 所以我们希望能有一个东西能随时帮我们计算渲染的次数，那么怎么实现这个东西呢，如果用状态的话：

```
const useRenderTimes = () => {
  const [times, increment] = useReducer(v => v + 1, 0);
  increment(); // 每次渲染的时候递增一下
  return times;
};


```

over，你的浏览器宣告死亡，直接原地 360 度卡死，这种在渲染中调用状态更新无疑会触发下一次渲染，形成一个死循环，所以这时我们就要用到不会触发更新的可变容器：ref

```
const countRenderTimes = () => {
    const times = useRef(0);
    times.current++;
    return times.current
  }


```

这样就可以实现一个简单的渲染计数方法，其实在函数外调用一个普通变量也可以实现这个功能，但是这样我们的函数就是不可复用的，每次复用都要手动在函数外定义一个变量，而且这只是一个简单的组件，如果是一个逻辑复杂的组件，频繁的在外面定义变量，并不是一个好方法。 提到 React 的渲染机制，想到一个工具，叫[Why-you-did-render](https://github.com/welldone-software/why-did-you-render#readme),他能够在开发过程中实时提醒开发者是否产生了不必要的渲染，有兴趣可以在项目上配置一个，可以帮助我们开发的过程中实时注意性能的优化。

2、解决闭包

```
function Counter() {
  const \[count, setCount\] = useState(0);

  const log = () => {
    setCount(count + 1);
    setTimeout(() => {
      console.log(count);
    }, 3000);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={log}>Click me</button>
    </div>
  );
}
```

上面这段代码，连续点击三次后，输出值：0、1、2。原因很简单，就是由于 function 中的 state 并没有 this 引用，setTimeout 每次都引用的是闭包中的值，虽然最新的值发生了变化，但是在旧的渲染里，值依然是上一个值，那么如何输出每次递增的值呢？这里就可以引入 useRef:

```
function Test() {
  const count = useRef(0);

  const log = () => {
    count.current++;
    setTimeout(() => {
      console.log(count.current);
    }, 3000);
  };

  return (
    <div>
      <p>You clicked {count.current} times</p>
      <button onClick={log}>Click me</button>
    </div>
  );
}
```

通我们利用`useRef来`创建的一个接收对象，其值只有一份，而且在所有 Rerender 之间共享。

所以我们对  `count.current`  赋值或读取，读到的永远是其最新值，而与渲染闭包无关，因此每次拿到的都会是最新渲染的值。

### 2.2 React UseRef && Dom

接下来让我们回归到最原始的 Ref 使用：Dom。通常情况下每当必须与 HTML 元素进行交互时，我们都会选择使用 React 的 ref。React 本质上是声明性的，但是有时您需要从 HTML 元素读取值，与 HTML 元素的 API 交互，甚至必须将值写入 HTML 元素。对于这些罕见的情况，您必须使用 React 的 refs 以强制性而非声明性的方式与 DOM 进行交互。

#### 2.2.1 简单的展示 Ref 与 Dom 的交互：

```
function Test() {
  return (
    <App      
      label="Label"
      isFocus
    />
  );
}
 
function App({ label, isFocus }) {
  const refs = useRef();//（1） 
 
  useEffect(() => {
    if (isFocus) {
    console.log(refs);
      refs.current.focus()//（3）
    }
  }, \[isFocus\]);
 
  return (
    <label>
      //（2）
      {label}: <input type="text"  ref={refs} />
     
     {/* ref对象提供给HTML元素作为ref HTML属性。React为我们自动将此HTML元素的DOM节点分配给ref对象。 */}
     
    </label>
  );
}
```

```
这是要一个获取input焦点是最常见的ref与dom的交互。
```

我们使用 useRef Hook 创建一个 ref 对象（1）并且不设置初始值，因为赋值这一步会在（2）中完成，在该步骤中，我们将 ref 对象作为 HTML 属性提供给 HTML 元素。React 为我们自动将此 HTML 元素的 DOM 节点分配给 ref 对象。最后步骤（3）中，我们可以使用 DOM 节点（现在已将其分配给 ref 的当前属性）与其 API 进行交互。

```


```

通过 ref 获取 dom 的 width：

```
function Test() {
    const [text, setText] = useState('Some text ...');
   
    function handleOnChange(event) {
      setText(event.target.value);
    }
   
    const ref =useRef();
   
    useEffect(() => {
      const { width } = ref.current.getBoundingClientRect();
      document.title = `Width:${width}`;
      console.log("ref",ref.current.getBoundingClientRect().width)
    }, [text]);
   
    return (
      <div>
        <input type="text" value={text} onChange={handleOnChange} />
        <div>
          <span ref={ref}>{text}</span>
        </div>
      </div>
    );
  }
```

和上面一样，我们使用 useRef Hook 初始化 ref 对象，在 React 的 JSX 中使用它来将 ref 的当前属性分配给 DOM 节点，最后通过 React 的 useEffect Hook 读取组件的第一个渲染的元素宽度，然后就能够在浏览器的标签中看到元素的宽度作为标题。

#### 2.2.2 ：点击弹窗外使弹窗关闭

利用 ref 与 dom 的奇妙关系，可以简单的实现一个中后台常见的 modal 展示情况：

总共分成四步：

- 使用 useRef 引用 Modal 节点
- 全局添加一个监听事件
- 检测是否在元素外边发生点击
- 点击 modal 外的时候，关闭 modal

第一步：在当前组件被渲染的时候，我们可以通过 modalRef.current 就可以获取 DOM 节点

```
const ref = useRef(null);

<div ref={ref} id="modal">
     
    <Modal isShow={isShow}></Modal>
 
</div>

```

第二步：在 window 上添加了点击监听，监听整个页面的事件。在组件移除的时候，一定要移除绑定的全局事件，不然可能会造成内存泄漏或者未知的错误

```
useEffect(() => {
  function handler(event) {
    console.log('event', event)
  }
  window.addEventListener('click', handler)
  return () => window.removeEventListener('click', handler)
}, [])


```

第三步：当事件点击时，回调函数的入参是 Event 对象，这个对象包含了点击事件的一系列信息。通过 event.target 获取到当前点击的元素，检测 modal 元素是否包含 event.target 即可.

```
 useEffect(() => {
    function handler(event) {
      if (ref.current.contains(event.target)) {
       callback();
      }
    }
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler)
  }, [callback, ref]);


```

对该方法进行封装，封装为一个自定义的 hook，触发 clickOutside 的时候，函数内部在 window 上绑定了监听事件，点击时判断点击元素是否在 ref 对应 DOM 结构中：如果不是在对应 DOM 结构中，就触发传入的回调函数。

```
function useOnClickOutside(ref, callback) {
  useEffect(() => {
    function handler(event) {
      if (ref.current.contains(event.target)) {
             callback();
      }
    }
  window.addEventListener('click', handler);

  return () => window.removeEventListener('click', handler)
  }, [callback, ref]);
}


```

第四步：在检测到在 modal 外点击的时候，执行 setIsOpen(false)关闭弹窗

```
function Test() {
  const [isShow, setIsShow] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsShow(false));
  return (
    <div>
      <button onClick={() => setIsShow(true)}>
       展示Modal
      </button>
      <div ref={ref} id="modal">
        <ModalFn isShow={isShow}></ModalFn>
      </div>
    </div>
  );
}


```

以上就是 useRef 一些个人认为比较有趣的使用，当然，他还有别的好处，比如利用 Ref 保证耗时函数依赖不变，同时也可以在各种库中看到它的身影, 比如 react-use 中的 useInterval , usePrevious 等等，在 antd 中 ref 的使用也非常常见。

有兴趣可以看看这篇文章，写的非常精彩[《Function Component 入门》](https://juejin.cn/post/6844903854174109703#heading-18)

参考：[《Function Component 入门》](https://juejin.cn/post/6844903854174109703#heading-18)

众所周知，React 的声明式渲染机制把复杂的 DOM 操作抽象为简单的 state 和 props 的操作，一时圈粉无数，一夜间将前端工程师从面条式的 DOM 操作中拯救出来。

尽管我们一再强调在 React 开发中尽量避免 DOM 操作，但在一些场景中仍然无法避免。当然 React 并没有把路堵死，React 支持一个特殊的、可以附加到任何组件上的  ref  属性。此属性可以是一个由  [React.createRef()  函数](https://zh-hans.reactjs.org/docs/react-api.html#reactcreateref)创建的对象、或者一个回调函数、或者一个字符串（遗留 API）。当  ref  属性是一个回调函数时，此函数会（根据元素的类型）接收底层 DOM 元素或 class 实例作为其参数。这能够让你直接访问   在 render 方法中创建的 DOM 元素或组件实例。为了能更了解以便更好的使用 ref，下面我将分别从`数据结构`、`生命周期`两个角度探讨`ref。`

## ref 的数据结构

### 1\. string 类型的 ref（React v16.3 之前）

```
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.StringRef.focus();
  }
  render() {
    return <input ref="StringRef" />;
  }
}
```

refs 是所有注册过的 ref 的一个集合，这种 string 类型的 ref 将会被废弃,原因是：  
1） 因为它无法直接获取 this 的指向。  
所以，React 需要持续追踪当前 render 的组件。这会让 React 在性能上变慢；  
2）当使用 render 回调函数的开发模式，获得 ref 的组件实例可能与预期不同，比如：

```
class App extends React.Component {
  renderRow = (index) => {
  // ref会绑定到DataTable组件实例，而不是App组件实例上
  return <input ref={'input-' + index} />;
  }
  render() {
     return <DataTable data={this.props.data} renderRow={this.renderRow} />
  }
}
```

3）对于静态类型较不友好，当使用 string ref 时，必须显式声明 refs 的类型，无法完成自动推导。

当然也有其他原因使 React 团队决定在未来放弃 string Ref，可以看这两个 issues:_[https://github.com/facebook/react/issues/1373](https://github.com/facebook/react/issues/1373)    _[https://github.com/facebook/react/pull/8333#issuecomment-271648615](https://github.com/facebook/react/pull/8333#issuecomment-271648615)\_\_

### 2\. function ref（React v16.3 之前）

```
class MyComponent extends React.Component {
  componentDidMount() {
    this.methodRef.focus();
  }
  render() {
    return <input ref={(ele) => {
      this.methodRef = ele;
    }} />;
  }
}
```

作为 function 时，仅仅是在不同生命周期阶段被调用的回调函数。

### 3.通过 React.createRef()创建 ref:

```
this.webview = React.createRef();
// 引用
<WebView ref={this.webview} />
// 获取当前节点
console.log(this.webview.current);
```

直接看 React.createRef 的源码：

```
function createRef(): RefObject {
    const refObject = {
     current: null, 
    };   
    return refObject; 
}
```

可以看出，创建的 ref 对象仅仅包含 current 属性,表示获取的 DOM 元素或组件实例。

### 4.useRef

useRef 返回一个可变的 ref 对象，其  .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。  
即每次返回的 ref 对象都是一开始传入的。

```
const refContainer = useRef(initialValue); 
inputEl.current.focus(); 
<input ref={inputEl} type="text" />
```

可以再看看 useRef 的源码，moute 与 update 阶段对应两个函数

```
function mountRef<T>(initialValue: T): {|current: T|} {   
  // 获取当前useRef hook   
  const hook = mountWorkInProgressHook();   
  // 创建ref 
  const ref = {current: initialValue}; 
  hook.memoizedState = ref;   
  return ref; 
} 


function updateRef<T>(initialValue: T): {|current: T|} {   
  // 获取当前useRef hook   
  const hook = updateWorkInProgressHook();   
  // 返回保存的数据   
  return hook.memoizedState; 
}
```

可以看到，ref 对象确实仅仅是包含 current 属性的对象。

关联知识点：1）hook 如何保存数据  
FunctionComponent 的 render 本身只是函数调用。  
那么在 render 内部调用的 hook 是如何获取到对应数据呢？  
比如：

- useState 获取 state
- useRef 获取 ref
- useMemo 获取缓存的数据

答案是：每个组件有个对应的 fiber 节点（可以理解为虚拟 DOM），用于保存组件相关信息。每次 FunctionComponent render 时，全局变量 currentlyRenderingFiber 都会被赋值为该 FunctionComponent 对应的 fiber 节点。所以，hook 内部其实是从 currentlyRenderingFiber 中获取状态信息的。  
2）那么多个 hook 如何获取自己的数据呢？  
答案是：currentlyRenderingFiber.memoizedState 中保存一条 hook 对应数据的单向链表。当 FunctionComponent render 时，每执行到一个 hook，都会将指向 currentlyRenderingFiber.memoizedState 链表的指针向后移动一次，指向当前 hook 对应数据。  
这也是为什么 React 要求 hook 的调用顺序不能改变（不能在条件语句中使用 hook） —— 每次 render 时都是从一条固定顺序的链表中获取 hook 对应数据的。

## ref 的生命周期（只涉及 function 、 {current: any}对象这两种 ref 的数据结构）

在 React 中，HostComponent、ClassComponent、ForwardRef 可以赋值 ref 属性。

```
// HostComponent 
<div ref={domRef}></div> 
// ClassComponent / ForwardRef 
<App ref={cpnRef} />
```

其中，ForwardRef 只是将 ref 作为第二个参数传递下去，没有别的特殊处理:

```
secondArg为传递下去的ref 
  const children = forwardRef(   
    (props, secondArg) => {     
     //render逻辑... 
    }    
);
```

接下来讨论 ref 的生命周期时不再讨论 ForwardRef。  
React 的渲染包含两个阶段：  
1.render 阶段：为需要更新的组件对应 fiber 打上标签（effectTag）  
2.commit 阶段：执行 effectTag 对应更新操作  
和其他 effectTag 对应操作的执行一样，ref 的更新也是发生在 commit 阶段  
所以，ref 的生命周期可以分为两个大阶段：

- render 阶段：为含有 ref 属性的 Component 对应 fiber 添加 Ref effectTag

组件对应 fiber 被赋值 Ref effectTag 需要满足的条件：  
1）fiber 类型为 HostComponent、ClassComponent、ScopeComponent（详见[https://github.com/facebook/react/pull/16587）](https://github.com/facebook/react/pull/16587%EF%BC%89)  
2）对于 mount，workInProgress.ref !== null，即组件首次 render 时存在 ref 属性  
3）对于 update，current.ref !== workInProgress.ref，即组件更新时 ref 属性改变

- commit 阶段为包含 Ref effectTag 的 fiber 执行对应操作：

又分为两个子阶段：  
1）移除之前的 ref  
调用的是 commitDetachRef：

```
function commitDetachRef(current: Fiber) {   
  const currentRef = current.ref;  
  if (currentRef !== null) {     
    if (typeof currentRef === 'function') {      
    // function类型ref，调用他，传参为null       
    currentRef(null); 
    } else {       
    // 对象类型ref，current赋值为null       
    currentRef.current = null; 
    } 
  } 
}
```

可以看到，function 与{current: any}类型的 ref 的生命周期并没有什么不同，只是一种会被调用，一种会被赋值。  
对于 Deletion effectTag 的 fiber（对应需要删除的 DOM 节点），需要递归他的子树，对子孙 fiber 的 ref 执行类似 commitDetachRef 的操作。  
2）更新 ref  
执行这一步的操作叫 commitAttachRef：

```
function commitAttachRef(finishedWork: Fiber) {   
  // finishedWork为含有Ref effectTag的fiber   
  const ref = finishedWork.ref;     
  // 含有ref prop，这里是作为数据结构   
  if (ref !== null) {     
    // 获取ref属性对应的Component实例     
    const instance = finishedWork.stateNode;     
    let instanceToUse;     
    switch (finishedWork.tag) {       
      case HostComponent:         
      // 对于HostComponent，实例为对应DOM节点         
      instanceToUse = getPublicInstance(instance);         
      break;       
    default:          
    // 其他类型实例为fiber.stateNode       
    instanceToUse = instance; 
  }   
  // 赋值ref    
  if (typeof ref === 'function') {   
    ref(instanceToUse);    
  } else {     
    ref.current = instanceToUse;
  }  
 } 
}
```

可以看到，对于包含 ref 属性的 fiber，针对 ref 的不同类型，执行调用/赋值操作。  
到这里，ref 的生命周期就完成了。

React refs 到此就全部介绍完了，在 React16 版本中引入了 React.createRef 与 React.forwardRef 两个 API，有计划移除老的 string ref，使 ref 的使用更加便捷与明确。如果你的应用是 React16.3+ 版本的 ClassComponent，那就放心大胆使用 React.createRef 吧；如果你的应用是 React16.3+ 版本的 FunctionComponent，可以使用 useRef（因为`createRef`  并没有 Hooks 的效果，其值会随着 FunctionComponent 重复执行而不断被初始化）；如果暂时没有的话，建议使用 callback ref 来代替 string ref。

参考博文：[https://blog.csdn.net/weixin_39388536/article/details/108447625](https://blog.csdn.net/weixin_39388536/article/details/108447625)

[https://juejin.cn/post/6844903646547853319](https://juejin.cn/post/6844903646547853319)

相关文章：[https://zhuanlan.zhihu.com/p/266195161](https://zhuanlan.zhihu.com/p/266195161)
