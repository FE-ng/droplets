---
title: mac 终端常用命令
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210608112043.png
date: 2021-06-19 15:24:45
categories:
  - mac配置
  - blog
tags:
  - mac
---

# mac 终端常用命令

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210621134802.png"  alt="效果图" />

## 文件类型

- 文件夹；
- 普通文件；
- 表示可执行文件；
- 压缩文件；
- 表示链接文件（快捷方式）

## 常用目录作用

- bin： 存放普通用户可执行的指令，普通用户也可以执行；
- dev ： 设备目录，所有的硬件设备及周边均放置在这个设备目录中；
- boot ： 开机引导目录，包括 Linux 内核文件与开机所需要的文件；
- home： 这里主要存放你的个人数据，具体每个用户的设置文件，用户的桌面文件夹，还有用户的数据都放在这里。每个用户都有自己的用户目录，位置为：/home/用户名。当然，root 用户除外；
- usr： 应用程序放置目录；
- lib： 开机时常用的动态链接库，bin 及 sbin 指令也会调用对应的 lib 库；
- tmp： 临时文件存放目录 ；
- etc： 各种配置文件目录，大部分配置属性均存放在这里；

## 目录操作

| 命令名 | 功能描述             | eg               |
| ------ | -------------------- | ---------------- |
| cd     | 打开当前目录         | cd dirname       |
| pwd    | 显示当前目录的路径名 | pwd              |
| ls     | 显示当前目录的内容   | ls -la           |
| mkdir  | 创建一个目录         | mkdir dirname    |
| rmdir  | 删除一个目录         | rmdir dirname    |
| mvdir  | 移动或重命名一个目录 | mvdir dir1 dir2  |
| dircmp | 比较两个目录的内容   | dircmp dir1 dir2 |

## 文件操作

| 命令名 | 功能描述               | eg                         |
| ------ | ---------------------- | -------------------------- |
| cat    | 显示或连接文件         | cat filename               |
| find   | 使用匹配表达式查找文件 | find . -name "\*.c" -print |
| touch  | 创建文件               | touch a.txt                |
| file   | 显示文件类型           | file filename              |
| more   | 分屏显示文件内容       | more filenam               |
| open   | 使用默认的程序打开文件 | open filename              |
| cp     | 复制文件或目录         | cp file1 file2             |
| rm     | 删除文件或目录         | rm filename                |
| mv     | 改变文件名或所在目录   | mv file1 file2             |
| ln     | 联接文件               | ln -s file1 file2          |
| od     | 显示非文本文件的内容   | od -c filename             |
| pg     | 分页格式化显示文件内容 | pg filename                |

## “软链接”和“硬链接”

### what

链接简单说实际上是一种文件共享的方式，是操作系统中的概念，主流文件系统都支持链接文件。

### how

简单来说链接是 Windows 中常见的快捷方式（或是 OS X 中的替身），
Linux 中常用它来解决一些库版本的问题，通常也会将一些目录层次较深的文件链接到一个更易访问的目录中。
在这些用途上，我们通常会使用到`软链接`（也称`符号链接`）。
`硬链接`则是保存了其代表的文件的绝对路径，是另外一种文件，在硬盘上有独立的区块，访问时替换自身路径。

### why

从使用的角度讲，两者没有任何区别，都与正常的文件访问方式一样，支持读写，如果是可执行文件的话也可以直接执行。

而区别就在底层原理上
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210716185229.png"  alt="效果图" />

inode 你可以理解成 C 语言中的指针。它指向了物理硬盘的一个区块，事实上文件系统会维护一个`引用计数`，只要有文件指向这个区块，它就不会从硬盘上消失。

下面我们进行一次演示
`ls -li` 我们可以查看当前工作环境的文件做左边的数字其实就是原理图中的 inode 属性
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210716185626.png"  alt="效果图" />

我们给 `README.md` 文件创建一个硬链接 我们记住`36143015`这个 inode 值
执行`ln README.md hard_README.md` 创建成功之后
我们再次`ls -li`

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210716190136.png"  alt="效果图" />

可以看到`hard_README.md`硬链接已经成功创建并且 inode 是`36143015`;

## 选择操作

