---
title: js数据结构
date: 2021-06-25 16:23:26
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625162500.png
categories:
  - javascript
tags:
  - 数据结构
---

# stack 栈

在 JavaScript 中，栈和队列的实现一般都依赖于数组。
栈是一种遵循后进先出（LIFO）原则的有序集合。新添加或待删除的元素都保存在栈的同一端，称作栈顶，另一端就叫栈底。  
在栈里，新元素都靠近栈顶，旧元素都接近栈底。
两者的区别在于，它们各自对数组的增删操作有着不一样的限制。
在现实生活中也能发现很多栈的例子。例如，一摞书或者餐厅里叠放的盘子。
栈的实际应用非常广泛。在回溯问题中，它可以存储访问过的任务或路径、撤销的操作。

模拟栈之前我们需要了解栈的特性:

- 能够让元素入栈和出栈
- 能够返回栈顶和栈底的元素
- 含有能够判断自身是否为空
- 能够得到自己的长度
- 能够清空栈

```javascript

class Stack() {
  construct() {
    this.stackArr = [];
  }
  // 入栈
  push(item) {
    return this.stackArr.push(item);
  }
  // 出栈
  pop(){
    return this.stackArr.pop(item);
  }
  // 查看栈顶
  peekTop() {
    return this.stackArr[this.stackArr.length -1];
  }
  // 查看栈底
  peekBottom() {
    return this.stackArr[0];
  }
  // 获取栈的长度
  size() {
    return this.stackArr.length;
  }
  // 判断是否为空栈
  isEmpty() {
    return this.stackArr.length === 0;
  }
  // 清空栈
  clear() {
    return this.stackArr.length = 0;
  }
}
```

# queue 队列

队列是遵循先进先出（FIFO，first in first out）原则的一组有序的项。  
队列在，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

在现实中，最常见的队列的例子就是排队。
同样的模拟队列之前我们需要了解队列的特性:

- 尾部添加新元素
- 头部移除元素
- 能够返回栈顶和栈底的元素且不影响自身
- 含有能够判断自身是否为空
- 能够得到自己的长度
- 能够清空栈

```javascript
// 从队列删除元素
class Queue {
  construct() {
    this.items = [];
  }
  //  添加元素进入队列
  enqueue(element) {
    this.items.push(element);
  }
  // 从队列删除元素
  dequeue() {
    return this.items.shift();
  }
  // 获取队列中第一个元素
  front() {
    return this.items[0];
  }
  // 判断队列是否为空
  isEmpty() {
    return this.items.length == 0;
  }
  // 队列长度
  size() {
    return this.items.length;
  }
  // 清空队列
  clear() {
    this.items = [];
  }
}
```

# Linked List 链表
