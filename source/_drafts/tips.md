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
   - 油米等
   - [x]纸张
   - 吹风机
   - ,------

3. 衣物等随身物品
4. 入职前酒店确定,机票时间确定,快递物品确定
5. [x]理发
6. [x]休假时间确定 剩余 4 天
7. [x]确定吃饭地点 时间 8.8 ---->
8. []文件处理打包 云储存
9. [x]个人相关资料备份
10. 机票购买

11. [x]倒计时 2 周的周报
12. 杭州租房形式确定
13. 快速适应杭州新环境
14. 确定五险一金交付地
15. [x]话费报销
16. [x]邮寄地 回家或者杭州 fn ---> 杭州
17. 手机电影观看

[西湖区五联西苑 个人朝南好房转租 仅需 1500，独门独户带独立.](https://www.douban.com/group/topic/240645340/) 距离很久步行 15min
[房东直租文三西路单间独卫，月付 1600 元／月，押一付一，无中...](https://www.douban.com/group/topic/240613388/)
https://www.douban.com/group/topic/240673012/
[个人找室友】西湖区 紫金庭园 朝南两个大卧室 2200/月]https://www.douban.com/group/topic/240577251/
房东 整租 浙商财富中心 蚂蚁金服 附近 3 楼 一室一厨一卫精装套房 2000 元 https://www.douban.com/group/topic/240879501/
[东岳公寓独立厨卫 2200 10 分钟](https://www.douban.com/group/topic/242071861/)
[西湖国际 黄龙万科附近大卧室+阳台 2100](https://www.douban.com/group/topic/241839434/)

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
