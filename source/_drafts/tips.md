<!--
 * @Author: your name
 * @Date: 2021-07-31 21:00:06
 * @LastEditTime: 2021-08-04 20:55:15
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

   - 锅碗瓢盆
   - 油米等
   - 纸张
   - 吹风机
   - ,------

3. 衣物等随身物品
4. 入职前酒店确定,机票时间确定,快递物品确定
5. [x]理发
6. [x]休假时间确定 剩余 4 天
7. [x]确定吃饭地点 时间 8.8 ---->
8. []文件处理打包 云储存
9. 个人相关资料备份

10. 倒计时 2 周的周报 1week
11. 杭州租房形式确定
12. 快速适应杭州新环境
13. 确定五险一金交付地
14. [x]话费报销
15. 邮寄地 回家或者杭州 fn

[西湖区五联西苑 个人朝南好房转租 仅需 1500，独门独户带独立.](https://www.douban.com/group/topic/240645340/) 距离很久步行 15min
[房东直租文三西路单间独卫，月付 1600 元／月，押一付一，无中...](https://www.douban.com/group/topic/240613388/)

---

1.  - **需求**:【【基础数据】操作日志记录优化】
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001033481;
    - **进度**: 完成开发公用组件 LogModal;
    - **分支名**: dev-1.2.4-logOptimize_lf
    - **使用**: 参考 BOMManage/modules/FormTable 中的引用和使用方式;
    - **特点**: 已经和后端瑞豪确定日志 modal 的入参(operateTableId,operateTableName,),出参(表格数据)都保持一致;
    - **注意事项**: 由于供应商的需求(需求 2)先开发上线, 未使用  该需求开发  的组件, 因此后续会需要处理供应商 SupplierManage 中的日志 modal;

2.  - **需求**:【【基础数据】供应商主数据可视化】
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001032629
    - **进度**: 自测完成,qa 测试中
    - **分支名**: dev-v1.1.2-supplier​Manage_lf
    - **注意事项**: 暂无

3.  - **需求**:【【基础数据】bom 商品导入时支持虚拟 bom 商品】
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001033751
    - **进度**: 开发中

4.  - **需求**:【【系统能力搭建】-新增标签管理模块】
      https://www.tapd.cn/53174460/prong/stories/view/1153174460001031150
    - **进度**: uat 中
    - **分支名**:dev-v1.1.3-labelManage_lf
    - **注意事项**: 需求的实现有点费神, 后续的更改和需求增加请注意查看对应需求中的代码注释;

5.  - **需求**:【【DataHub 系统优化】数据库管理-数据库表的数据表增加中文名】
      https://www.tapd.cn/53174460/prong/stories/view/1153174460001033741
    - **进度**: uat 中
    - **注意事项**: 沟通后前端没做更改,后端在 data_table_name 字段里拼接了表格中文名

6.  - **需求**:【【配送订单管理】增加‘强制下发’按钮功能的需求】
      https://www.tapd.cn/35989218/prong/stories/view/1135989218001030879
    - **进度**: 需求被挂起