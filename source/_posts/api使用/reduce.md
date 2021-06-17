---
title: reduce
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210616113743.png
categories:
  - javascript
tags:
  - reduce
  - api
  - javascript
---

# reduce & reduceRight 熟能生巧

在刚开始写代码的时候也会有很多的迭代方法例如 map forEach for...in.. for...of...等等
但是对于迭代方法中可以说的上最强的 reduce 却一知半解  
无疑成为了一块心病,后来的工作渐渐让自己生成一种习惯,有迭代就问问自己能不能使用 reduce 或者说 reduce 会不会更方便
让我现在确实能够驾轻就熟了
tips: 另外确实还有帅 😬 也是进阶路上不可获取的;

本文会给出**定义** 给出**常用用法** 以及**实际工作**中作者真切用过的

## 定义

**文档需要认真读清楚,不要给自己太多的惊喜或者某一天知道还能接收这样的参数这样的用法而感到惊讶**

```javascript
Array.reduce((prev, cur, index, arr) => {}, initValue);
Array.reduceRight((prev, cur, index, arr) => {}, initValue);
// 两个方法的功能一样，区别在于reduce是升序(数组从左往右)执行，reduceRight是降序(数组从右往左)执行。
```

- Array: 需要进行迭代操作的数组
- callback：回调函数(必选)
  - arr: 当前进行迭代操作的数组 实际上和 Array 是一样的
  - prev: 表示上一次调用回调时的返回值，传入了 initValue 的时候 第一次的值就是 initValue
  - cur: 表示当前正在处理的数组元素
  - index: 表示正在处理的数组元素的索引，若提供 initValue 值，则索引起始为 0，否则索引起始值为 1
- initValue: 表示初始值

  > 简单来说 reduce 是将累计器(callback)分别作用于每一个数组迭代的成员上，把上一次的运行结果作为下一次输入的值。

  {% note info modern %}
  reduce 并不会对原数组产生副作用
  {% endnote %}

## 难点一: 初始值

首先我们要明确的时候，pre 表示的是上一次回调时的返回值，或者是初始值 initValue。
在我们第一次调用的时候，在没有设置 initValue 值的情况下，index 的索引值是从 1 开始，
实际上是第一次运行时隐式调用了 pre+cur，
可以理解为是在背后做了 pre 是 0+cur:
1。我们在控制台看到的就是整个计算过程是 index 是 1-6。
在设置了 initValue 之后，那么就是代表 pre 的初始值就是 initValue，
第一次迭代执行的时候，index 是从 0 开始的,第一次调用返回的就是 2+arr[1]=3
整个过程 index 执行是从 0-6，共 7 次

---

## 常用方式

基本上平时需要使用 map 等迭代方法进行的 reduce 都能胜任 因此可以衍生出很多用法

### 累加求和&累乘求和

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7];

// 累加
const addSum = arr.reduce((pre, cur) => {
  return pre + cur;
});

// 累乘
const multiplySum = arr.reduce((pre, cur) => {
  return pre * cur;
});
```

### 计算数组中每个元素出现的次数

```javascript
const numArr = [1, 2, 3, 3, 5, 7, 8, 99, 1, 3, 7, 8, 8];
const numObj = numArr.reduce((pre, cur) => {
  if (cur in pre) {
    pre[cur]++;
  } else {
    pre[cur] = 1;
  }
  return pre;
}, {});
console.log(numObj); // {1: 2, 2: 1, 3: 3, 5: 1, 7: 2, 8: 3, 99: 1}

function Count(arr = []) {
  return arr.reduce((t, v) => ((t[v] = (t[v] || 0) + 1), t), {});
}
```

### 数组扁平化

```javascript
const numArr = [1, [2, [3, [4, 5]]], 6, [[[1, 2]], [3, 4]]];
const flatArr = (arr) => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatArr(cur) : cur);
  }, []);
};
console.log(flatArr(numArr)); // [1, 2, 3, 4, 5, 6, 1, 2, 3, 4]
```

遇见数组扁平化的时候 还会有很多种方法
{% note info modern %}
task: 提供单独的一篇数组扁平的方法总结
{% endnote %}

### 权重求和

```javascript
const scores = [
  { score: 90, subject: 'chinese', weight: 0.3 },
  { score: 95, subject: 'math', weight: 0.5 },
  { score: 85, subject: 'english', weight: 0.2 },
];
const result = scores.reduce((t, v) => t + v.score * v.weight, 0); // 91.5
```

### 代替 reverse

```javascript
// 使用reduceRight 以及','号运算符
function Reverse1(arr = []) {
  /* 
  (prev, cur) => (prev.push(cur), prev) 相当于
  (prev, cur) => {
    prev.push(cur);
    return prev
  }
  */
  return arr.reduceRight((prev, cur) => (prev.push(cur), prev), []);
}

// 逗号运算符有时让人难以理解,因此我一般借用代码的表达含义 即:每次返回之前的prev内容加cur当前值
function Reverse2(arr = []) {
  return arr.reduceRight((prev, cur) => [...prev, cur], []);
}

// 当然reduce也能实现对比Reverse2我们只需要在处理返回值的时候将cur放置在prev之前即可
function Reverse3(arr = []) {
  return arr.reduce((prev, cur) => [cur, ...prev], []);
}
```

### 代替 map 和 filter

```javascript
const arr = [0, 1, 2, 3];

// 代替map：[0, 2, 4, 6]
const a = arr.map((cur) => cur * 2);
const b = arr.reduce((prev, cur) => [...prev, cur * 2], []);

// 代替filter：[2, 3]
const c = arr.filter((cur) => cur > 1);
const d = arr.reduce((prev, cur) => (cur > 1 ? [...prev, cur] : prev), []);

