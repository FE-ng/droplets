---
title: 多标签页面和 @antv/g2 结合使用的bug
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210714184422.png
date: 2021-07-21 17:09:11
---

<!--
 * @Author: your name
 * @Date: 2021-07-21 17:09:11
 * @LastEditTime: 2021-07-21 19:18:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_posts/bugs的启发/g2_多tab页面.md
-->

# 多标签页面和@antv/g2 结合使用的 bug

# 分析原因

由于 react 官方没有像 vue 中 keep:alive 的多标签页解决方案;
实际工作中我们选取了`react-router-cache-route`
该方案会将数据保存一份并使用 display:none 和 display:block 的形式对多 tab 进行切换;
但当我们使用 `@antv/g2`对一些数据进行图片渲染时由于异步数据且 tab 页面会存储 之前的 state,
导致 tab 页面的图表 render 时出现多次渲染,在某一个 container 中渲染得到了多个图表 canvas 的结果;

## Chart 使用

1. 处理数据
2. 实例化 Chart
3. 填充数据
4. 绘制图标横纵轴等信息
5. 绘制

```typescript
const renderChat = () => {
  // 1. 处理数据
  const data = dataDetailList.map((item: IDataDetailList) => ({ type: item.sub_tag_name, value: item.num }));
  // 2. 实例化 Chart
  const chart = new Chart({
    container: 'container',
    autoFit: true,
    height: 500,
  });
  // 3. 填充数据
  chart.data(data);
  // 4. 绘制图标横纵轴等信息
  chart.scale({
    value: {
      max: 20,
      min: 0,
      alias: '标签（个数）',
    },
  });
  chart.axis('type', {
    title: null,
    tickLine: null,
    line: null,
  });

  chart.axis('value', {
    // label: null,
    // ticks:[{value: 1}, {value: 3}, {value: 2}],
    title: {
      offset: 30,
      style: {
        fontSize: 12,
        fontWeight: 300,
      },
    },
    tickLine: {
      length: 5,
    },
    subTickLine: {
      length: 5,
      count: 1,
    },
    grid: {
      // alternateColor: '#f0f0f0',
      // line: 'line',
    },
  });
  chart.legend(false);
  chart.coordinate().transpose();
  chart
    .interval()
    .position('type*value')
    .size(26)
    .label('value', {
      style: {
        fill: '#8d8d8d',
      },
      offset: 10,
    });
  chart.interaction('element-active');
  // 5. 绘制
  chart.render();
};
```

## 问题处理方案构思

### 容器多样化

在实例化容器时我们传入了`container: 'container'`;
这里其实是给 Chart 一个填充的对象 id;
因此猜测由于多页面都是使用同一个组件 使用了同一个 id 的容器进行了渲染填充才导致的过个图标的出现;
结果新进入的标签页没有渲染而第一次打开的标签页却渲染了多次

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721174534.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721174553.png"  alt="效果图" />

审查元素们发现 第一个开启的标签页中共被填充了多次这里我开启了三个标签页,因此出现了三个存储 canvas 的 div

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721174622.png"  alt="效果图" />

既然如此我们将 query 参数取出当做 container 的变量实例化时不就区分了么
结果发现虽然 container 的 id 变了但是第一次打开的标签页的 container 还是被 render 插入了多个 canvas

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721175302.png"  alt="效果图" />

至此第一个方案失败
可能的原因: `react-router-cache-route`的复用机制虽然是使用不同的 dom 节点但不同的 dom 却是使用同一个组件形成的
因此后续 tab 页的图标都被渲染到了首次加载的 tab 页面

### ref

经过容器使用 id 进行区分的挫败,我们可以想到直接使用 dom 呢?
首先得验证是否支持
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721190721.png"  alt="效果图" />

果然 container 也是允许我们传入 dom 节点的那就愉快的使用 useRef()了;
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721191435.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210721191300.png"  alt="效果图" />

确实如我们所预料的基本每个 tab 也都能正常渲染了 但还是会出现以上的情况
定睛一看,这不就是多了上次打开的 tab 也的数据么
说明虽然数据渲染了但是上次的 tab 页面的 render 函数也生效进行了 canvas 的插入
因此我们只需要在每次 render 时将 chart 实例存储起来,然后在 render 之前将 chart 实例 destroy 掉
应该就行了吧

```typescript
import { Chart } from '@antv/g2';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getQueryString } from 'utils/utils';

import selectors from '../selectors';
import { IDataDetailList } from '../types';

function ChartComponent(): JSX.Element {
  const dataDetailList = useSelector(selectors.dataDetailList);
  const queryId = getQueryString('id');

  const chartObj = React.useRef(null);
  const divEle = React.useRef(null);

  const renderChat = () => {
    // chartObj.current?.destroy?.();
    const data = dataDetailList.map((item: IDataDetailList) => ({ type: item.sub_tag_name, value: item.num }));
    const chart = new Chart({
      container: divEle.current,
      autoFit: true,
      height: 500,
    });
    chart.data(data);
    chart.scale({
      value: {
        max: 20,
        min: 0,
        alias: '标签（个数）',
      },
    });
    chart.axis('type', {
      title: null,
      tickLine: null,
      line: null,
    });

    chart.axis('value', {
      // label: null,
      // ticks:[{value: 1}, {value: 3}, {value: 2}],
      title: {
        offset: 30,
        style: {
          fontSize: 12,
          fontWeight: 300,
        },
      },
      tickLine: {
        length: 5,
      },
      subTickLine: {
        length: 5,
        count: 1,
      },
      grid: {
        // alternateColor: '#f0f0f0',
        // line: 'line',
      },
    });
    chart.legend(false);
    chart.coordinate().transpose();
    chart
      .interval()
      .position('type*value')
      .size(26)
      .label('value', {
        style: {
          fill: '#8d8d8d',
        },
        offset: 10,
      });
    chart.interaction('element-active');
    chart.render();
    chartObj.current = chart;
  };

  useEffect(() => {
    if (dataDetailList.length) {
      renderChat();
    }
  }, [JSON.stringify(dataDetailList)]);

  return <div ref={divEle} key={queryId} />;
}

export default ChartComponent;
```

至此我们也得到了最终的方法并且成功处理了 tab 页面之间的影响
