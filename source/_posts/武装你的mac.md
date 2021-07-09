---
title: 武装你的mac
date: 2021-06-07 15:19:35
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210608112043.png
categories:
  - mac配置
  - blog
tags:
  - mac
  - 快捷键
  - 配置
  - 软件
---

# 工欲善其事 必先利其器

mac 系统之于前端而言,是用过就再也回不去的霸道;

## **系统功能设置类**

从 window 到 mac 触控板就是我无法割舍的一个重点：  
MacBook 提供了强大的触控板硬件，支持用力点按和多指触控。  
配合 macOS 的软件调教，触控板的使用如虎添翼，对于前端开发而言已经能够完全脱离鼠标。  
但游戏和抠图等需要标进行精细操作的也可以另配键鼠；

### 触控板设置

<img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/settingEnter.png"  alt="设置入口" />

1. 系统偏好设置 > 触控板

   <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/cursor.png"  alt="光标与点按" />
   <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/transform.png"  alt="滚动与缩放" />
   <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/moreGesture.png"  alt="更多手势" />

2. 系统偏好设置 > 辅助功能 > 指针控制 > 三指拖拽(个人感觉体验非常棒的功能)

  <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/pointerControl.png"  alt="入口" />

  <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/thrFingerDrag.png"  alt="设置" />

> **建议全部拉满**  
> 具体配置可参考图片,光标移动速度可以按照自己的习惯设置

### 软件安装设置

1. 允许来自任意来源的应用
   很多时候，我们需要安装第三方途径的软件包，对于某些软件，苹果会因为过高的安全管理权限而拒绝安装，想要处理，可以在系统的设置内解决。

  <img style="width:600px;" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210426141736.png"  alt="效果图" />

如果找不到 “任意来源” 这个选项，可以通过一行终端的命令解决，按住 <kbd>command</kbd> + 空格 ，输入 “终端.app” 打开终端。在终端中输入命令：

```bash
sudo spctl --master-disable
```

![效果图](https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210507114206.png)

### 常用快捷键 (可自行摸索)

<kbd>command</kbd> + <kbd>option</kbd> + <kbd>D</kbd> : 能够控制程序坞与菜单栏是否常驻

<kbd>command</kbd> + <kbd>option</kbd> + <kbd>ESC</kbd> : 可以查看未响应的程序并快速清除  
![效果图](https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210514162013.png ':class=image600')

<kbd>command</kbd> + <kbd>M</kbd> : 将当前窗口快速缩小 在程序坞与菜单栏中能够查看  
![效果图](https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210514162149.png ':class=image600')

<kbd>command</kbd> + <kbd>W</kbd> : 关闭或者缩小, 缩小时

<kbd>command</kbd> + <kbd>H</kbd> : 将当前窗口所属的软件快速缩小 并且程序坞与菜单栏中也查看不到

<kbd>command</kbd> + <kbd>Q</kbd> : 退出程序

<kbd>command</kbd> + <kbd>D</kbd>: 在 finder 文件聚焦在文件上时是快速生产副本的方式 === ( <kbd>command</kbd> + <kbd>C</kbd>) + (<kbd>command</kbd> + <kbd>V</kbd>)

<kbd>command</kbd> + <kbd>C</kbd>| <kbd>command</kbd> + <kbd>V</kbd> : 复制 | 粘贴

<kbd>command</kbd> + <kbd>N</kbd> : 新窗口

<kbd>command</kbd> + <kbd>shift</kbd> + <kbd>(3|4|5)</kbd> : 可以调用 mac 的截屏或者录屏功能

......

## **软件类** [xclient mac 软件下载地址推荐](https://xclient.info/)

### 通用类

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/apple-touch-icon.png"  alt="效果图" /> [Homebrew](https://brew.sh/)

