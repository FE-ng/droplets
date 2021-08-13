---
title: Array.from()
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210623160309.png
date: 2021-06-20 13:23:12
categories:
  - javascript
tags:
  - Array.from()
  - api
  - javascript
---

<!--
 * @Author: your name
 * @Date: 2021-07-31 21:00:06
 * @LastEditTime: 2021-08-05 15:16:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/tips.md
-->

峰取自名，溪虽小，但亦能或恬静浪漫或奔流不止生生不息连绵不绝，且小溪终将汇聚成江海，宏伟而壮阔。另峰与溪同属自然之景，互通有无，如鼓琴瑟；此外也寻得一诗“遥知是夜檀溪上，月照千峰为一人”，嗯 美！

入职阿里前一份工作离职证明原件（需在 3 个月内，如超出时间，除提供离职证明原件，需在入职当天现场填写承诺书）。

离职证明需包含四大要素：

**姓名、身份证件号码、最后工作日、公司印章**

姓名：需与有效身份证件姓名一致

身份证件号码：需与有效身份证件姓名一致

最后工作日：需早于入职日

公司印章：上家就职公司的公章，或者人力资源部章

1. 离职总结
2. 东西整理以及处理

   - 热水壶
   - 空气炸锅
   - 电热锅
   - 电饭煲
   - [x]显示器
   - [x]冰箱
   - [x]单车

   - [x]锅碗瓢盆(drop)
   - [x]油米等
   - [x]纸张
   - 吹风机
   - ,------

3. 衣物等随身物品
4. [x]入职前酒店确定
5. [x]理发
6. [x]休假时间确定 剩余 4 天
7. [x]确定吃饭地点 时间 8.8 ---->
8. [x]文件处理打包 云储存
9. [x]个人相关资料备份
10. [x]机票购买

11. [x]倒计时 2 周的周报
12. 杭州租房形式确定
13. 快速适应杭州新环境
14. [x]确定五险一金交付地
15. [x]话费报销
16. [x]邮寄地 回家或者杭州 fn ---> 杭州
17. 手机电影观看

