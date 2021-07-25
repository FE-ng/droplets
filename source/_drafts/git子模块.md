<!--
 * @Author: your name
 * @Date: 2021-07-23 16:27:45
 * @LastEditTime: 2021-07-23 16:27:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/git子模块.md
-->

对于中后台系统的开发，代码重合度还是很高的，那么怎样避免重复开发？比较自然的想法是，将公共部分独立维护，做组合式开发即可。近期在做模块拆分的工作，使用的是 Git Submodule 来完成。
添加子模块
将一个 Git 仓库以一个子文件夹的形式添加到其他 Git 仓库中，可以理解为一个 Git 仓库中除了有自己的代码还有若干个其他 Git 仓库的引用；

git submodule add http://gitlab.sftcwl.com/tblh-fe/common-system-manage.git
克隆代码
其他人去同步父级 Git 仓库的代码；

# 注意，克隆命令并不会将子模块代码克隆下来；因此在编译命令上务必加入如下克隆子模块代码的命令；

git clone http://gitlab.sftcwl.com/speed/fe-speed.git

cd fe-speed/

git submodule init

git submodule update
在子模块上开发
在子模块上进行开发，当本地代码与远程代码有差异时怎样处理？

# 仍旧先在父模块上建立远程的跟踪分支

git checkout --track origin/develop_zhangning

# 切换子模块

cd common-base

# 非常建议在子模块中新建自己的分支，这样至少在 update 命令后仍能在分支中保存自己的代码；

git checkout --track origin/test_branch

# Previous HEAD position was f87aa6d... b

# Branch test_branch set up to track remote branch test from origin.

# Switched to a new branch 'test_branch'

# 理论上，此时只要你切换的分支是刚刚从 master 上拉的新分支，那么应该没有任何 Modify；

do some submodule modify

# 在子模块新分支上执行修改操作，代码提交后会发现整个项目的 diff 中不仅有你的修改，还有一个子模块命名的文件提示有变动，这很好理解，意味着子模块 HEAD 发生了变化，需要被提交；

# 此时先在子模块中将修改提交

git add .
git commit -m "modify sth"

# 将子模块的变动提交到远程仓库，这一步非常重要，千万不可忘记，不然会导致其他同学无法同步代码

git push

# 将父模块的子模块指针修改，并提交到远程仓库

cd ..
git add .
git commit -m "update submodule"
git push

# 执行视角切换到其他同学，此时，其他同学同步代码

git pull

# 此时查看子模块代码，发现并没有更新到上一个同学的提交

# 而且由于子模块的 HEAD 指向不一致，此时父模块还会认为有子模块的修改待提交，此时如果没有真实的修改，应放弃此次更改(再次运行 Update 命令)，子模块的 HEAD 指向会被修正到当前远程仓库的状态；

git submodule update

# 对于子模块，有一点非常有障碍的是使用者并不知道当前 HEAD 指向的到底是哪个分支的哪个提交；

# 一个常见问题是当开发者对子模块做了一个本地的变更但是并没有推送到公共服务器。然后他们提交了一个指向那个非公开状态的指针然后推送上层项目。当其他开发者试图运行 git submodule update，那个子模块系统会找不到所引用的提交，因为它只存在于第一个开发者的系统中。如果发生那种情况，你会看到类似这样的错误：

git submodule update

# fatal: reference isn’t a tree: 6c5e70b984a60b3cecd395edd5b48a7575bf58e0

# Unable to checkout '6c5e70b984a60b3cecd395edd5ba7575bf58e0' in submodule path 'rack'

# 此时你需要找到最后的提交者，让他将子模块代码同步到远程仓库；

小结一下
对于子模块来说，当你在那个子目录里修改并提交时，子项目会通知那里的 HEAD 已经发生变更并记录你当前正在工作的那个提交；通过那样的方法，当其他人克隆此项目，他们可以重新创建一致的环境。

实际上说，子模块并不会记录自己所在的分支，它只记录他们当前所处的提交，也就是说，无论你在哪个分支，一旦你提交了，HEAD 就直接变更到你的提交；其他人会 pull 到 HEAD 指向这个提交的代码，但与分支无关，所以这里实际是隐藏着代码被覆盖的风险的，因此建议在子模块上先建分支。

子模块对于解决代码复用的问题是一个比较低成本的方案，但是，也不可忽视其中的一些问题：
1、对于子模块的修改更新需要严格把控，在应用前怎样 Check 子模块 HEAD 指向是否如你预期；
2、怎样规避大家对于子模块 HEAD 的随意更新，由于子模块并没有分支的概念，因此也没有提交权限的控制；
3、怎样正确更新子模块版本；
等等等，这些都是我们需要进一步探索的。
