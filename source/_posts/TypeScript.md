---
title: TypeScript
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/202112231519723.png
date: 2021-12-14 17:31:12
categories:
  - 推荐
tags:
  - task
  - list
---

#

## TS 中的一些符号

! 断言操作符
断言某个变量不会是 null/undefined，告诉编辑器停止报错。

?. 链判断运算符

?.运算符，可选链
直接在链式调用的时候判断，左侧的对象是否为 null 或 undefined。如果是的，就不再往下运算，而是返回 undefined。

## TS 中的一些关键词

type
自定义类型

interface
interface 也是用来定义类型的

typeof
typeof 可以获取一个变量的声明类型
在 JavaScript 中， typeof 可以判断一个变量的基础数据类型， 在 TS 中，它还可以获取一个变量的声明类型

const obj = { a: '1' };type Foo = typeof obj; // type Foo = { a: string }

keyof

```ts
keyof 可以获取一个对象接口的所有 key 值
type Obj = { a: string; b: string }type Foo = keyof obj;// type Foo = 'a' | 'b';
```

in
in 可以遍历枚举类型

```ts
type Keys = 'a' | 'b' | 'c';
type Obj = { [T in Keys]: string };
// in 遍历 Keys，并为每个值赋予 string 类型
// type Obj = {//     a: string,//     b: string,//     c: string// }
```

## TS 一些工具泛型的使用及其实现

### Partial

Partial 作用是将传入的属性变为可选项.
首先我们需要理解两个关键字 keyof 和 in, keyof 可以用来取得一个对象接口的所有 key 值.
比如

```ts
interface Foo {
  name: string;
  age: number;
}
type T = keyof Foo; // -> "name" | "age"
```

而 in 则可以遍历枚举类型, 例如

```ts
type Keys = 'a' | 'b';
type Obj = {
  [p in Keys]: any;
}; // -> { a: any, b: any }
```

keyof 产生联合类型, in 则可以遍历枚举类型, 所以他们经常一起使用, 看下 Partial 源码

```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

上面语句的意思是 keyof T 拿到 T 所有属性名, 然后 in 进行遍历, 将值赋给 P, 最后 T[P] 取得相应属性的值.
结合中间的 ? 我们就明白了 Partial 的含义了.

### Required 将类型的属性变成必选

```ts
type Required<T> = { [P in keyof T]-?: T[P] };
```

我们发现一个有意思的用法 -?, 这里很好理解就是将可选项代表的 ? 去掉, 从而让这个类型变成必选项. 与之对应的还有个+? , 这个含义自然与-?之前相反, 它是用来把属性变成可选项的.

### Pick

Pick 从某个类型中挑出一些属性出来

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

### Record

```ts
type Record<K extends keyof any, T> = { [P in K]: T };
```

### Mutable

类似地, 其实还有对 + 和 -, 这里要说的不是变量的之间的进行加减而是对 readonly 进行加减.
以下代码的作用就是将 T 的所有属性的 readonly 移除,你也可以写一个相反的出来.

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

### Readonly

Readonly 类型的属性变成只读

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

### ReturnType

在阅读源码之前我们需要了解一下 infer 这个关键字, 在条件类型语句中, 我们可以用 infer 声明一个类型变量并且对它进行使用,
我们可以用它获取函数的返回类型， 源码如下

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

其实这里的 infer R 就是声明一个变量来承载传入函数签名的返回值类型, 简单说就是用它取到函数返回值的类型方便之后使用.
具体用法

```ts
function foo(x: number): Array<number> {
  return [x];
}
type fn = ReturnType<typeof foo>;
```
