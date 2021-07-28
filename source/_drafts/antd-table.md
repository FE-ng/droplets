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

<!-- 此篇乃小伙伴们在花式踩坑 ant-design 的 Table 组件后，总结的专治对不齐的十全大补丸，望君趁早服用及时康复，如果你还踩出了更多花样对不齐，欢迎臭 jio 的你前来补充。 -->

### 文章目录

- [一：问题概览](https://mp.csdn.net/mdeditor/94007661#_3)
- [二：问题详细描述及 demo](https://mp.csdn.net/mdeditor/94007661#demo_15)

- [1.纵向/列对不齐](https://mp.csdn.net/mdeditor/94007661#1_17)

- [1.1.有列(column)没有设置宽度：表头固定时，导致表头宽度计算错误，表头列和内容列对不齐](https://mp.csdn.net/mdeditor/94007661#11column_19)
- [1.2.语句/单词过长： antd 根据语义/单词断句换行，实际列宽超出了设置的宽度，导致列对不齐；](https://mp.csdn.net/mdeditor/94007661#12_antd_22)
- [1.3.开启了单选功能：单选列表头宽度计算错误，导致列对不齐](https://mp.csdn.net/mdeditor/94007661#13_27)

- [2.横向/行对不齐](https://mp.csdn.net/mdeditor/94007661#2_30)

- [2.1.固定(fixed)列的高度高于普通列：普通列的高度与 fixed 列的高度不同，导致行对不齐；反之没问题](https://mp.csdn.net/mdeditor/94007661#21fixedfixed_31)

- [3.列间有空白间隙/留白](https://mp.csdn.net/mdeditor/94007661#3_34)

- [3.1.列数不固定、需适配不同尺寸屏幕：需适配 4 种情况：小屏列少、小屏列多、大屏列少、大屏列多](https://mp.csdn.net/mdeditor/94007661#314_35)
- [3.2.scroll.x 计算错误:](https://mp.csdn.net/mdeditor/94007661#32scrollx_44)

- [4.双滚动条](https://mp.csdn.net/mdeditor/94007661#4_53)

- [4.1.macOS 在系统偏好设置为 “显示滚动条-滚动时”会出现双滚动条](https://mp.csdn.net/mdeditor/94007661#41macOS__54)

- [三：解决方案代码](https://mp.csdn.net/mdeditor/94007661#_58)

- [1.纵向/列对不齐](https://mp.csdn.net/mdeditor/94007661#1_60)

- [1.1.有列(column)没有设置宽度： 为所有 column 设置 width（或统一赋默认值）](https://mp.csdn.net/mdeditor/94007661#11column_columnwidth_61)
- [1.2.语句/单词过长：](https://mp.csdn.net/mdeditor/94007661#12_65)
- [1.3.开启了单选功能](https://mp.csdn.net/mdeditor/94007661#13_78)

- [2.横向/行对不齐](https://mp.csdn.net/mdeditor/94007661#2_81)

- [2.1.固定(fixed)列的高度高于普通列](https://mp.csdn.net/mdeditor/94007661#21fixed_82)

- [3.列间有空白间隙/留白](https://mp.csdn.net/mdeditor/94007661#3_96)

- [3.1.列数不固定、需适配不同尺寸屏幕：动态设置 fixed，比较列总宽与 table 宽度](https://mp.csdn.net/mdeditor/94007661#31fixedtable_97)
- [3.2.scroll.x 计算错误: 设置 scroll.x 为所有列的总宽度，包括 fixed 列.](https://mp.csdn.net/mdeditor/94007661#32scrollx_scrollxfixed_125)

- [4.双滚动条](https://mp.csdn.net/mdeditor/94007661#4_132)

- [4.1.macOS 在系统偏好设置为 “显示滚动条-滚动时”会出现双滚动条: 自定义滚动条， 滚动条常显](https://mp.csdn.net/mdeditor/94007661#41macOS____133)

# 一：问题概览

序号

异常表现

产生原因

解决方案

1

1.纵向/列对不齐

1.1.有列(column)没有设置宽度

为所有 column 设置 width

2

1.2.语句/单词过长

打破语句与单词，强制折行

3

1.3.开启了单选功能

给单选的表头添加文字，例如“单选”，撑开表头

4

2.横向/行对不齐

2.1.固定(fixed)列的高度高于普通列

1.左侧 fixed 不对齐：检查是否 rowkey 唯一 2.右侧 fixed 不对齐：解决方案 PR 审核中

5

3.列间有空白间隙/留白

3.1.列数不固定、需适配不同尺寸屏幕

动态设置 fixed，比较列总宽与 table 宽度

6

3.2.scroll.x 计算错误

设置 scroll.x 为所有列的总宽度，包括 fixed 列

7

4.双滚动条

4.1.macOS 在系统偏好设置为 “显示滚动条-滚动时”会出现双滚动条

自定义滚动条， 滚动条常显

# 二：问题详细描述及 demo

## 1.纵向/列对不齐

##### 1.1.有列(column)没有设置宽度：表头固定时，导致表头宽度计算错误，表头列和内容列对不齐

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154214.png"  alt="效果图" />

##### 1.2.语句/单词过长： antd 根据语义/单词断句换行，实际列宽超出了设置的宽度，导致列对不齐；

错误 demo❌  
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154255.png"  alt="效果图" />
正确 demo✅  
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154314.png"  alt="效果图" />

##### 1.3.开启了单选功能：单选列表头宽度计算错误，导致列对不齐

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154330.png"  alt="效果图" />

## 2.横向/行对不齐

##### 2.1.固定(fixed)列的高度高于普通列：普通列的高度与 fixed 列的高度不同，导致行对不齐；反之没问题

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154344.png"  alt="效果图" />

## 3.列间有空白间隙/留白

##### 3.1.列数不固定、需适配不同尺寸屏幕：需适配 4 种情况：小屏列少、小屏列多、大屏列少、大屏列多

为了适配小屏多列，我们会 fixed 某些列，column 设置的 width 由比例变为 px。  
当切到大屏时，同样列数宽度可能铺不满表格

小屏多列，适合 fixed demo✅

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154356.png"  alt="效果图" />
大屏同样列数，留白 demo❌  
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154406.png"  alt="效果图" />

##### 3.2.scroll.x 计算错误:

antd 文档：

> 建议指定 scroll.x 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过 scroll.x

个人建议：设置 scroll.x 为所有列的总宽度，包括 fixed 列.

（这里有一条我们自己系统的代码需要检查的点：检查 TableContainer 组件是否留有 buffer，有的话移除）  
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154426.png"  alt="效果图" />

## 4.双滚动条

##### 4.1.macOS 在系统偏好设置为 “显示滚动条-滚动时”会出现双滚动条

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210728154437.png"  alt="效果图" />

# 三：解决方案代码

## 1.纵向/列对不齐

##### 1.1.有列(column)没有设置宽度： 为所有 column 设置 width（或统一赋默认值）

```
const width = item.width || 100;
```

##### 1.2.语句/单词过长：

a.打破语句与单词，强制折行;

```
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 16px 16px;
  word-break: break-word;
  -ms-word-break: break-all;
}
```

b.当 column 自定义了 render，并在 render 中嵌套了 dom 元素,需在 dom 内联样式中设置

```
 word-break: break-word；
```

##### 1.3.开启了单选功能

给单选的表头添加文字，例如 demo 中的“单选”，撑开表头

## 2.横向/行对不齐

##### 2.1.固定(fixed)列的高度高于普通列

a. 左侧 fixed 不对齐：确保 rowKey 唯一性。  
当 row 无唯一 key 时，rowkey 值用 random 或 new Date()方式生成，虽然不会再报错 rowKey 不唯一，但是因为是动态数据，导致无法找到指定 fixed tr 为其添加 height 值。  
产生问题代码

```
handlerowKey(value: string) {
  return new Date().toDateString() + Math.random() + value;
}
```

b. 右侧 fixed 不对齐：解决方案 PR 审核中  
[https://github.com/ant-design/ant-design/issues/14859](https://github.com/ant-design/ant-design/issues/14859)  
[https://github.com/react-component/table/pull/283](https://github.com/react-component/table/pull/283)

## 3.列间有空白间隙/留白

##### 3.1.列数不固定、需适配不同尺寸屏幕：动态设置 fixed，比较列总宽与 table 宽度

```
<Table
  bordered={true}
  loading={loading}
  columns={this.state.columns}
  dataSource={sortTableData ||  tableData}
  rowKey="tc_code"
  pagination={false}
  scroll={{ x: this.state.scrollWidth}}
  ref={(ref) => { this.refDom = ref; }}
/>
// 获取table宽度
const $tableContainer = ReactDom.findDOMNode(this.refDom);
const tableWidth = ($tableContainer as any).offsetWidth;
// 获取滚动总宽度

const = columnNum * columnWidth;
{
  title: this.props.intl.formatMessage(messages.tc_list),
  dataIndex: 'tc_code',
  key: 'tc_code',
  fixed: scrollWidth > this.state.tableWidth ? 'left' : '',
  width: 150,
}
```

（我们系统代码实现可参考 sds tcDataChart 模块）

##### 3.2.scroll.x 计算错误: 设置 scroll.x 为所有列的总宽度，包括 fixed 列.

（我们的系统代码：检查 TableContainer 组件是否留有 buffer，有的话移除）

```
// 预留20 buffer
this.x = this.x + 20;
```

## 4.双滚动条

##### 4.1.macOS 在系统偏好设置为 “显示滚动条-滚动时”会出现双滚动条: 自定义滚动条， 滚动条常显

```
::-webkit-scrollbar{
  width:12px;
  height:12px;
}
::-webkit-scrollbar-track-piece {
  background-color: #f8f8f8;
}
::-webkit-scrollbar-thumb{
  border: 3px solid #f6f6f6;
  background-color: #ccc;
  -webkit-border-radius:20px;
}
::-webkit-scrollbar-thumb:active{
  -webkit-border-radius:20px;
  background-color: #7f7f7f;
}
::-webkit-scrollbar-corner {
  background-color: #f6f6f6;
  -webkit-border-bottom-right-radius: 5px;
}

.navigation::-webkit-scrollbar {
  width: 3px;
  height: 0px;
}
.navigation::-webkit-scrollbar-button {
  display: none;
}
.navigation::-webkit-scrollbar-track-piece {
  background-color: #404040;
}
.navigation::-webkit-scrollbar-thumb {
  border: 1px solid rgb(52, 143, 247);
  background-color: rgb(52, 143, 247);
  -webkit-border-radius: 3px;
  border-radius: 3px;
}
```
