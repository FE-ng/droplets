---
title: git
date: 2021-06-27 23:34:01
tags:
---

<!--
 * @Author: your name
 * @Date: 2021-07-28 14:07:53
 * @LastEditTime: 2021-07-28 15:09:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/sf总结.md
-->

# 入职时间

# 工作涉及到的系统

otms
otms-H5
顺丰科技智慧供应链(公众号)-内嵌 h5
sccoms
datahub
毫末智能车监控系统

# otms

技术: react antd-v3 git-modules redux redux-saga styled-components typescript webpack react-intl react-selector

# 分享内容

- 新人串讲
- 业务分享
- 转正述职
- git 原理
- npm 发展及其原理
- pnpm

# 架构面

```
root
├─.vscode              ----------------------- vscode编辑器配置
├─gitModules*1         ----------------------- git子模块1
├─gitModules*2         ----------------------- git子模块2
├─config               ----------------------- 项目配置
├─dist                 ----------------------- 打包存储目录
├─docs                 ----------------------- 文档
├─node_modules         ----------------------- 依赖包
├─public               ----------------------- 公有资源
├─src                  ----------------------- 主模块目录
│ ├─components         ----------------------- 通用组件总目录
│ ├─containers         ----------------------- 页面模块总目录
│ ├ └─trueContainer    ----------------------- 具体模块名称目录
│ ├    ├─components    ----------------------- 内部组件
│ ├    ├─modules       ----------------------- 内部模块
│ ├    ├─actions.tsx   ----------------------- redux 修改数据
│ ├    ├─constants.tsx ----------------------- 模块名称,常量存放
│ ├    ├─index.tsx     ----------------------- 具体模块入口
│ ├    ├─messages.tsx  ----------------------- 国际化语言配置
│ ├    ├─reducer.tsx   ----------------------- redux 异步数据处理
│ ├    ├─saga.tsx      ----------------------- 异步数据流式处理
│ ├    ├─selectors.tsx ----------------------- react-selector 处理数据
│ ├    ├─services.tsx  ----------------------- 接口存储
│ ├    └─types.tsx     ----------------------- ts类型定义
│ ├─hooks              ----------------------- 通用hooks
│ ├─static             ----------------------- 静态资源
│    ├─images          ----------------------- 图片
│    ├─font            ----------------------- 字体
│    ├─files           ----------------------- 文件
│ ├─translations       ----------------------- 国际化转化结果
│ ├─typings            ----------------------- 全局通用ts type定义
│ ├─utils              ----------------------- 通用处理方法
│ ├─app.js             ----------------------- 包入口
│ └─index.tsx          ----------------------- 程序入口
├─.commitlintrc        ----------------------- 提交规范lint配置
├─.cz-config.js        ----------------------- 提交规则配置
├─.editorconfig        ----------------------- 编辑器配置
├─.eslintignore        ----------------------- 忽略eslint规则文件
├─.eslintrc.js         ----------------------- eslint规则配置
├─.gitignore           ----------------------- 忽略git追踪文件
├─.gitmodules          ----------------------- git子模块配置
├─.npmrc               ----------------------- npm配置
├─build.sh             ----------------------- 打包脚本
├─package.json         ----------------------- 包管理配置
├─README.md            ----------------------- 项目介绍
├─\*.d.ts              ----------------------- 通用ts类型处理
├─tsconfig.json        ----------------------- ts语言配置
```

<!-- │ ├─sub-branch-1
│ └─sub-branch-2
├─branch-2
│ └─sub-branch-3
│ ├─a
│ └─b
├─branch-3
│ └─sub-branch-4
└─branch-4
├─sub-branch-5
├─sub-branch-6
│ └─c
└─sub-branch-7 -->
