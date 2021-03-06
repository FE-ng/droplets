---
title: git
date: 2021-06-27 23:34:01
tags:
---

<!--
 * @Author: your name
 * @Date: 2021-07-23 16:26:39
 * @LastEditTime: 2021-07-28 13:51:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/git.md
-->

# 版本控制工具-Git

---

**Git** 是世界上目前最先进的分布式版本控制系统，致力于团队、个人进行项目版本管理。

> - 版本控制系统
> - Git 基础
> - Git 使用

---

## 版本控制系统

### 1. 版本控制是什么？

假设一个场景：写出一份文件，写完需要进行审核，当文件存在缺陷时需要修改，手动做法是复制一份文件，在新文件上进行修改，即使改动有误不如上一次时仍可找回上一次文件再次进行修改。复制原文件产生新文件的过程就是版本控制，而版本控制系统就是自动完成以上版本控制操作的工具。

### 2. 版本控制系统如何运作？

将需要进行版本控制的文件都要提交到一个仓库里面，对文件做出的修改都会被这个版本控制系统侦测到，如果要保留这个版本的文件，就要通过版本控制系统提供的命令把文件提交到仓库里面，随后版本控制系统就会自动为提交的文件打上版本号。

> 仓库类型：
> 本地仓库（建立在本地文件夹）
> 远程仓库（建立在互联网服务器内文件夹）

## Git 基础

### 1. Git 是怎样的系统？

Git 是分布式版本控制系统，配有两个仓库，在电脑上有一个本地仓库，在远程的服务器上有一个远程仓库。在提交文件的时候会先提交到本地仓库，然后在有网络的情况下，再从本地仓库提交到网络上的远程仓库。

### 2.Git 的思想

- **直接记录快照，而非差异比较**
  Git 更像是把数据看作是对小型文件系统的一组快照。 Git 对待数据更像是一个 快照流。 每次提交更新，或在 Git 中保存项目状态时，主要对当时的全部文件制作一个快照并保存这个快照的索引。 为了高效，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。

- **近乎所有操作都是本地执行**
  本地数据库存储项目历史，方便无联网提交。

- **保证完整性**
  Git 中所有数据在存储前都计算校验和，然后以校验和来引用。 在传送过程中丢失信息或损坏文件，Git 就能发现。

- **一般只添加数据**
- **三种状态**
  已提交（committed）、已修改（modified）和已暂存（staged）
  已提交表示数据已经安全的保存在本地数据库中。 已修改表示修改了文件，但还没保存到数据库中。 已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。
  引入 Git 项目的三个工作区域的概念：Git 仓库、工作目录以及暂存区域。
  ![此处输入图片的描述][2]

### 3.Git 基本工作流程

- 在工作目录中修改文件。
- 暂存文件，将文件的快照放入暂存区域。
- 提交更新，找到暂存区域的文件，将快照永久性存储到 Git 仓库目录。

## Git 使用

### 1.获取 git 仓库：

- 在现有项目或目录下导入所有文件到 Git 中
  使用 Git 来对现有的项目进行管理，需要进入该项目目录并输入：
  **git init**
  该命令将创建一个名为 .git 的子目录，这个子目录含有初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，这仅仅是做了一个初始化的操作，项目里的文件还没有被跟踪。
  在一个已经存在文件的文件夹（而不是空文件夹）中初始化 Git 仓库来进行版本控制，应该开始跟踪这些文件并提交。 可通过 git add 命令来实现对指定文件的跟踪，然后执行 git commit 提交：
  **git add \*.c**
  **git add LICENSE**
  **git commit -m ‘提交信息’**
- 从一个服务器克隆一个现有的 Git 仓库
  **git clone https://github.com/xx/test**
  会在当前目录下创建一个名为 “test”的目录，并在这个目录下初始化一个 .git 文件夹，从远程仓库拉取下所有数据放入 .git 文件夹，然后从中读取最新版本的文件的拷贝。所有的项目文件已经在新建的 test 文件夹里面，准备就绪等待后续的开发和使用。 如果想在克隆远程仓库的时候，自定义本地仓库的名字，可以使用如下命令：
  **git clone https://github.com/xx/test 自定义名字**

### 2.Git 常用操作

⚠️ 不可使用自己不熟悉的命令， 任何命令不要加上-f 的强制参数，否则可能导致代码丢失。

- 记录每次更新到仓库
  **git status** （检查当前文件状态）
  **git add** （跟踪新文件）
  **git commit** （提交更新，即提交最后一次 git add 暂存起来的变化）

- 远程仓库
  **git remote** （查看已经配置的远程仓库服务器）
  **git remote add <shortname> <url>** （添加一个新的远程 Git 仓库，同时指定一个可以轻松引用的简写）

  > 使用 clone 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写

- 从远程仓库中抓取与拉取
  **git fetch [remote-name]**
  这个命令会访问远程仓库，从中拉取所有还没有的数据。 执行完成后，将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。（并不会自动合并或修改当前的工作）
  **git pull [remote-name]**
  有一个分支设置为跟踪一个远程分支，可以使用 git pull 命令来自动的抓取然后合并远程分支到当前分支。
  运行 git pull 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支。
  ⚠️：️如果远程有人改了同一个文件就会出现一个冲突，git 会提示哪些文件有冲突，手动修改再提交一次即可，或是使用 git stash 备份当前工作区 。

