<!--
 * @Author: your name
 * @Date: 2021-06-15 15:54:04
 * @LastEditTime: 2021-06-15 15:57:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/themes/txt.md
-->

搞一个环境自动搭建的脚本
能够安装推荐的软件
配置合理的软件配置
分类存储 增加选取

参考
https://github.com/wang516038746/dot-files/
主要难点 软件配置的位置

如何引入自定义的 CSS/JS 文件
通过主题配置 inject 可以引入外部的自定义 CSS 文件和 JS 文件。例如：
inject:
head: - <link rel="stylesheet" href="http://localhost:3000/css/index.min.css">
bottom: - <script src="http://localhost:3000/css/index.min.js"></script>
