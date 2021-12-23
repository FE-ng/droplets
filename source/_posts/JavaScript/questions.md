---
title: JS question
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625162500.png
date: 2021-07-29 14:12:19
categories:
  - javascript
tags:
  - javascript
---

<!--
 * @Author: your name
 * @Date: 2021-07-29 13:55:57
 * @LastEditTime: 2021-07-29 14:12:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_posts/JavaScript/questions.md
-->

```js
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;
console.log(a[b]);
```

```js
0;
new Number(0)('');
new Boolean(false);
undefined;
new Boolean(false).valueOf();
```

```js
1. js截至目前有多少种数据类型，请手写出。
2. NaN === NaN
3. typeof NaN
4. typeof null
5. typeof typeof 1
6. null == undefined
7. ""== 0
8. 1 + null
9. '1' + null
10. Number(null)
11. Number("")
12. []==0
13. []==![]
14. []==false
```

作者：Jimmy_kiwi
链接：https://juejin.cn/post/6989868554644357127
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
