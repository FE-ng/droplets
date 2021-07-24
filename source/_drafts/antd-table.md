# 1\. antd 表格组件的性能问题与原因

antd 的 table 组件在使用时，由于自身的缺陷难免会发生一些问题。比如在单页数据量过大，并且行渲染要素过多时，往往会出现卡顿的现象；并且无法支持市面上常见网页的无限上拉加载并快速滚动的功能。  
这两个问题的原因十分简单：antdTable 自身的渲染方式过于简单，对大数据量展示的优化不足——200 行数据就会渲染出 200 行的 dom，1000 行也即会渲染出 1000 行。如果每行中再包含多个 render 函数与图片或其他各种嵌套的复杂组件，那么整个页面的 dom 树会变得及其庞大——这也意味着浏览器需要极长的时间来分析 dom 树，并且在后续进行滚动操作时，需要较长的时间进行更新 dom 与重新布局、绘制。对用户来说就会感觉卡顿、内存被浏览器大量占用，页面滚动丢帧、甚至严重时可能导致浏览器假死。

![](https://ss.csdn.net/p?https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqV6B9SNRbyQflzvDFfqbdftkTAuicIQyt9QSfLtpduuIPibrqbJDrkb932dZGul9T5pibcVxhfIdmSHg/640?wx_fmt=png)

而对于 react 来说，事情可能更糟糕。react 采用 virtual-dom 与 diff 算法来优化 dom 渲染，代价便是 virtual-dom 会被保存在内存中。对已经计算好的 dom 树进行批量变更时，将要 diff 的 virtual-dom 将会带来极大的内存开销。而在 table 中包含大量组件时，这个臃肿的页面仅仅是存在就会带来极大的内存压力。

# 2\. react-virtualized 是如何解决该问题的  

问题的关键是 dom，只有减少 dom 渲染才能同时减少 virtual-dom 与浏览器渲染布局的开销，但是怎么才能减少 dom 树的大小呢？单页要求展示的数据量摆在那里，总不能对用户说：“对不起，我们单页只支持展示 20 条数据，多于 20 条请翻页”吧。  
用户浏览器的视口是有限的，我们即使只渲染部分数据去‘糊弄’用户，看起来也是一样的。因此我们可以类似条件渲染的方式，将数据分段——渲染出的 dom 只包含一段数据，在上拉或者下拉的时候，将这批数据替换掉，这样就万事大吉了！这也正是 react-virtualized 的思想：即使用掉一些额外的开销去监听用户对列表的操作，替换列表的数据，控制列表的位置，但与不进行优化直接渲染出大量 dom 的开销比起来简直可以说是九牛一毛。  
具体一点的解释是这样的：首先计算各子元素的宽高，获取各子元素 index 和偏移距离的映射。用户在父元素内进行滚动时，监听 offsetTop，计算当前渲染的子元素对应的 index，在合适的时机将不在显示范围内的子元素替换掉。这种方式渲染出的子元素 dom 数量远远少于数据行数，只要给用户留下快速向上/向下滚动的余地即可(过快时可能出现短暂的空白)。1000 行的列表，用户的屏幕中有 10 行内容显示，打开控制台可以看到渲染的 dom 仅仅只有 20 行左右。

具体的源码分析感兴趣的可以参考本文总结部分的[链接](https://github.com/dwqs/blog/issues/72)。

# 3\. react-virtualized 组件的简单介绍

我将 react-virtualized 的基础组件划分为两大类：第一类是 Collection 与 Masonry，这两种组件的子元素长宽均可自定义，做出来的效果比较炫酷有种贴纸墙或者瀑布图的感觉，本文目的是寻找 table 的替代品，因此不多赘述。

![](http://wiki.sftcwl.com/download/attachments/35858302/image2020-4-13_9-32-22.png?version=1&modificationDate=1594013645000&api=v2)

第二大类是 Grid 与对其进行封装的 List 与 Table。List 的数据只有一个维度，只有行，没有列的概念。Table 则跟我们要优化的 antd 表格比较类似，有固定的表头，用行列来划分数据。

![](http://wiki.sftcwl.com/download/attachments/35858302/image2020-4-13_9-33-40.png?version=1&modificationDate=1594013645000&api=v2 'SFTC-FE > antd长表格性能优化方案 react-virtualized > image2020-4-13_9-33-40.png')

一个简单的，仅包含必要属性的 Grid 使用例如下：

```
// 数据 略
const data = \[\]; 


// 接收行列序号及key与样式来渲染出特定的单元格
const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
  return (
    <div
      key={key}
      style={style}
    >
      {data\[rowIndex\]\[columnIndex\]}
    </div>
  )
}


<Grid
   cellRenderer={cellRenderer}
   columnCount={列数}
   columnWidth={列宽}
   height={显示高度}
   rowCount={总行数}
   rowHeight={行高}
   width={显示宽度}
/>
```

与基础组件配套使用的是官方提供的几个高阶组件，在这里介绍 AutoSizer，MultiGrid，ScrollSync 与 InfiniteLoader

AutoSizer 是用来自动调节其内部基础组件宽高的高阶组件，可以防止页面 resize 时基础组件的宽高不发生变化，使用也很简单

```
<AutoSizer>
  {({width, height}) => (
	// 将宽高传给该基础组件
  )}
</AutoSizer>
```

MultiGrid 与 ScrollSync 组件都可以实现 fix 行/列的需求，MultiGrid 是在 Grid 的基础上增加了 fixedColumnCount 与 fixedRowCount 两个属性，但是按照行列号的数据读取方式颇为别扭，如果从 antd 表格转过来可能需要改动接口。

ScrollSync 组件则是将多个 table 的滚动通过 onScroll 与 scrollTop/scrollLeft 来进行同步，达到滚动操作同时作用于多个基础组件的效果，但是实际从视觉上来讲可能会有一些延迟。

```
<ScrollSync>
      {({ // 在基础组件中接收这些属性来实现滚动的同步，另外ScrollSync内部也可以套接例如AutoSizer的其他高阶组件进行使用
        clientHeight,
        clientWidth,
        onScroll,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
      }) => (
        <div className="Table">
          <div className="LeftColumn">
            <List scrollTop={scrollTop} {...props} />
          </div>
          <div className="RightColumn">
            <Grid onScroll={onScroll} {...props} />
          </div>
        </div>
      )}
 </ScrollSync>
```

InfiniteLoader 是用来实现无限滚动加载场景的，只要在识别到数据不足以展示时去请求新的数据就可以了

```
<InfiniteLoader
  isRowLoaded={是否加载完成}
  loadMoreRows={加载新数据的函数}
  rowCount={总数据行数}
>
  // 基础组件
</InfiniteLoader>
```

# 4\. 总结

上文对使用 react-virtualized 进行优化的原因和方法进行了简单探讨，详细的 demo 和文档还请大家前往官方网站观看。官网是纯英文的，阅读难度不高，但是 demo 略显啰嗦，github 上的 issue 中能找到使用中大多数的问题，最后希望这篇文章有帮助到您。

github 地址：[https://github.com/bvaughn/react-virtualized](https://github.com/bvaughn/react-virtualized)

demo 地址：[https://bvaughn.github.io/react-virtualized/#/components/Grid](https://bvaughn.github.io/react-virtualized/#/components/Grid)

源代码分析：[https://github.com/dwqs/blog/issues/72](https://github.com/dwqs/blog/issues/72)
