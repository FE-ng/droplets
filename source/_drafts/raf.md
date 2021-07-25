<!--
 * @Author: your name
 * @Date: 2021-07-23 17:27:48
 * @LastEditTime: 2021-07-23 17:27:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/raf.md
-->

RAF

window.requestAnimationFrame(callback) 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行   ---  [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)

**简而言之就是**：系统渲染前执行在**RAF 里注册的函数**。

由此推断：最大调用频率 = 浏览器渲染频率。

## 帧率检测

大多数人日常使用的 PC 显示器，都是 60hz，60hz 意味着刷新频率为每秒 60（我们可以理解为：**刷新率=帧率**），也指 60FPS(帧率)。任何图像都会以最高每秒 60 的速度来进行刷新。

一个静态页面，浏览器作为 HTML 的”渲染器“，也是以这个速度来自动渲染前端界面的，它是无法超出硬件设备频率上限的。

关于刷新率，业内已经出现很多 144HZ 显示器、90/120HZ 手机屏，刷新率高也意味着能做更流畅的交互动画，不同的刷新率会造成不同的渲染开销。

60hz vs 144hz 刷新率对比：

![](http://wiki.sftcwl.com/download/attachments/39439913/fps.jpg?version=1&modificationDate=1606286495000&api=v2 'SFTC-FE > RAF 探索以及 React中的应用 > fps.jpg')

基于 RAF 的原理，我们可以实现一个检测我们页面帧率的方法：

```
 let frame = 0;
 let lastTime = Date.now();
 let lastFrameTime = Date.now();
 const loop = function () {
   const now = Date.now();
   const fs = (now - lastFrameTime);
   lastFrameTime = now;
   frame++;
   if (now > 1000 + lastTime) {
      const fps = Math.round((frame * 1000) / (now - lastTime));
      console.log(\`FPS：\`, fps);
      // document.getElementById('fps').innerHTML = fps;
      frame = 0;
      lastTime = now;
    };
    window.requestAnimationFrame(loop);
 }
loop();
```

[帧率检测代码](https://codesandbox.io/embed/raf-fps-tsepo?fontsize=14&hidenavigation=1&theme=dark&view=preview)

## 帧率控制

我们知道,RAF 中可以注册 callback, 实现很多 js 渲染逻辑，用来更新 UI。  
同时呢，我们的 js 执行是需要消耗时间的，如果每次执行耗时特别长，就会影响我们的系统调用频率（RAF 下调用），进而影响每秒渲染次数，造成页面刷新率下降。

通过计算我们可得知：

```
// 60HZ
1000/60 = 16.6ms


// 144HZ
1000/144 = 6.9ms

// 90HZ
1000/90 = 11ms
```

即：要想满足 60HZ 刷新率，每次 RAF 渲染耗时都不能超过 16.6ms。同理 144HZ 为 6.9ms，90HZ 为 11ms。

那么，60fps 流畅渲染的基本框架：

```
// 控制渲染帧率=60 的基本框架：
function renderFunction(){
    // 执行渲染逻辑，且保证耗时不能超过16.6ms
    // ...渲染逻辑：dom操作等等


    // 注册下一次渲染
    raf(renderFunction)
}
renderFunction();
```

有了基本框架，我们可以做一些其他尝试：将刷新率控制在 30FPS、25FPS、以及任意数值（不大于 60）：

```
// 示例：25帧率渲染


    const FPS = 25;
    let frame = 0;
    let lastTime = Date.now();
    let lastFrameTime = Date.now();
    let drawCount = 0;

    const limit = 1000 / FPS;

    function renderFunction(){
        const now = Date.now();
        const fs = now - lastFrameTime;
        
        // 注册下一次系统调用，但渲染处理在下面
        window.requestAnimationFrame(loop);

        // 满足条件，进行渲染操作
        if (fs > limit) {
            lastFrameTime = now - (fs % limit);
            drawCount++;
            // do draw function
            if (now > 1000 + lastTime) {
                console.log("1S: ", drawCount);
                lastTime = now;
                drawCount = 0;
            }
        }
    }
    renderFunction();
```

[fps 帧率控制为 25](https://codesandbox.io/s/angry-elbakyan-9dlrw?file=/src/index.ts)

## React 与 RAF

到此为止，我们对 RAF 有了一定的了解，再尝试对 React 中对**RAF**的运用进行一些解读。 在**ReactV16.10**之前，主要是**Scheduler**调度模块部分对 RAF 进行运用。

### V16.9 - Scheduler

关于调度的内容，在之前的分享[什么是 React Fiber ](http://wiki.sftcwl.com/pages/viewpage.action?pageId=39423279)中有部分介绍，我们再陈述一些关键点：

> ```
> 调度器是为了管控渲染task,可以更细粒度进行任务执行（包括渲染ui)，最大程度提高UI流畅度。
> ```
>
> 为了达成这一目标，需要一个可随时中断渲染，恢复后可继续执行渲染的调度逻辑。
>
> 完成这个逻辑需要简单分 2 部分：
>  1  一个数据结构能支撑这样的运转  (fiber)
>  2  调度管理逻辑(scheduler 模块)
>
> ```
>
> ```

由于篇幅有限，Fiber 就不进行解读了，可以看之前的文章，我们对调度管理进行解读：

其实浏览器有 RAF、[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)系统级 api，可以实现渲染逻辑管理，大部分情况下都是够用的。

但 React（最新版）这块并没有直接使用，而是自己实现了更细的处理（比如 task 优先级,跟 fiber 数据结构结合的逻辑处理）

**Scheduler 代码：**

```
// 入口函数, 提供给react-dom / react-reconciler（fiber）模块使用。
function unstable_scheduleCallback(priorityLevel, callback, options) {
    // ...前置处理
    
    // task 数据结构准备


    // task注册
    if (startTime > currentTime) {
        // 延迟执行的task, 用requestHostTimeout 注册执行
    }else{
        //立即执行的task, 用requestHostCallback 注册执行
    }
}

function requestHostTimeout(callback){
    // 调用setTimeout 执行task
}

function requestHostCallback(callback){
    // 调用requestAnimationFrame 以及 requestIdleCallback 进行task处理
}
```

以上 是 v16.9 的实现框架，可以看出，用 RAF 进行 task 执行（函数：**requestHostCallback**），与系统频率一致。[细节代码](https://github.com/facebook/react/blob/v16.9.0/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L342)

这里我们可以再思考一个问题，既然做了细粒度的 task 执行频率管控，为什么就要一定限制在系统级呢（60fps 下每帧 16.6ms），为什么不能更小的执行耗时，比如 10ms 一次。这个问题在新版 scheduler 中解决掉了。

## V16.10 - Scheduler

在 ReactV16.10 以及之后，Scheduler 对 RAF 的使用进行了调整，详情看[pull16214](https://github.com/facebook/react/pull/16214)

通过对 commit 的解读，我们可以看到，将 RAF 替换，用 postmessage 来进行更细粒度的间隔调用，以方便 React 的细粒度操作：

> 由于 RAF 仰仗显示器的刷新频率，因此使用 RAF 需要看 vsync cycle（指硬件设备的频率）的脸色，
>
> 那么为了在每帧执行尽可能多的任务，采用了 5ms 间隔的消息事件来发起调度，也就是 postMessage 的方式
>
> 这个方案的主要风险是：
>
> 更加频繁的调度任务会加剧主线程与其他浏览器任务的资源争夺
>
> 相较于 RAF 和 setTimeout，浏览器在后台标签下对消息事件进行了什么程度的节流还需要进一步确定，该试验是假设它与定时器有相同的优先级

我们看最新版本的**requestHostCallback**:

```
const channel = new MessageChannel();
const port = channel.port2;
// onmessage 时执行task
channel.port1.onmessage = performWorkUntilDeadline;

function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // postmessage 方式来触发流程, 不再用RAF
    port.postMessage(null);
  }
}
// 关于postmessage，这里可以思考一个点，为什么用postmessage而不是其他（eg: settimeout), postmessage是同步or异步？
```

同时我们在代码中可以看到对帧率的控制：

```
function forceFrameRate(fps) { 
  // 这里做了限制是 0-125帧，   125以上的类似144HZ的电竞显示器没有做支持
  if (fps < 0 || fps > 125) {
    return;
  }
  if (fps > 0) {
    yieldInterval = Math.floor(1000 / fps);
  } else {
    // 默认 5ms
    // reset the framerate
    yieldInterval = 5;
  }
}
```

到目前为止，我们看到 React 中对\`RAF\`应用的变化，从一开始遵循系统渲染频率，到现阶段的自行控制渲染频率，是有一些思路上的变化的,React 注释中也做出了一些介绍：

> 如果主线程上有其他工作，比如用户事件，调度器会定期生成。默认情况下，每帧生成多次（60fps 的情况下每帧 16.6ms, 而调度器 5m 执行一次）。
>
> 它不尝试与帧边界(RAF 中的频率)对齐，因为大多数任务不需要帧对齐；对于那些需要对齐的任务，请使用 requestAnimationFrame
