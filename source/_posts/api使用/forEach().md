---
title: forEach
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210623160309.png
date: 2021-06-21 13:23:12
categories:
  - javascript
tags:
  - forEach
  - api
  - javascript
---

# 小 forEach 大学问

## 定义

```javascript
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

介绍: forEach() 方法将对数组的每个元素执行一次给定的函数。

- callback: 为数组中每个元素执行的函数，该函数接收一至三个参数：
  - currentValue: 数组中正在处理的当前元素。
  - index 可选: 数组中正在处理的当前元素的索引。
  - array 可选: forEach() 方法正在操作的数组。
- thisArg 可选: 当执行回调函数 callback 时，用作 this 的值。
  {% note index modern %}
  'forEach does not directly mutate the object on which it is called but the object may be mutated by the calls to callbackfn.'，
  即 forEach 不会直接改变调用它的对象，但是那个对象可能会被 callback 函数改变。因为总是返回 undefined，所以不可链式调用;
  {% endnote %}

## 不对未初始化的值进行任何操作（稀疏数组）

这点和 map 函数也是一致的

```javascript
const arraySparse = [1, 3, , 7];
let numCallbackRuns = 0;

arraySparse.forEach(function (element) {
  console.log(element);
  numCallbackRuns++;
});

console.log('numCallbackRuns: ', numCallbackRuns);

// 1
// 3
// 7
// numCallbackRuns: 3
```

## 使用 thisArg

```javascript
function Counter() {
  this.sum = 0;
  this.count = 0;
}
Counter.prototype.add = function (array) {
  array.forEach(function (entry) {
    this.sum += entry;
    ++this.count;
  }, this);
  // ^---- 使用箭头函数表达式时 thisArg 参数会被忽略，因为箭头函数在词法上绑定了 this 值
  array.forEach((entry) => {
    this.sum += entry;
    ++this.count;
  });
};

const obj = new Counter();
obj.add([2, 5, 9]);
obj.count;
// 3 === (1 + 1 + 1)
obj.sum;
// 16 === (2 + 5 + 9)
```

## 如果数组在迭代时被修改了，则其他元素会被跳过。

下面的例子会输出 "one", "two", "four"。当到达包含值 "two" 的项时，整个数组的第一个项被移除了，  
这导致所有剩下的项上移一个位置。因为元素 "four" 正位于在数组更前的位置，  
所以 "three" 会被跳过。 forEach() 不会在迭代之前创建数组的副本。

```javascript
var words = ['one', 'two', 'three', 'four'];
words.forEach(function (word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
```

## 针对 promise 或 async 函数的使用备注

```javascript
let ratings = [5, 4, 5];

let sum = 0;

let sumFunction = async function (a, b) {
  return a + b;
};

ratings.forEach(async function (rating) {
  sum = await sumFunction(sum, rating);
});

console.log(sum);
// Expected output: 14
// Actual output: 0
```

## 如何跳出 forEach 循环 ?

首先 forEach 是不能使用常规手段跳出循环的;
{% note info modern %}
注意： 除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具
{% endnote %}

```javascript
let arr = [0, 1, 'stop', 3, 4];
try {
  arr.forEach((element) => {
    if (element === 'stop') {
      throw new Error('forEachBreak');
    }
    console.log(element); // 输出 0 1 后面不输出
  });
} catch (e) {
  console.log(e.message); // forEachBreak
}
```

- 使用抛出异常来跳出 foreach 循环
  看似 可以通过 抛出异常来 使 forEach 跳出循环，但在 forEach 的设计中并没有中断循环的功能，  
  而使用 try-catch 包裹时，当循环体过大性能会随之下降，这是无法避免的，  
  所以抛出异常可以作为一种中断 forEach 的手段，但并不是为解决 forEach 问题而存在的银弹。
- 重写 forEach 函数
- 遍历时清空这个 arr 参见**如果数组在迭代时被修改了，则其他元素会被跳过。**
