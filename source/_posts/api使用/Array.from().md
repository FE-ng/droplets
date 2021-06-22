---
title: Array.from()
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210616113743.png
date: 2021-06-20 13:23:12
categories:
  - javascript
tags:
  - Array.from()
  - api
  - javascript
---

# Array.from()

Array.from() 是 ES6 语法中的 api, 并不像它的同窗们受人青睐,但在一些特别的用法上 出乎意料的方便和实用

## 定义

```javascript
Array.from(arrayLike[, mapFunction[, thisArg]])
```

- arrayLike：必传参数，想要转换成数组的**伪数组对象**(以 dom 节点为代表)或**可迭代对象**。
- mapFunction：可选参数，mapFunction(item，index){...} 是在集合中的每个项目上调用的函数。返回的值将插入到新集合中。
- thisArg：可选参数，执行回调函数 mapFunction 时 this 对象。这个参数很少使用。

```javascript
// 让我们将类数组的每一项乘以 2：
const someNumbers = { 0: 10, 1: 15, length: 2 };
Array.from(someNumbers, (value) => value * 2); // => [20, 30]

// 在一般情况下正常对象是没有length的 需要将其转成数组并且处理时就可以借助reduce的能力
const someNumbers2 = { 0: 10, 1: 15 };
function GetValues(obj = {}, keys = []) {
  return Object.values(obj).reduce((t, v) => [...t, v * 2], []);
}
GetValues(someNumbers2);
// 或者自行封装一个方法
const GetValuesByObject = (someNumbers, callback) => {
  const obj = { ...someNumbers };
  obj.length = Object.values(obj).length;
  return Array.from(obj, callback); // => [20, 30]
};
GetValuesByObject(someNumbers2, (a) => a * 2);
```

## 将类数组转换成数组

js 中常见的类数组对象：函数的 arguments 关键字, DOM 节点的集合。

```javascript
function sumArguments() {
  return Array.from(arguments).reduce((sum, num) => sum + num);
}

sumArguments(1, 2, 3); // => 6
```

## 克隆一个数组

Array.from() 可以很容易的实现数组的浅拷贝。
当然这里的 Array.from()在日常开发中是不如"..."(Spread syntax)的

```javascript
const numbers = [3, 6, 9];
const numbersCopy = Array.from(numbers);
// const numbersCopy = [...numbers];

numbers === numbersCopy; // => false
```

Array.from(numbers) 创建了对 numbers 数组的浅拷贝，numbers === numbersCopy 的结果是 false，  
意味着虽然 numbers 和 numbersCopy 有着相同的项，但是它们是不同的数组对象。  
于是我们可以使用 Array.from 进行多维数组的递归形深拷贝;  
即: 数组的情况下调用函数,其他情况直接返回

```javascript
function recursiveClone(val) {
  // this.callee是一种特殊的引用自身的函数的值可以避免函数被重命名而导致错误的情况发生
  return Array.isArray(val) ? Array.from(val, this.callee) : val;
}

const numbers = [
  [0, 1, 2],
  ['one', 'two', 'three'],
];
const numbersClone = recursiveClone(numbers);
numbersClone; // => [[0, 1, 2], ['one', 'two', 'three']]
numbers[0] === numbersClone[0]; // => false
```

## 使用初始值填充数组 Array.from() vs fill

### 基本值

```javascript
const fillArray = (init, arrLen) => Array.from({ length: arrLen }, () => init);
fillArray(0, 3);
// 既然Array.from()可以实现fill的功能, 那何不进一步改动一下简单实现fill
// 实际情况还得考虑fill的其他参数 数据结构校验等等
Array.prototype.fillArray = function (initNum) {
  return Array.from({ length: this.length }, () => initNum);
};
```

可以看见在基本值的情况下二者的输出几乎没有区别  
但 fill 显然更加的简单;

### 引用值

```javascript
const length = 3;
const resultA = Array.from({ length }, () => ({})); // => [{}, {}, {}]
const resultB = Array(length).fill({}); // => [{}, {}, {}]
resultA[0] === resultA[1]; // => false
resultB[0] === resultB[1]; // => true
```

{% note info modern %}
如果只看 resultA 和 resultB 的输出 好像也没有什么区别 但是
由 Array.from 返回的 resultA 是使用不同空对象实例进行初始化得到的。
之所以发生这种情况是因为每次调用时，mapFunction，即此处的 () => ({}) 都会返回一个新的对象。
但 fill() 方法创建的 resultB 是使用相同的空对象实例进行多次填充初始化。
{% endnote %}

```javascript
const a = { b: 2 };
const resultB = Array(2).fill(a);
console.log(resultB); // => [{b: 2}, {b: 2}]
a.c = 3;
console.log(resultB); // => [{b: 2, c: 3}, {b: 2, c: 3}]
```

{% note info modern %}
由此可见 fill 引用值所得到的确实是同一个引用值  
只是执行时为多次执行 类比于 forEach()  
而这时候一旦一个值改变都将影响所有的引用 从而导致意外的值  
{% endnote %}

### Array.map()

```javascript
const length = 3;
const init = 0;
const result = Array(length).map(() => init);
result; // => [undefined, undefined, undefined]
```

{% note info modern %}
map() 创建出来的数组不是预期的 [0, 0, 0]，而是一个有 3 个空项的数组。
这是因为 Array(length) 创建了一个有 3 个空项的数组(也称为稀疏数组)，但是 map() 方法会跳过空项。
{% endnote %}

## 生成数字范围

```javascript
function range(end) {
  return Array.from({ length: end }, (_, index) => index);
}
range(4); // => [0, 1, 2, 3]
```

在 range() 函数中，Array.from() 提供了类似数组的 {length：end} ，以及一个简单地返回当前索引的 map 函数 。这样你就可以生成值范围。

## 数组去重

```javascript
function unique(array) {
  return Array.from(new Set(array));
}

unique([1, 1, 2, 3, 3]); // => [1, 2, 3]
```

由于 Array.from() 的入参是可迭代对象，因而我们可以利用其与 Set 结合来实现快速从数组中删除重复项。
首先，new Set(array) 创建了一个包含数组的集合，Set 集合会删除重复项。
因为 Set 集合是可迭代的，所以可以使用 Array.from() 将其转换为一个新的数组。
这样，我们就实现了数组去重。当然这里的 Array.from()是不如"..."(Spread syntax)的

## 结论

Array.from() 方法接受类数组对象以及可迭代对象，它可以接受一个 map 函数，  
并且，这个 map 函数不会跳过值为 undefined 的数值项.  
因此在需要填充数据的情况下 Array.from()完胜 map() 而填充基本值时不如 fill(),  
但填充引用值的时候好于 fill

参考来源:
作者：刘小夕
链接：https://juejin.cn/post/6844903926823649293
来源：掘金
