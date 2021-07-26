<!--
 * @Author: your name
 * @Date: 2021-07-23 17:24:49
 * @LastEditTime: 2021-07-23 17:24:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/turf.md
-->

在物流行业中常见的使用场景是配送区域及地理围栏的绘制，常会有对已有区域进行拆分或者合并的需要，用户通过编辑器进行点、线、面、圆的绘制和编辑,类似这样

![](http://wiki.sftcwl.com/download/thumbnails/37482100/17211f4213f008de.gif?version=1&modificationDate=1604890371000&api=v2 'SFTC-FE > TURF了解一下？ > 17211f4213f008de.gif')![](http://wiki.sftcwl.com/download/attachments/37482100/test.gif?version=1&modificationDate=1604890533000&api=v2 'SFTC-FE > TURF了解一下？ > test.gif')

还有这样，需要实现绘制完成之后，在区域的中心处显示区域名称的

![](http://wiki.sftcwl.com/plugins/servlet/confluence/placeholder/macro?definition=e211bHRpbWVkaWE6bmFtZT3mnKrlkb3lkI0ubW92fQ&locale=zh_CN&version=2)

不难发现，多边形的拆分合并中会有大量且复杂的几何计算，包括点、线、面相互之间的相交、包含等计算。

### 举个例子

在上面的视频事例需要求中心点坐标，我们在可能会思考怎么实现中心的时候想到用数学公式来计算，那么很成功的将一个问题变成两个问题，由怎么用代码实现变成了用什么公式，公式怎么转代码...最终在复习了一遍初高中几何中心，重心，质心的最后，可能下面是这样实现...（也有其他实现方案..）

```
export function getCenterPoint(points:Array<\[number, number\]>) {
  let sum_x = 0;
  let sum_y = 0;
  let sum_area = 0;
  let p1 = points\[1\];
  for (let i = 2; i < points.length; i++) {
    const p2 = points\[i\];
    const area = Area(points\[0\], p1, p2);
    sum_area += area;
    sum_x += (points\[0\]\[0\] + p1\[0\] + p2\[0\]) * area;
    sum_y += (points\[0\]\[1\] + p1\[1\] + p2\[1\]) * area;
    p1 = p2;
  }
  const xx = sum\_x / sum\_area / 3;
  const yy = sum\_y / sum\_area / 3;
  return \[xx, yy\];
}
```

引入 TURF 之后，我们可以这样直接使用...

```
var polygon = turf.polygon(\[\[ \[116.423322, 39.920255\],\[116.430703, 39.897555\],\[116.432292, 39.892353\],\[116.423322, 39.920255\]\]\]);
var center = turf.centerOfMass(polygon);
```

所以,下面我们来简单介绍一下 turf...

### 什么是 Turf？

turf.js 是 Mapbox 公司提出用来处理空间资料分析的开源函式库，迫不及待的小伙伴直接[点击这里](https://turfjs.org/getting-started)

要处理空间资料的手段有很多，常见的方法是使用 QGIS 等软体做资料处理，也可以使用其他程式语言的函式库辅助或手刻，而 turf.js 是一个十分方便轻巧的工具，最棒的是可以用在 webGIS 中，客户端空间资料处理。

它包括测量,坐标变化,图形变换,网格,判断类等 17 个模块，但是要注意，turf 仅能作为基础函数使用，对于特定的场景需要打组合拳，他是面向基础的，不是特性场景的，例如，在处理区域合并的时候，点坐标没有必要完全一致才可以合并，可以适当的降低坐标值的精度。当然了，如果有更复杂的 geo 运算，还是需要更加专业的 geo 团队用更高级别的计算机去处理，毕竟，js 的优势并不在于大数据的计算...

### 如如何使用？

1.  script

    ```
    <script src="turf.min.js" charset="utf-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js"></script>
    ```

2.  npm 支持全量安装和分模块安装

    ```
    npm install turf   import TURF from '@turf/turf'
    npm install @turf/helpers  import helpers from '@turf/helpers'
    ts文件请使用 npm install @types/turf
    ```

3.  使用试例---获取两个多边形的关系

    ```
    intersection.geometry得到下图这样一个对象，所以利用这个工具函数我们可以准确的获知两个区域的关系
    ```

    ![](http://wiki.sftcwl.com/download/attachments/37482100/%E6%88%AA%E5%B1%8F2020-11-06%2010.57.32.png?version=1&modificationDate=1604886684000&api=v2 'SFTC-FE > TURF了解一下？ > 截屏2020-11-06 10.57.32.png')

    具体实现如下：

    ```
    function getPolygonsRelation (callback, opts = {}) {
        var polygonA = TURF.polygon(\[opts.polygonA.path\])
        var polygonB = TURF.polygon(\[opts.polygonB.path\])
        // 获取 polygonA 与 polygonB 交集
        var intersection = TURF.intersect(polygonA, polygonB)
        if (intersection) {
            let geometry = intersection.geometry
            switch (geometry.type) {
                case 'Point':
                    callback && callback({
                        relation: 'pointIntersectant',
                        desc: '相交的（交集为单点）',
                        intersection: geometry,
                        polygonA: opts.polygonA,
                        polygonB: opts.polygonB
                    })
                    return
                case 'MultiPoint':
                    ...相交的（交集为多点）
                    return
                case 'LineString':
                    ...'相切的（交集为单线）',
                    return
                case 'MultiLineString':
                    ...相切的（交集为多线）
                    return
                // 交集为多个多边形
                case 'MultiPolygon':
                    ...相交的（多处交集）
                    return
                // 交集为单个多边形
                case 'Polygon':
                    getPolygonsArea((res) => {
                        // 面积较小多边形
                        let minPolygon = res.polygons\[0\]
                        // 面积较大多边形
                        let maxPolygon = res.polygons\[1\]
                        // 判断 2 个多边形 path 是否一模一样
                        if (MD5(minPolygon.path) === MD5(maxPolygon.path)) {
                            ...相等的
                            return
                        }
                        // 判断较小多边形 path 与交集多边形 path 是否一模一样
                        if (MD5(minPolygon.path) === MD5(geometry.coordinates\[0\])) {
                            ...包含的
                            return
                        }
                        callback && callback({
                            relation: 'intersectant',
                            desc: '相交（一处交集）',
                            intersection: intersection,
                            polygonA: opts.polygonA,
                            polygonB: opts.polygonB
                        })
                    }, {
                        polygons: \[opts.polygonA, opts.polygonB\],
                        order: 'ascend'
                    })
                    return
                default:
                    callback && callback({
                        relation: 'fixedIntersectant',
                        desc: '相交的（多种类型交集）',
                        intersection: geometry,
                        polygonA: opts.polygonA,
                        polygonB: opts.polygonB
                    })
                    return
            }
        } else {
           ...相离的
        }
    }
    ```

### 附：

### 常用 api

```
feature: 我的理解是一个点坐标的信息，后续所有的函数都基于feature
featureCollection： 一组feature


area： 
获取一个或多个feature，并返回其面积平方米。
	var polygon = turf.polygon(\[\[
        \[108.09876, 37.200787\],
        \[106.398901, 33.648651\],
        \[113.715685, 37.845557\],
        \[108.09876, 37.200787\]
      \]\]);
	var area = turf.area(polygon);
distance，rhumbDistance，都是计算两点之间的距离，后者指的是恒向线距离（百度百科:恒向线是地球上两点之间与经线处处保持角度相等的曲线）
cleanCoords: 清除多余点坐标,	就是去重
truncate： 处理坐标精度 let truncated = turf.truncate(point, {precision: 3});
bezierSpline： 柔滑多线段，如在路径规划中，地图导航
difference，intersect，union多边形的差集，交集，并集,
booleanOverlap： 比较相同维数的两个几何图形，如果它们的交集生成的几何图形与两者不同但维数相同，则返回true
等等...
```

利用 turf 的基础函数的组合还可以实现更高级的功能，更高端的玩儿法自己探索吧～～～
