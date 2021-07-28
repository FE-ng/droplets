---
title: git
date: 2021-06-27 23:34:01
tags:
---

<!--
 * @Author: your name
 * @Date: 2021-07-28 14:07:53
 * @LastEditTime: 2021-07-28 16:16:39
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

技术: react antd-v3 git-modules redux redux-saga styled-components typescript webpack react-intl reselect

# sccoms

技术: react antd-v4 redux redux-saga styled-components typescript webpack react-intl reselect
贡献:

- 业务代码
- 主动使用 react-tooltip 帮助组内成员处理 antd 列表 tooltip 提示
- 添加 react-dev-inspector 构建项目,开发时能快速定位问题组件

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
import { AppContainer } from 'react-hot-loader';
import { Inspector } from 'react-dev-inspector';
// A CSS library that provides consistent, cross-browser default styling of HTML elements alongside useful defaults.
import 'sanitize.css/sanitize.css';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Check Version
import BuildVersion from 'utils/checkBuildVersion';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./static/images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions

import { configureAppStore } from 'store/configureStore';

// Import Longan
import loadLongan from 'utils/loadLongan';

// Import root app
import App from './pages/Layout';

// Import i18n messages
import { translationMessages } from './i18n';

// Import root app
// import App from './AppRouter';

// Import global style
import './styles/index.less';

loadLongan();

if (process.env.NODE_ENV === 'production') {
  // 版本检查
  const buildVersion = BuildVersion.getInstance(process.env.BUILD_VERSION as any);
  buildVersion.init();
}
interface ITranslationMessages {
  'en-US': {
    [key: string]: string;
  };
  'zh-CN': {
    [key: string]: string;
  };
}

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// Create redux store with history
const store = configureAppStore();
const MOUNT_NODE = document.getElementById('app');

// 进行组件路径注入并提示
const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;
// eslint-disable-next-line no-console
const inspectorTips = () =>
  console.log(
    "%c组件路径已注入, 使用'shift+'command+'l'即可查看组件路径",
    'color:#3ae917; font-size:14px;line-height:30px;',
  );
// eslint-disable-next-line no-unused-expressions
process.env.NODE_ENV === 'development' && inspectorTips();

const render = (messages: ITranslationMessages): void => {
  ReactDOM.render(
    <InspectorWrapper keys={['shift', 'command', 'l']}>
      <Provider store={store}>
        <AppContainer>
          <LanguageProvider messages={messages}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </LanguageProvider>
        </AppContainer>
      </Provider>
    </InspectorWrapper>,
    MOUNT_NODE,
  );
};

// eslint-disable-next-line
if ((module as any).hot) {
  // 注意需要依赖@types/webpack-env这个包
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  // eslint-disable-next-line
  (module as any).hot.accept(['./i18n', 'pages/Layout', './AppRouter.tsx'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}
render(translationMessages);

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   require('offline-plugin/runtime').install(); // eslint-disable-line global-require
// }
```

- 使用排 plop 添加快速搭建模板

```js
const fs = require('fs');

module.exports = function (plop) {
  plop.setGenerator('newPage', {
    // 这里的 test 是一个自己设定的名字，在执行命令行的时候会用到
    description: '新增一个页面(包含查询项 表格 弹窗)', // 这里是对这个plop的功能描述
    prompts: [
      {
        type: 'input', // 问题的类型
        name: 'pageName', // 问题对应得到答案的变量名，可以在actions中使用该变量
        message: '请输入新页面的Key(大驼峰)', // 在命令行中的问题
        validate(val) {
          const filterVal = val.trim();
          if (!filterVal || !/[A-Z]/.test(filterVal[0])) {
            return '请输入新页面的Key(大驼峰)';
          }
          const dir = new Set(fs.readdirSync('src/pages'));
          if (dir.has(val)) {
            return `项目中已经存在以 ${val} 命名的页面!`;
          }
          return true;
        },
        filter(val) {
          return val.trim().replace(/w/, (i) => i.toUpperCase());
        },
      },
      {
        type: 'input', // 问题的类型
        name: 'pageNameCn', // 问题对应得到答案的变量名，可以在actions中使用该变量
        message: '请输入新页面的名称', // 在命令行中的问题
        validate(val) {
          const filterVal = val.trim();
          return filterVal ? true : '请输入新页面的名称';
        },
        filter(val) {
          return val.trim();
        },
      },
    ],
    actions: (data) => {
      const { pageName, pageNameCn } = data;
      const actions = [
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/constants.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/constants.hbs', // 模板的路径
          data: {
            name: pageName,
          },
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/index.tsx`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/index.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/messages.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/messages.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/types.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/types.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/saga.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/sagas.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/selectors.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/selectors.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/services.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/services.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/slice.ts`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/slice.hbs', // 模板的路径
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/modules/FormTable.tsx`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/FormTable.hbs', // 模板的路径
          data: {
            name: pageName,
          },
        },
        {
          type: 'add', // 操作类型，这里是添加文件
          path: `src/pages/${pageName}/modules/Modal.tsx`, // 模板生成的路径
          templateFile: 'config/plop-templates/pages/Modal.hbs', // 模板的路径
        },
        {
          type: 'modify', // 操作类型，修改
          path: `src/utils/messages.ts`, // 模板生成的路径
          pattern: /(\/\/ -- APPEND HERE --)/gi,
          template: `${pageName}: {
    id: \`\${scope}.menu.${pageName}\`,
    defaultMessage: '${pageNameCn}',
  },\r\n  $1`, // 模板的路径
        },
        {
          type: 'modify', // 修改
          path: `src/configs/dev.router.conf.tsx`, // 模板生成的路径
          pattern: /(\/\/ -- APPEND HERE --)/gi,
          template: `{
    path: '${pageName}',
    image: getImagePath(menuImageMap.default),
    name: '${pageNameCn}',
  },\r\n  $1`, // 模板的路径
        },
      ];
      return actions;
    },
  });
};
```

- 规范 eslint 规则
- 规范 commitlint,添加 husky 等强校验
- 规则组件重构

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
