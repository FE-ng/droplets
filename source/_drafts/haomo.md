<!--
 * @Author: your name
 * @Date: 2021-07-09 11:20:07
 * @LastEditTime: 2021-08-11 18:27:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/haomo.md
-->

几乎在前端不会涉及到的二进制类型以及其在前端的应用,例如 arraybuffer 等

- blob 流类型和二进制类型的之间的相互转化
- websocket 的原理、应用以及传递的数据帧的概念

- protobuf 概念和使用
- 动态 pb 的接收和处理,即对方将会发送 pb 文件我们需要先接收并且处理(pbjs 的处理库中并没有处理动态 pb 的部分),通过本地的唯一静态 pb 处理经过原理中的 pb 构造器去完成动态的 pb 文件的构建,完成后再去反序列化二进制数据从而拿到真实的数据 - 项目进行到中期
- 需要使用到地图组件,以及地图组件对应的 mark 和区域改变等功能
- 地理围栏的处理
- 组合动画的使用
- styled-component 的使用和优化
- 对于视频流的理解
- MSE 直播方案及其原理
- video 和 MSE 方案的联系以及使用,video 的切换和布局
- 大屏的视频

1. 视频播放/切换;
2. 切换车辆的数据展示;
3. 地图区域更改运营区域时 车辆自动切换到已有车辆名称列表中排序最小的车;
4. 方向盘的旋转;

5. chrome 提供关于 video 播放的调试信息  
   chrome://media-internals/ 根据 video 标签中的 blob 地址寻找相应的播放;

6. mediaSource 对象的详细解释
   https://www.w3.org/TR/media-source/#parent-media-source;

7. 对于 MSE 方案的部分解析和所需要的视频数据格式分析
   https://axel.isouard.fr/blog/2016/05/24/streaming-webm-video-over-html5-with-media-source;

8. 对于(2)中地址提到的 Initialization Segments 和 Media Segments 两个所需格式 在 MSE 方案的官方文档里面的解释
   https://w3c.github.io/mse-byte-stream-format-webm/;

9. cluster elements
   https://www.ibm.com/support/knowledgecenter/SS8S5A_7.0.11/com.ibm.curam.content.doc/WebClientReference/r_WEBCREF_Reference1Cluster1.html;

10. github 上对于 webm vp9 mse 可播放的库
    https://github.com/hxtmr/live;

更加深入底层的东西

1. Matroska
   https://www.matroska.org/technical/elements.html

2. VP9 编码形式 FFmpeg 对其的实现(C++)
   http://man.hubwiz.com/docset/FFmpeg.docset/Contents/Resources/Documents/api/vp9_8c_source.html#l00474

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811181052.png"  alt="效果图" />

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210811181021.png"  alt="效果图" />
