---
title: 直接赋值字符串和new String()的区别
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625162500.png
date: 2021-07-08 14:48:59
categories:
  - javascript
tags:
  - javascript
---

<!--
 * @Author: your name
 * @Date: 2021-07-08 14:48:59
 * @LastEditTime: 2021-07-08 15:26:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_posts/JavaScript/直接赋值字符串和new String()的区别.md
-->

# 创建一个字符串

JS 中创建字符串的方法主要有三种：

1. 字符串字面量 `const str = 'foo';`
2. New String 实例化`const str = new String("foo");`
3. String 构造函数转换`const str = String('foo')`;

但是三者之前的区别我们很多时候并没有探究,只不过进行'=='比较时这些知识却显得尤为重要;

# 结论:

> 1. 通过 String 构造函数转换的字符串和字符串字面量都是 `primitive` 值（原生值、基本数据类型）; primitive 值并不会拥有自己的属性与方法。
> 2. 通过 New String 来实例化的是一个 String 对象，成为了内置属性`[[PrimitiveValue]]`,String 的实例享有 String.prototype 上所有的方法.

# 结论与悖论

简单来看个例子

```javascript
var a = 'foo';
var b = new String('foo');
var c = String('foo');

console.log(a); // foo
console.dir(b); // String {0: "f", 1: "o", 2: "o", length: 3, [[PrimitiveValue]]: "foo"}
console.log(c); // foo

console.log(typeof a); // "string"
console.log(typeof b); // "object"
console.log(typeof c); // "string"

console.log(a == b); // true
console.log(a === b); // false
console.log(a === c); // true

console.log(a.charAt === b.charAt); // true
```

1. 从 a 和 c 的输出以及`typeof a`、`typeof b`的值我们可以很简单验证结论(1)中

   > 通过 String 构造函数转换的字符串和字符串字面量都是 `primitive` 值（原生值、基本数据类型）;

2. b 的输出 `typeof b`的值可以验证结论(2)中

   > 通过 New String 来实例化的是一个 String 对象，成为了内置属性`[[PrimitiveValue]]`;

3. 从 `b.charAt` 可以验证结论(2)中

   > String 的实例享有 String.prototype 上所有的方法.

4. `a.charAt` 却和结论(1)中

   > primitive 值并不会拥有自己的属性与方法。相悖

我们在结论中说到 primitive 值并不会拥有自己的属性与方法。但是我们开发时经常会直接使用字面量变量的方法,这不是自相矛盾了么?

# 悖论解释

> 每当我们尝试访问一个 `primitive` 值的属性时，JS 引擎内部会调用一个内置`[[toObject]]`方法，
> 例子中字面量的'foo'转为一个`[[PrimitiveValue]]` 临时的'foo' String 对象，
> 然后从其原型链中尝试查找需要访问的属性，使用结束后再释放掉这个 String 对象。

## `[[toObject]]`规则

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210708152419.png"  alt="效果图" />

(ECMA-262/5.1 Edition)[https://262.ecma-international.org/5.1/#sec-9.9]  
该逻辑适用于所有 primitive 类型的字面值(Undefined, Null, Boolean, String, Number)。