- 推送到远程仓库
  **git push [remote-name] [branch-name]**
  ⚠️ 只有当有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。所以必须先将他人的工作拉取下来并将其合并进自己的工作后才能推送。当遇到冲突时，需使用 git fetch 拉取所有数据进行合并之后再推送，不可使用强制推送。

- 保存一些还没有提交的工作
  **git stash**
  git stash 命令用来临时地保存一些还没有提交的工作，以便在分支上不需要提交未完成工作就可以清理工作目录。

- 撤销操作
  **git reset**
  git reset 命令作用是重置 HEAD(当前分支的版本顶端）到另外一个 commit。

  > 1)、已经 commit 但未 push：
  > 使用**git reset --soft head^**，撤消了本次提交，将工作区恢复到了提交前但是已经 add 的状态；
  > ⚠️ 使用 **git reset --hard head**^会使本地修改彻底丢掉(慎用)； 2)、已经 commit 并且已 push：
  > 使用**git reset --hard head^**回滚到上一个 commit，但会丢掉本次已有修改。 3)、从暂存区（Stage）回到工作区（Working Directory）：
  > 使用**git reset -- file_name** 4)、取消文件在工作区的修改
  > 使用**git checkout -- file_name** , 取消这次在工作区的修改，但是如果已经被 add 加到了暂存区，那么这个命令就没有用了，只能取消本次在工作区的修改，去上一次保存的地方。
  > **区别：** > **checkout**语义上是把什么东西取出来，所以此命令用于从历史提交（或者暂存区域）中拷贝文件到工作目录，也可用于切换分支。
  > **reset**语义上是重新设置，所以此命令把当前分支指向另一个位置，并且有选择的变动工作目录和索引。也用来在从历史仓库中复制文件到索引，而不动工作目录。

- 漏提交
  已经 commit 但是有修改忘记了提交，想把他们放在刚刚的 commit 里面
  使用**git commit --amend --no-edit**合并到上一个提交里

### 3.Git 分支

Git 的分支，其实本质上仅仅是指向提交对象的可变指针。 Git 的默认分支名字是 master。在多次提交操作之后，其实已经有一个指向最后那个提交对象的 master 分支。它会在每次的提交操作中自动向前移动。

- 常用命令如下：
  **git branch 分支名**<br> 创建分支，在当前所在的提交对象上创建一个指针。（仍然在 master 分支上。，因为 git branch 命令仅仅 创建 一个新分支，并不会自动切换到新分支中去。）
  **git checkout 已存在分支名**<br>
  切换到一个已存在的分支，HEAD 就指向切换分支。Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。
- 分支的新建与合并
  **git checkout -b iss53**<br> 新建 test 分支并切换到 test 分支，在 test 分支上实现新需求。随着文件修改提交，test 分支随着工作的进展向前推进;当切换分支时， Git 会自动添加、删除、修改文件以确保此时的工作目录和这个分支最后一次提交时的样子一模一样。
  > 在 Git 中整合来自不同分支的修改主要有两种方法：merge 以及 rebase
  > **合并**
  > 切换到 master 分支并将 iss53 分支合入，和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。 这个被称作一次合并提交，它的特别之处在于他有不止一个父提交，Git 会自行决定选取哪一个提交作为最优的共同祖先，并以此作为合并的基础。
  > **git checkout master** > **git merge iss53** > **变基**
  > 将 C4 中的修改变基到 C3 上
  > 原理是首先找到这两个分支（即当前分支 experiment、变基操作的目标基底分支 master）的最近共同祖先 C2，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件，然后将当前分支指向目标基底 C3, 最后以此将之前另存为临时文件的修改依序应用。
  > **git checkout experiment** > **git rebase master** > **git checkout master** > **git merge experiment**
  > 若有冲突，git 会停止 rebase，需要解决冲突
  > 解决完，使用 git add 添加冲突的文件，更新暂存区
  > **git rebase --continue**继续剩下的 rebase
  > **git rebase --abort**终止 rebase 行为，并且 feature 会回到 rebase 开始之前的状态

<br>
总的原则是，只对尚未推送或分享给别人的本地修改执行变基操作清理历史，从不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式带来的便利。

### 4.跟踪远程分支

每次克隆一个仓库时，本地都会新建一个 master 分支来 track 远程的 origin/master。如果不同名，需要人为指定 **git push origin branch_name**，与远程分支建立关联后再使用 push 和 pull 就自动同步该远程分支，无需再指定分支。

- 远程新建一个分支，本地没有同名分支:
  **git checkout --track origin/branch_name(本地分支与远程分支同名)
  git checkout -b local_branch remote_branch(本地分支 local_branch)**

- 创建一个和已有本地分支同名的远程分支并跟踪:
  **git push --set-upstream origin branch_name**

- 本地已有分支跟踪远程已有分支:
  **git branch --set-upstream-to origin/remote_branch local_branch**