~~[五联西苑，1600 15 1.1.1](https://www.douban.com/group/topic/240645340/)~~
[西荡苑梨苑 5000 10 分钟 3](https://www.douban.com/group/topic/240673012/)
[个人找室友 紫金庭园 朝南两个大卧室 2200 3](https://www.douban.com/group/topic/240577251/)
[嘉绿西苑 4900- 2](https://www.douban.com/group/topic/240096060/)
[美都新村 10-15 分钟 2050 元 2?](https://www.douban.com/group/topic/242088045/)

[五联西苑，1600 15 1.1.1](https://www.douban.com/group/topic/240613388/)
[莲花社区 2500? 10 分钟 1.1.1](https://www.douban.com/group/topic/240879501/)
[东岳公寓独立厨卫 2200 10 分钟 1.1.1](https://www.douban.com/group/topic/242071861/)
[西湖国际 黄龙万科附近大卧室+阳台 2100 合租 1](https://www.douban.com/group/topic/241839434/)
[南都银座公寓 2100 20 分钟 1.1.1](https://www.douban.com/group/topic/242086366/) **9.12 才可入住**
[荷花苑 2000-2600 10 分钟 1.1.1](https://www.douban.com/group/topic/241752765/)
[方易城市心境 2600 6 分钟 1.1.1 ](https://www.douban.com/group/topic/240236082/)

---

1.  - **需求**:【【基础数据】操作日志记录优化】**注意开发联调时间**
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001033481;
    - **进度**: 完成开发公用组件 LogModal; 后端(瑞豪)联调时间为 8.18
    - **分支名**: dev-1.2.4-logOptimize_lf
    - **使用**: 参考 BOMManage/modules/FormTable 中的引用和使用方式;
    - **特点**: 已经和后端瑞豪确定日志 modal 的入参(operateTableId,operateTableName,),出参(表格数据)都保持一致;
    - **注意事项**: 由于供应商的需求(需求 2)先开发上线, 未使用该需求开发的组件, 因此后续会需要处理供应商 SupplierManage 中的日志 modal;

2.  - **需求**:【【基础数据】供应商主数据可视化】**注意需求依赖**
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001032629
    - **进度**: uat
    - **分支名**: dev-v1.1.2-supplier​Manage_lf
    - **注意事项**: 省市区组件需要支持模糊赋值匹配依赖分支(develop_districtsComponent_liqingqing),已经合并

3.  - **需求**:【【基础数据】bom 商品导入时支持虚拟 bom 商品】**注意开发联调时间**
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001033751
    - **进度**: 开发中 后端(瑞豪)联调时间为 8.23;
    - **分支名**:dev-v1.2.4-virtualBOM_lf
    - **注意事项**:更改了 bom 导入模板(子商品数目字体变红) 需求中的日志部分,划分到【【基础数据】操作日志记录优化】中;

4.  - **需求**:【【系统能力搭建】-新增标签管理模块】**已上线**
      https://www.tapd.cn/53174460/prong/stories/view/1153174460001031150
    - **进度**: uat,online
    - **分支名**:dev-v1.1.3-labelManage_lf
    - **注意事项**: 需求的实现有点费神, 后续的更改和需求增加请注意查看对应需求中的代码注释;

5.  - **需求**:【【DataHub 系统优化】数据库管理-数据库表的数据表增加中文名】**前端无需关注**
      https://www.tapd.cn/53174460/prong/stories/view/1153174460001033741
    - **进度**: uat 中
    - **分支名**: 无
    - **注意事项**: 沟通后前端没做更改,后端在 data_table_name 字段里拼接了表格中文名

6.  - **需求**:【【配送订单管理】增加‘强制下发’按钮功能的需求】**需求被挂起**
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001030879
    - **进度**: 需求被挂起
    - **分支名**: 无

tips

跳转到根目录 gu
复制当前地址 yy
截屏 yg
vs 控制超行表现 alt z
command shift l 选择全部
ctrl command i/t

onetab 导入
https://bukaivip.com/index.php/vod/play/id/54078/sid/1/nid/3.html | 在线播放 女神宿舍的管理员。 第 03 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/53609/sid/1/nid/2.html | 在线播放 女友成双 第 02 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/detail/id/27.html | 武庚纪详情介绍-武庚纪在线观看-武庚纪迅雷下载 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/detail/id/54086.html#desc | D_CIDETRAUMEREITHEANIMATION 详情介绍-D_CIDETRAUMEREITHEANIMATION 在线观看-D_CIDETRAUMEREITHEANIMATION 迅雷下载 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/3042/sid/1/nid/1.html | 在线播放 西行纪 第 58 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/48700/sid/3/nid/21.html | 在线播放 斗破苍穹第四季 第 21 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/50514/sid/1/nid/18.html | 在线播放 完美世界 第 18 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/detail/id/54033.html | 红荒详情介绍-红荒在线观看-红荒迅雷下载 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/52948/sid/1/nid/9.html | 在线播放 眷思量 第 09 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！
https://bukaivip.com/index.php/vod/play/id/53842/sid/1/nid/5.html | 在线播放 春秋封神 第 05 集 - 高清资源 - 不开 VIP - 全网 VIP 电影免费看！

https://zhuanlan.zhihu.com/p/352437367 | 关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn? - 知乎
https://segmentfault.com/a/1190000022829431 | npm 之 package.json 解析并执行 - SegmentFault 思否
https://blog.csdn.net/u011240877/article/details/76582670 | npm 与 package.json 快速入门教程*张拭心的博客 shixinzhang-CSDN 博客\_npm package.json
https://github.com/settings/profile | Your Profile
https://segmentfault.com/q/1010000004124678 | js 获取对象的类型 - SegmentFault 思否
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dates/index.d.ts | DefinitelyTyped/index.d.ts at master · DefinitelyTyped/DefinitelyTyped
https://github1s.com/protobufjs/protobuf.js | [Preview] README.md — protobufjs/protobuf.js — GitHub1s
https://github.com/ | GitHub
https://blog.csdn.net/lhjuejiang/article/details/79854869 | JavaScript 中的 Object.is()、==和===*冰雪为融的博客-CSDN 博客
https://segmentfault.com/a/1190000022332809 | redux、mobx、concent 特性大比拼, 看后生如何对局前辈 - SegmentFault 思否
https://www.npmjs.com/package/lflint | lflint - npm
http://localhost:3032/tagManage/tagLibrary/TagDetail/:?company_id=&oms_order_id= | DataHub
http://uat-scc-oms.sftcwl.com.cn/taskCenter | OMS 订单管理系统

https://draw.moyu.io/ | Excalidraw
https://hejialianghe.gitee.io/computerNetwork/tools.html#_5-5-1-%E7%BD%91%E7%BB%9C%E4%BC%98%E5%8C%96%E6%8C%87%E6%A0%87 | 5.5 移动端网络优化的指标和策略 | web 全栈体系
https://www.it610.com/article/1296533055934111744.htm | 大前端项目代码重用，也许 lerna 是最好的选择 - it610.com
https://segmentfault.com/a/1190000019350611 | Lerna 中文教程详解 - SegmentFault 思否
https://www.jianshu.com/p/2f9c05b119c9 | 使用 lerna 管理大型前端项目 - 简书
https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/665469/ | lerna 管理 package | 程式前沿
https://juejin.cn/post/6940442613312913415#%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4%E8%A7%84%E5%88%99 | 前端搞工程化：揭秘自动化部署系统（一）
https://juejin.cn/post/6844904206076248072 | Monorepo-多包单仓库的开发模式
https://www.jianshu.com/p/81cf24483452 | Monorepo 101 - 简书
https://zhuanlan.zhihu.com/p/75078526 | Monorepo 与 multirepo 区别何在？为什么大公司像谷歌.微软.优步都在 Monorepo? - 知乎
https://juejin.cn/post/6972139870231724045#heading-12 | Monorepo 的这些坑，我们帮你踩过了！
https://blog.csdn.net/xiaobing_hope/article/details/114822269 | Monorepo + lerna & rush.js_xiaobing_hope 的专栏-CSDN 博客
https://juejin.cn/post/6844903757105332231#heading-78 | 马蹄疾 | 2018(农历年)封山之作，和我一起嚼烂 Git(两万字长文)
https://juejin.cn/post/6950063294270930980#heading-44 | 「React 进阶」 React 全部 api 解读+基础实践大全(夯实基础 2 万字总结)
https://www.tapd.cn/my_worktable?source_user=1659281561&workspace_id=35989218&workitem_type=story&workitem_id=1135989218001030819#&filter_close=true | 我的工作台 - TAPD 平台

https://juejin.cn/post/6854573222071894029 | AST 原理，让你蜕变为高级前端工程师的原理
https://juejin.cn/post/6844903902580572168#heading-6 | Web 前端项目必备配置
https://juejin.cn/post/6956602138201948196 | 《前端领域的转译打包工具链》上篇
https://juejin.cn/post/6959047144065990663#heading-21 | 移动端适配原理与方案详解
https://juejin.cn/post/6958462882388377630 | 用 JavaScript 实现手势库 — 手势逻辑【前端组件化】
https://juejin.cn/post/6947519943332069390 | 用 JavaScript 实现时间轴与动画 - 前端组件化
https://juejin.cn/post/6959333330277892133 | 我给网站做了一场性能手术
https://juejin.cn/post/6959073633033519135 | 前端搞框架-React & Vue 设计思路大 PK
https://juejin.cn/post/6956769952208519198 | 我从来不理解 “压缩算法”，直到有人这样向我解释它

https://juejin.cn/pin/6952688760072962079 | 做了个开源的项目框架，大家有兴趣的话捧个场～ - 掘金
https://github.com/xuya227939/tristana/tree/vite | xuya227939/tristana at vite
https://order.downfuture.com/#/add/goods | tristana
https://juejin.cn/post/6930792459567890446 | Vite 2.0 发布了！
https://cn.vitejs.dev/guide/comparisons.html | 比较 | Vite 官方中文文档
https://github.com/vitejs/vite | vitejs/vite: Next generation frontend tooling. It's fast!
https://vitejs.dev/config/ | Configuring Vite | Vite
https://cn.vitejs.dev/plugins/#rollup-plugins | 插件 | Vite 官方中文文档
https://github.com/asurraa/react-vite2-ts-antd | asurraa/react-vite2-ts-antd: React TypeScript with Vite 2 and Antd Starter Boliplate
https://juejin.cn/post/6950082433647640612 | 开源项目都在用 monorepo，但是你知道居然有那么多坑么？
https://juejin.cn/post/6953059119561441287 | 二、web 安全（xss/csrf）简单攻击原理和防御方案（实战篇）
https://www.parceljs.cn/ | Parcel - Web 应用打包工具 | Parcel 中文网
https://github.com/parcel-bundler/parcel | parcel-bundler/parcel: 📦🚀 Blazing fast, zero configuration web application bundler
https://juejin.cn/post/6953555933733584904 | ubuntu 安装 YApi 教程

http://nodejs.cn/learn/the-nodejs-fs-module | Node.js 文件系统模块

http://localhost:3000/eventAnalysis | Longan 监控平台
https://www.google.com.hk/search?q=%E5%89%8D%E7%AB%AF%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0&newwindow=1&safe=strict&sxsrf=ALeKk01_OUyuN3RFqGE_z6GFsobd1fPUag%3A1618370347146&ei=K192YIO9CISxmAWlipzwBQ&oq=%E5%89%8D%E7%AB%AF%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0&gs_lcp=Cgdnd3Mtd2l6EAM6BwgAELADEAo6BwgAELADEB5QtH1YoJsBYJycAWgBcAB4AYAB6gGIAeoRkgEGMC4xMi4ymAEAoAEBqgEHZ3dzLXdpesgBAsABAQ&sclient=gws-wiz&ved=0ahUKEwjD_p-t4_zvAhWEGKYKHSUFB14Q4dUDCA4&uact=5 | 前端数据监控平台 - Google 搜索
https://juejin.cn/post/6862559324632252430 | 前端监控平台系列：JS SDK（已开源）
https://www.fundebug.com/product | Fundebug - 产品
https://blog.fundebug.com/2017/03/29/user-behavior-track/ | Fundebug 支持用户行为回溯 | Fundebug 博客 - 一行代码搞定 BUG 监控 - 网站错误监控|JS 错误监控|资源加载错误|网络请求错误|小程序错误监控|Java 异常监控|监控报警|Source Map|用户行为|可视化重现
http://www.webfunny.cn/demo/httpPerformance.html | 前端监控系统，无埋点监控前端页面日志
https://www.webfunny.cn/des.html | Webfunny 前端监控系统
https://github.com/getsentry/sentry | getsentry/sentry: Sentry is cross-platform application monitoring, with a focus on error reporting.
https://zhuanlan.zhihu.com/p/87654566 | 阿里 UC 百亿 PV 的前端监控平台:（5）数据可视化 - 知乎

https://juejin.cn/post/6942362094264287268#heading-3 | 按需打包 UI 组件库原理探究
https://juejin.cn/post/6944877410827370504 | 现代前端工程为什么越来越离不开 Monorepo?
https://ask.csdn.net/questions/1405926 | ESLint config in a lerna subpackage is not loaded correctly-开源项目-CSDN 问答

https://juejin.cn/post/6944355557495013412 | 我为什么选择 Svelte 来开发我们的官网
https://juejin.cn/post/6944878021560139783 | 花半天时间，轻松打造前端 CI/CD 工作流
https://juejin.cn/post/6844904049582538760#heading-0 | 自动化部署的一小步，前端搬砖的一大步
https://juejin.cn/post/6844904056498946055 | 前端自动化部署的深度实践
https://codepen.io/Chokcoco/pen/ExZPpQq | transparent 配合 SVG feMorphology 滤镜生成不规则边框
http://gitlab.sftcwl.com/tblh-oms/fe-datahub/-/commits/master | 提交 · master · tblh-oms / fe-datahub · GitLab
http://yapi.sftcwl.com/project/949/interface/api/13085 | 查询表和字段配置-YApi-高效、易用、功能强大的可视化接口管理平台
https://juejin.cn/post/6844903769403031565#heading-14 | nodejs 中的依赖管理
https://zhuanlan.zhihu.com/p/102546577 | 你不知道的 npm - 知乎
https://www.cnblogs.com/wonyun/p/9692476.html | 探讨 npm 依赖管理之 peerDependencies - wonyun - 博客园
http://wiki.sftcwl.com/pages/viewpage.action?pageId=30269889 | NPM 包的正确开发姿势 - SFTC-FE - 顺丰同城科技 wiki
https://juejin.cn/post/6945739052628836382#heading-11 | 这可能是大型复杂项目下数据流的最佳实践
https://juejin.cn/post/6945794591513657358 | 不会吧不会吧，都 1202 年了，你还不知道这些检查 CSS 的工具？？？
https://github.com/mrdoob/three.js?utm_source=gold_browser_extension | mrdoob/three.js: JavaScript 3D library.

https://github.com/umijs/father | umijs/father: Library toolkit based on rollup and babel.
https://github.com/alibaba/hooks | alibaba/hooks: React Hooks Library
https://github.com/umijs/dumi/issues?q=is%3Aissue+is%3Aclosed | Issues · umijs/dumi
https://github.com/alibaba/hooks/blob/master/tsconfig.json | hooks/tsconfig.json at master · alibaba/hooks
https://segmentfault.com/a/1190000017064659?utm_source=sf-related | 从 1 到完美，写一个 js 库、node 库、前端组件库 - SegmentFault 思否
https://juejin.cn/post/6860129883398668296#heading-10 | [2.7w 字]我是这样搭建 React+Typescript 项目环境的(上)
https://juejin.cn/post/6860134655568871437#heading-4 | [2.7w 字]我是这样搭建 React+Typescript 项目环境的(下)
https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=dumi%20FrontMatter%20%E5%AE%9E%E7%8E%B0%EF%BC%9A&fenlei=256&oq=%25E5%258F%25AF%25E4%25BB%25A5%25E9%2580%259A%25E8%25BF%2587%25E5%259C%25A8%2520Markdown%2520%25E6%2596%2587%25E4%25BB%25B6%25E9%25A1%25B6%25E9%2583%25A8%25E7%25BC%2596%25E5%2586%2599%2520FrontMatter%2520%25E5%25AE%259E%25E7%258E%25B0%253A&rsv_pq=cdc5754f0002c2c2&rsv_t=858ci3wZRqkZdHr8oGQJWE43Y18WHyN759hRANpIBW9%2B9KMWxmaVz3vhuQ0&rqlang=cn&rsv_dl=tb&rsv_enter=1&rsv_btype=t&inputT=3270&rsv_sug3=130&rsv_sug2=0&rsv_sug4=3270&rsv_sug=1 | dumi FrontMatter 实现:*百度搜索
https://segmentfault.com/a/1190000020067490 | front-matter 使用详解 - SegmentFault 思否
https://github.com/umijs/dumi/issues/258 | 怎么配置类似 dumi 的菜单 · Issue #258 · umijs/dumi
https://d.umijs.org/zh-CN/config/frontmatter#markdown-%E9%85%8D%E7%BD%AE%E9%A1%B9 | FrontMatter
https://ask.csdn.net/questions/3291677 | 怎么配置类似 dumi 的菜单-开源项目-CSDN 问答
https://github.com/umijs/dumi/blob/master/docs/guide/index.md | dumi/index.md at master · umijs/dumi
https://umijs.org/zh-CN/config#title | 配置
https://www.csdn.net/tags/Mtjacg3sNTk1NjQtYmxvZwO0O0OO0O0O.html | umi 使用约定路由 - CSDN
https://blog.csdn.net/tianxintiandisheng/article/details/103392599?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~aggregatepage~first_rank_v2~rank_aggregation-3-103392599.pc_agg_rank_aggregation&utm_term=umi+%E4%BD%BF%E7%94%A8%E7%BA%A6%E5%AE%9A%E8%B7%AF%E7%94%B1&spm=1000.2123.3001.4430 | umi 脚手架搭建项目约定式路由 router 无法自动配置*天心天地生的博客-CSDN 博客
https://juejin.cn/post/6844903999729041415 | 【原创】umi 中配置式路由和约定式路由实战

https://juejin.cn/post/6940442613312913415 | 前端搞工程化：揭秘自动化部署系统（一）
http://wiki.sftcwl.com/pages/viewpage.action?pageId=45352620 | 前端开发规范大合集 - LTA - 顺丰同城科技 wiki
https://stackoverflow.com/questions/43179531/error-cannot-find-module-webpack-lib-node-nodetemplateplugin | node.js - Error: Cannot find module 'webpack/lib/node/NodeTemplatePlugin' - Stack Overflow

https://zhuanlan.zhihu.com/p/94920464 | 前端 UI 组件库搭建指南 - 知乎
https://juejin.cn/post/6935977815342841892#heading-21 | 如何快速为团队打造自己的组件库（上）—— Element 源码架构
https://juejin.cn/post/6937449598143168549#heading-16 | 如何快速为团队打造自己的组件库（下）—— 基于 element-ui 为团队打造自己的组件库
https://juejin.cn/post/6901552013717438472#heading-6 | 搭建自己的 typescript 项目 + 开发自己的脚手架工具 ts-cli
https://cloud.tencent.com/developer/article/1590909 | 从 0 到 1 教你搭建前端团队的组件系统（高级进阶必备） - 云+社区 - 腾讯云
https://www.yuque.com/ex-course/react/yk62yw | 脚手架 · 语雀
https://my.oschina.net/u/4383176/blog/4279889 | 可能是最详细的 React 组件库搭建总结 - osc_d7or6cwg 的个人空间 - OSCHINA - 中文开源技术交流社区
https://www.cnblogs.com/leiting/p/13502864.html | 从零搭建基于 react+antd 的业务组件库发布到 npm - c-137Summer - 博客园
https://github.com/leitingting08/sum-react | GitHub - leitingting08/sum-react: 基于 react+antd 的业务组件库搭建
https://github.com/leitingting08/sum-react/tree/release-0.0.1 | leitingting08/sum-react at release-0.0.1
https://github.com/leitingting08/sum-react | GitHub - leitingting08/sum-react: 基于 react+antd 的业务组件库搭建
https://zhuanlan.zhihu.com/p/196758730 | 如何快速构建 React 组件库 - 知乎
https://www.cnblogs.com/blueju/p/13662338.html | 搭建一个开发 UI 组件库的工程 - blueju - 博客园
https://blog.csdn.net/weixin_48726650/article/details/107019564 | 是时候搭建你们团队的 UI 组件库了\_weixin_48726650 的博客-CSDN 博客
https://dev.to/giteden/6-tools-for-documenting-your-react-components-like-a-pro-1gml | 6 Tools for Documenting Your React Components Like a Pro - DEV Community
https://www.geek-share.com/detail/2766381638.html | less/sass 样式模块按需加载生成样式文件 - 极客分享
https://www.geek-share.com/detail/2766381638.html | less/sass 样式模块按需加载生成样式文件 - 极客分享
https://github.com/

https://juejin.cn/post/6938601548192677918 | 阿里妈妈出的新工具，给批量修改项目代码减轻了痛苦
https://gogocode.io/
https://github.com/fjc0k/yapi-to-typescript | GitHub - fjc0k/yapi-to-typescript: 根据 YApi 或 Swagger 的接口定义生成 TypeScript/JavaScript 的接口类型及其请求函数代码。

https://juejin.cn/search?query=toFixed | toFixed - 搜索
https://juejin.cn/post/6927215610552123406 | 『前端 BUG』—— toFixed 四舍五入的不准确性｜牛气冲天新年征文
https://juejin.cn/post/6927217000112455687 | 『面试的底气』—— 0.1+0.2 等于 0.3 吗｜牛气冲天新年征文
https://juejin.cn/post/6860445359936798734/#heading-13 | 计算机组成原理 | 为什么浮点数运算不精确？（阿里笔试）
https://262.ecma-international.org/6.0/#sec-number.prototype.tofixed | ECMAScript 2015 Language Specification – ECMA-262 6th Edition
https://juejin.cn/post/6844904110458683405 | 从 toFixed() 看“四舍五入法”的正确性
https://blog.csdn.net/HaoDaWang/article/details/87984866 | 为什么银行家舍入是合理的？*小辣抓-CSDN 博客*银行家舍入法为什么合理

https://juejin.cn/post/6935261498822361119 | 如何编写神奇的「插件机制」，优化基于 Antd Table 封装表格的混乱代码 ｜ 技术点评
https://juejin.cn/post/6924368956950052877 | 实现 Web 端自定义截屏
https://juejin.cn/post/6935811262752227335 | 实现 Web 端指纹登录

http://www.ruanyifeng.com/blog/2021/01/_xor.html | 异或运算 XOR 教程 - 阮一峰的网络日志
https://juejin.cn/post/6844904182822993927 | 一份值得收藏的 Git 异常处理清单
https://www.cnblogs.com/luosongchao/p/3408365.html | git 删除远程分支和本地分支 - 罗松超 - 博客园
https://blog.csdn.net/harryptter/article/details/58129187 | git 删除远端分支 报错 remote refs do not exist 的解决方法\_harryptter 的专栏-CSDN 博客

https://juejin.cn/post/6931372123441233927 | 3 个最棒的最值得你去在产品中使用的 CSS Grid 功能
https://juejin.cn/post/6930503156598226951 | AJAX、Axios 和 Fetch 的那些恩怨情仇
https://stackoverflow.com/questions/50844095/should-one-use-for-of-or-foreach-when-iterating-through-an-array | javascript - Should one use for-of or forEach when iterating through an array? - Stack Overflow
https://juejin.cn/post/6927481938831736839 | 我从 Vuejs 中学到了什么
https://juejin.cn/post/6931901091445473293#heading-7 | 实现 Web 端自定义截屏(JS 版)
https://juejin.cn/post/6931749943359062023#heading-7 | 思想篇 - 通过 hooks 的出现，反思组件化开发存在的问题

https://juejin.cn/post/6901621538303410190 | 面试时我是如何回答“前端性能优化”的
https://segmentfault.com/a/1190000003848737 | 也来说说 touch 事件与点击穿透问题\_阿冒的前端之路 - SegmentFault 思否
https://juejin.cn/post/6887751398499287054#heading-13 | 前端项目自动化部署——超详细教程（Jenkins、Github Actions）
https://juejin.cn/post/6896249895108231176 | webpack 教程：如何从头开始设置 webpack 5
https://www.webpackjs.com/guides/caching/#%E8%AF%91%E6%B3%A8 | 缓存 | webpack 中文网
https://juejin.cn/post/6890757905352491021 | Vue、Node 全栈项目~面向小白的博客系统~
http://www.llongjie.top/detail/55 | nginx 安装 并 配置 gzip 和 br
https://juejin.cn/post/6893320971462279175 | 温故知新：前端安全知多少
https://juejin.cn/post/6897100462676246541 | 正儿八经的前端项目部署流程（交流分享）
https://juejin.cn/post/6896713964848152589 | 移动端适配问题终极探讨(上)
https://juejin.cn/post/6893856813247266823 | 前端面试题总结（欢迎收藏）
https://juejin.cn/post/6895584191073927175 | 不可思议，纯 css 都能图片滚动
https://www.jianshu.com/p/654505d42180 | DevOps 与 CICD 的区别 及 docker、k8s 的 CICD 思路 - 简书

picGo devSidecar clashX iina switchHosts istat-menus