// 代替map和filter：[4, 6]
const e = arr.map((cur) => cur * 2).filter((cur) => cur > 2);
const f = arr.reduce((prev, cur) => (cur * 2 > 2 ? [...prev, cur * 2] : prev), []);
```

### 数组分割

```javascript
function Chunk(arr = [], size = 1) {
  return arr.length
    ? arr.reduce((t, v) => (t[t.length - 1].length === size ? t.push([v]) : t[t.length - 1].push(v), t), [[]])
    : [];
}
const arr = [1, 2, 3, 4, 5];
Chunk(arr, 2); // [[1, 2], [3, 4], [5]]
```

### 数组过滤

```javascript
function Difference(arr = [], carr = []) {
  return arr.reduce((t, v) => (!carr.includes(v) && t.push(v), t), []);
}
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 3, 6];
Difference(arr1, arr2); // [1, 4, 5]
```

### 数组去重

```javascript
function Uniq(arr = []) {
  return arr.reduce((t, v) => (t.includes(v) ? t : [...t, v]), []);
}

const arr = [2, 1, 0, 3, 2, 1, 2];
Uniq(arr); // [2, 1, 0, 3]
```

### 数组最大最小值

```javascript
function Max(arr = []) {
  return arr.reduce((t, v) => (t > v ? t : v));
}

function Min(arr = []) {
  return arr.reduce((t, v) => (t < v ? t : v));
}
const arr = [12, 45, 21, 65, 38, 76, 108, 43];
Max(arr); // 108
Min(arr); // 12
```

### 数组成员位置记录

```javascript
function Position(arr = [], val) {
  return arr.reduce((t, v, i) => (v === val && t.push(i), t), []);
}

const arr = [2, 1, 5, 4, 2, 1, 6, 6, 7];
Position(arr, 2); // [0, 4]
```

### 数组成员特性分组

```javascript
function Group(arr = [], key) {
  return key ? arr.reduce((t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t), {}) : {};
}
const arr = [
  { area: 'GZ', name: 'YZW', age: 27 },
  { area: 'GZ', name: 'TYJ', age: 25 },
  { area: 'SZ', name: 'AAA', age: 23 },
  { area: 'FS', name: 'BBB', age: 21 },
  { area: 'SZ', name: 'CCC', age: 19 },
]; // 以地区area作为分组依据
Group(arr, 'area'); // { GZ: Array(2), SZ: Array(2), FS: Array(1) }
```

### 数组成员所含关键字统计

```javascript
function Keyword(arr = [], keys = []) {
  return keys.reduce((t, v) => (arr.some((w) => w.includes(v)) && t.push(v), t), []);
}
const text = [
  '今天天气真好，我想出去钓鱼',
  '我一边看电视，一边写作业',
  '小明喜欢同桌的小红，又喜欢后桌的小君，真TM花心',
  '最近上班喜欢摸鱼的人实在太多了，代码不好好写，在想入非非',
];
const keyword = ['偷懒', '喜欢', '睡觉', '摸鱼', '真好', '一边', '明天'];
Keyword(text, keyword); // ["喜欢", "摸鱼", "真好", "一边"]
```

### 返回对象指定键值

```javascript
function GetKeys(obj = {}, keys = []) {
  return Object.keys(obj).reduce((t, v) => (keys.includes(v) && (t[v] = obj[v]), t), {});
}

const target = { a: 1, b: 2, c: 3, d: 4 };
const keyword = ['a', 'd'];
GetKeys(target, keyword); // { a: 1, d: 4 }
```

### URL 参数反序列化

```javascript
function ParseUrlSearch() {
  return location.search
    .replace(/(^\?)|(&$)/g, '')
    .split('&')
    .reduce((t, v) => {
      const [key, val] = v.split('=');
      t[key] = decodeURIComponent(val);
      return t;
    }, {});
}
// 假设 URL 为：https://www.baidu.com?age=25&name=TYJ
ParseUrlSearch(); // { age: "25", name: "TYJ" }
```

### URL 参数序列化

```javascript
function StringifyUrlSearch(search = {}) {
  return Object.entries(search)
    .reduce((t, v) => `${t}${v[0]}=${encodeURIComponent(v[1])}&`, Object.keys(search).length ? '?' : '')
    .replace(/&$/, '');
}

StringifyUrlSearch({ age: 27, name: 'YZW' }); // "?age=27&name=YZW"
```

### 数组转对象

```javascript
const people = [
  { area: 'GZ', name: 'YZW', age: 27 },
  { area: 'SZ', name: 'TYJ', age: 25 },
];
const map = people.reduce((t, v) => {
  const { name, ...rest } = v;
  t[name] = rest;
  return t;
}, {}); // { YZW: {…}, TYJ: {…} }
```

### 取子集

```javascript
[1, 2, 3, 4, 5, 6].reduce((t, item) => t.concat(t.map((v) => v.concat(item))), [[]]);
```

### Redux Compose 函数原理

```javascript
function Compose(...fns) {
  if (fns.length === 0) {
    return (arg) => arg;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return fns.reduce(
    (t, v) =>
      (...arg) =>
        t(v(...arg)),
  );
}
```

### 异步累加

```javascript
async function AsyncTotal(arr = []) {
  return arr.reduce(async (t, v) => {
    const at = await t;
    const todo = await Todo(v);
    at[v] = todo;
    return at;
  }, Promise.resolve({}));
}
const result = await AsyncTotal(); // 需要在async包围下使用
```

参考文献:

    作者：JowayYoung
    链接：https://juejin.cn/post/6844904063729926152
    来源：掘金