| 命令名 | 功能描述                     | eg                           |
| ------ | ---------------------------- | ---------------------------- |
| grep   | 在文件中按模式查找           | grep "[1]" filename          |
| head   | 显示文件的最初几行           | head -20 filename            |
| tail   | 显示文件的最后几行           | tail -15 filename            |
| comm   | 显示两有序文件的公共和非公共 | comm file1 file2             |
| wc     | 统计文件的字符数、词数和行数 | wc filename                  |
| nl     | 给文件加上行号               | nl file1 >file2              |
| awk    | 在文件中查找并处理模式       | awk '{print $1 $1}' filename |
| sort   | 排序或归并文件               | sort -d -f -u file1          |
| uniq   | 去掉文件中的重复行           | uniq file1 file2             |
| diff   | 比较并显示两个文件的差异     | diff file1 file2             |
| sed    | 非交互方式流编辑器           | sed "s/red/green/g" filename |
| cut    | 显示文件每行中的某些域       | cut -f1,7 -d: /etc/passwd    |
| colrm  | 从标准输入中删除若干         | colrm 8 20 file2             |
| paste  | 横向连接文件                 | paste file1 file2            |

## 安全相关

| 命令名 | 功能描述               | eg                      |
| ------ | ---------------------- | ----------------------- |
| chown  | 改变文件或目录的属主   | chown newowner filename |
| chgrp  | 改变文件或目录的所属组 | chgrp staff filename    |

## 编程操作

| 命令名 | 功能描述                 | eg                         |
| ------ | ------------------------ | -------------------------- |
| touch  | 更新文件的访问和修改时间 | touch -m 05202400 filename |

## 进程操作

| 命令名 | 功能描述               | eg               |
| ------ | ---------------------- | ---------------- |
| ps     | 显示进程当前状态       | ps u             |
| top    | 可以查看系统健康状态   | top              |
| kill   | 终止进程               | kill -9 30142    |
| nice   | 改变待执行命令的优先级 | nice cc -c \*.c  |
| renice | 改变已运行进程的优先级 | renice +20 32768 |

## 时间操作

| 命令名 | 功能描述                 | eg         |
| ------ | ------------------------ | ---------- |
| date   | 显示系统的当前日期和时间 | date       |
| cal    | 显示日历                 | cal 8 1996 |
| time   | 统计程序的执行时间       | time a.out |

## 网络与通信

| 命令名 | 功能描述                          | eg                          |
| ------ | --------------------------------- | --------------------------- |
| ping   | 给一个网络主机发送 回应请求       | ping hpc.sp.net.edu.cn      |
| mail   | 阅读和发送电子邮件                | mail                        |
| write  | 给另一用户发送报文                | write username pts/1        |
| mesg   | 允许或拒绝接收报文                | mesg n                      |
| ftp    | 在本地主机与远程主机之间传输文件  | ftp ftp.sp.net.edu.cn       |
| rcp    | 在本地主机与远程主机 之间复制文件 | rcp file1 host1:file2       |
| telnet | 远程登录                          | telnet hpc.sp.net.edu.cn    |
| rsh    | 在远程主机执行指定命令            | rsh f01n03 date             |
| rlogin | 远程登录                          | rlogin hostname -l username |

## Korn Shell 命令

| 命令名  | 功能描述                        | eg              |
| ------- | ------------------------------- | --------------- |
| alias   | 给某个命令定义别名              | alias del=rm -i |
| history | 列出最近执行过的 几条命令及编号 | history         |
| r       | 重复执行最近执行过的 某条命令   | r -2            |
| unalias | 取消对某个别名的定义            | unalias del     |

## 其它命令

| 命令名 | 功能描述                       | eg           |
| ------ | ------------------------------ | ------------ |
| whoami | 显示当前正进行操作的用户名     | whoami       |
| env    | 显示当前所有设置过的环境变量   | env          |
| clear  | 清除屏幕或窗口内容             | clear        |
| stty   | 显示或重置控制键定义           | stty -a      |
| du     | 查询磁盘使用情况               | du -k subdir |
| df     | 显示文件系统的总空间和可用空间 | df /tmp      |
| w      | 显示当前系统活动的总信息       | w            |
| who    | 列出当前登录的所有用户         | who          |
| tty    | 显示终端或伪终端的名称         | tty          |
| uname  | 显示操作系统的有关信息         | uname -a     |

作者：SHERlocked93
链接：https://juejin.cn/post/6844904080972709901
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者：Cyandev
链接：https://www.jianshu.com/p/dde6a01c4094
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