一款几乎必装的软件包管理工具,只是很多时候由于 GFW 的存在下载的速度堪忧,有必要更换一下国内的源;
下载之后能够非常简单的安装很多软件

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210609193619.png "  alt="效果图" /> [chrome](https://www.google.com/intl/zh-CN/chrome/)
  开发人员使用的最多浏览器,不多赘述,好用的插件另起一遍介绍;

  > [插件传送门](https://docsify-website-lf.vercel.app/#/tools/chromePlugin)

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210610111642.png "  alt="效果图" /> [Paste (强化剪切板)](https://pasteapp.io/)  
  Paste 极大的丰富了我们剪切板的操作内容  
  并且支持将常用的一些操作和内容进行分类管理并且储存

  <img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_6b0749fb-d939-4618-8262-64c5b6e4f594.png" style="width:600px;"/>

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210609194057.png "  alt="效果图" />[iStat Menus （电脑性能监控）](https://bjango.com/mac/istatmenus/)  
   功能非常的强大 能够查看 mac 的各种信息并且支持自定义自己喜欢的表现形式和颜色;  
  <img src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210426140334.png" style="width:600px;"/>

[^_^]: # (https://juejin.cn/post/6844904185134055438 )
[^_^]: # (邮箱：982092332@qq.com )
[^_^]: # (SN：GAWAE-FCWQ3-P8NYB-C7GF7-NEDRT-Q5DTB-MFZG6-6NEQC-CRMUD-8MZ2K-66SRB-SU8EW-EDLZ9-TGH3S-8SGA )

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210609194311.png "  alt="效果图" /> [IINA （推荐的 macOS 视频播放器）](https://iina.io/)

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210609194344.png "  alt="效果图" />[hammerspoon](http://www.hammerspoon.org/)  
  这是一个用于 OS x 强大自动化的工具。在其核心上，Hammerspoon 只是操作系统和 Lua 脚本引擎之间的桥梁。  
  赋予 Hammerspoon 强大功能的是一组向用户公开系统功能特定部分的扩展。  
  小锤子! 它能做到什么? 可以给 mac 的软件设置开启(切换)的快捷键,可以迅速给当前运行的窗口分屏二分之一屏(三分之一屏幕),  
  更能够在我们使用多屏开发时使用设置好的,将选中的窗口在多个屏幕转移,能够通过预设来切换语言中英文输入法等等等等!异常的强大;  
  只是配置起来稍有门槛,但是社区早已有前辈为我们铺好了道路;

  > [我的 hammerspoon 配置](https://github.com/FE-ng/.hammerspoon);

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210506193204.png" alt="icon" > [Parallels Desktop](https://www.parallels.cn/)  
  官网介绍: 无需重启即可在 Mac（包括新型 Apple M1 芯片）上运行 Windows 的应用程序，  
  同时具有速度更快、操作更简单且功能更强大的优点。包括 30 余种实用工具，可简化 Mac 和 Windows 上的日常任务  
  平时用的不多,不过在 mac 上能够做到不切换系统而使用 windows 必要的时候倒是很方便

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210610111132.png "  alt="效果图" />[Aerial](https://aerialscreensaver.github.io/)
  Aerial 是 macOS 的一款屏保软件，可以设置来自苹果 tvOS 屏幕保护程序的视频。  
  包括在不同城市和地点(纽约，旧金山，中国…)拍摄的经典航拍视频，国际空间站的地球视频，以及 tvOS 13 中介绍的新水下视频。  
  从 2.0 版，还可以设置来自第三方分享的或自己的视频.

### 开发类

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210610112024.png "  alt="效果图" />[Zsh Shell](https://ohmyz.sh/)  
  Oh-my-zsh 是一个开源的、基于社区驱动的框架，用于管理 Zsh 配置。它拥有非常多的功能，辅助，插件，主题,使用起来非常的便捷;

  > [我的 zsh 配置](https://github.com/FE-ng/docsify-website/blob/main/.zshrc.md);

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210609194535.png "  alt="效果图" /> [vscode](https://code.visualstudio.com/)

  ![效果图](https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210503234003.png ':class=image400')  
  现阶段前端使用最多的 IDE,由微软开发维护,支持非常多的语言,有茫茫多的开发插件和活跃的社区;

  > _TODO_ 这里的插件也需要另起一篇文章介绍

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210512195827.png" alt="icon" > [ITerm2](https://iterm2.com/)
  推荐的终端软件 ( iTerm2 )
  这是一款 macOS 用于替代 终端.app 的软件。因为它的定制化和功能非常强大，所以在配置 mac 的时候，它也会作为我使用的终端应用。

- <img class="iconPick" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210610111012.png "  alt="效果图" /> [SwitchHosts](https://swh.app/zh/)

  ![效果图](https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210430172813.png ':class=image400')

  快速切换 hosts 方案
  hosts 语法高亮
  支持从网络加载远程 hosts 配置
  可从系统菜单栏图标快速切换 hosts

## [部分软件下载地址推荐 xclient](https://xclient.info/)
