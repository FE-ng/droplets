---
title: Array.from()
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210616113743.png
categories:
  - javascript
tags:
  - Array.from()
  - api
  - javascript
---

# Array.from()

Array.from() 是 ES6 语法中的 api, 并不像它的同窗们非常兽人青睐,但在一些特别的用法上 出乎意料的方便

## 定义

```javascript
Array.from(arrayLike[, mapFunction[, thisArg]])
```

- arrayLike：必传参数，想要转换成数组的**伪数组对象**(以 dom 节点为代表)或**可迭代对象**。
- mapFunction：可选参数，mapFunction(item，index){...} 是在集合中的每个项目上调用的函数。返回的值将插入到新集合中。
- thisArg：可选参数，执行回调函数 mapFunction 时 this 对象。这个参数很少使用。

让我们将类数组的每一项乘以 2：
const someNumbers = { '0': 10, '1': 15, length: 2 };

Array.from(someNumbers, value => value \* 2); // => [20, 30]

## 将类数组转换成数组

    问个问题哈。我刚刚在浏览器里试了一下
    q = Array(length).fill((function(){return {}})());
    为啥 q[0] === q[1] // true
    明明 (function(){return {}})() == (function(){return {}})() // false
    这不也是返回一个新对象么......
