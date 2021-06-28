---
title: protobuf
date: 2021-06-26 16:13:18
cover: https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210625162500.png
categories:
  - javascript
tags:
  - 数据结构
---

# Protocol Buffer(protobuf)是 Google 提供的一种数据序列化协议

官方解释：

> Protocol Buffers are a language-neutral, platform-neutral,
> extensible way of serializing structured data for use in communications protocols,
> data storage, and more, originally designed at Google

译：Protocol Buffers 是一种轻便高效并且和语言、平台无关、可扩展的序列化结构数据格式,很适合作为数据存储或者通信交互的格式。

## 序列化

是将对象的状态信息转换为可以存储或传输的形式的过程，前端接触最多的就是 JSON 序列化的 api；如下

```javascript
const obj = { message: 'Hello World!' };
const str = JSON.stringify(obj);
const res = JSON.parse(str);
```

## 二进制

```javascript
// node
const buf = Buffer.from('Hello World!');
console.log(buf);
// <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>
```

## How fast ?

<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628105650.png"  alt="效果图" />
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628105933.png"  alt="效果图" />
从官方的测试数科院看到一条消息数据，用 protobuf 序列化后的大小是 json 的 10 分之一，只有 xml 格式的 20 分之一，但是性能却是它们的 5~100 倍!  
这是飞一样的感觉~~这也就是为什么我们要了解它的原因,万一哪天用到了呢;快的原因这里不去深究,感兴趣的同学可以从文献中参考一二;  
proto3 中导入 proto2 定义的消息类型，反之亦然。然而，proto2 中的枚举不能直接用在 proto3 语法中（但导入到 proto2 中 proto3 定义的枚举是可用的）。

# 定义

proto3 比 proto2 支持更多语言却更加简洁。去除了一些复杂的语法和特性，更强调约定而弱化语法,所以我们基于 proto3 进行示例;
test.proto 文件如下
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110009.png"  alt="效果图" />
其中
syntax = "proto3”;指定 proto 版本，默认为 proto2，并且在 proto 文件中必须是第一行
proto 文件可以相互引用（import），因此 package 可以给文件一个的命名空间 防止消息类型之间的名称冲突
message 消息类型,前端理解成一个 interface 会事半功倍;
消息类型中的定义都遵循 `[keywords?] [type] [custom_key] = [tag]`

1. keywords:

   - singular 格式正确的消息可以有 0 个或 1 个该字段(但不能多于 1 个)。proto3 语法的默认字段规则；
   - repeated 格式正确的消息中该字段可以重复任意次数（包括 0 次）。重复值的顺序将被保留；
   - reserved 在使用彻底删除或注释掉某个字段的方式来更新消息类型时，

   将来其他用户再更新该消息类型时可能会重用这个字段编号。

   后面再加载该 .ptoto 的旧版本时会如数据损坏，隐私漏洞等问题。

   防止该问题发生的办法是将需要删除字段的编号（或字段名称，字段名称会导致在 JSON 序列化时产生问题）设置为保留项 reserved；

2. type:

   - 可以是数据中自己定义的 message(理解成 interface 可以被嵌套使用)；
   - 也可以是 type 类型对应表中的值(和定义 interface 时的类型声明类似)；

3. custom_key: 自己定义的 key 键；
4. tag: proto 文件中对我们 custom_key 键的描述,或者理解成 react 组件中的唯一 key 值；

tag 用于在消息二进制格式中标识字段，同时要求消息一旦使用字段编号就不应该改变。
另外 1 到 15 的字段编号需要用 1 个字节来编码，编码同时包括 tag 本身的值和以及该 tag 对应的 type。
16 到 2047 的字段编号需要用 2 个字节。
因此应将 1 到 15 的编号用在消息的常用字段上。注意应该为将来可能添加的常用字段预留字段编号。
最小的字段编号为 1，最大的为 2^29 - 1(536,870,911)。
注意不能使用 19000 到 19999 （FieldDescriptor::kFirstReservedNumber 到 FieldDescriptor::kLastReservedNumber）的字段编号，因为这些是 protocol buffer 内部保留的
如果使用了这些预留的编号 或者之前用户自己保留的字段(reserved)protocol buffer 编译器会发出警告。

此外 pb 还支持嵌套,枚举,定义 map(`map<key_type, value_type> map_field = N`);

type 类型对应表格:
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110040.png"  alt="效果图" />

# 选择一个好的工具

- [protobuf.js](https://github.com/protobufjs/protobuf.js)
- [Google protobuf js](https://github.com/protocolbuffers/protobuf/tree/master/js)
- [protocol-buffers](https://github.com/mafintosh/protocol-buffers)

目前流行的是以上三种从使用者的数量和文档完善程度，在 node 端 protobuf.js 能够直接读取 proto 文件等方面考虑
本次的示例是选择 protobuf.js 当然大家感兴趣也能去选择别的工具.

# Talk is cheap show me your code！

了解了一些基础的概念之后我们就可以下狠手了！

## 浏览器中（前端）使用

前端无法处理 proto 类型的文件，因此需要使用 protobuf.js 工具库
安装之后在./node_modules/protobufjs/bin/pbjs 文件目录里提供了 pbjs 命令
不过命令藏得很深 并且没有设置 alias 所以推荐使用 npx 将我们之前的 test.proto 文件进行转化;

> npx pbjs -t json _.proto > _.json
> 将 proto 转化成 json

> npx pbjs -t json-module -w commonjs -o _.js _.proto
> 将 proto 转化成 js

**这里推荐转化成 js 因为转成 json 也得用内置的 api(本质还是转成了 js)转化之后才能获得需要的数据；**

### proto 文件转成的 json 文件

json 文件中会把 proto 文件中的信息根据 proto 的规则进行转化  
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110054.png"  alt="效果图" />

### proto 文件转成的 js 文件

可以看到 js 文件比起 json 文件区别就是$protobuf 进行了一次封装，从而提供给了我们可操作的 api；
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110229.png"  alt="效果图" />

获取数据并且使用对应的 proto 进行数据解析
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110246.png"  alt="效果图" />
result:
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110301.png"  alt="效果图" />
pbMessage:
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110313.png"  alt="效果图" />
data:
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110326.png"  alt="效果图" />

## node 中的使用

有部分资料还是说在 node 环境中也需要像浏览器环境一样把 proto 文件进行处理再使用，

但是 protobufjs 的库能够让我们直接在 node 环境中使用 pb 文件不需要额外的处理;这也是我们选择 protobujs 的理由之一

node 中的使用和浏览器中差异并不大，只是 node 因为 protobufjs 的便携性 可以不用使用转化后的文件，而是直接使用 proto 文件进行处理；
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110354.png"  alt="效果图" />

### node 输出

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110419.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110433.png"  alt="效果图" />
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110510.png"  alt="效果图" />

到此 node 端简单的用法也就完成了，包含了编码和解码；
<img class="image400" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210628110519.png"  alt="效果图" />

# 结语

选择什么方案都是结合当前自己的需求来判别,protobuf 虽然在资源上的占比传输上都很优秀,个人感觉在当前没有性能上的硬性要求时也不用刻意使用,

毕竟 protobuf 的传输都建立在二进制上，数据上如果有问题调试起来非常困难，并且也需要前后端共同维护一份 proto 定义，维护、沟通的成本也得考虑，

不过维护的处理方式也可以有别的方式（子仓库，动态 pb 等）不过后端传 proto 文件，前端处理处理也就根据麻烦了，因此因地制宜才是上策。

参考文献:

- https://developers.google.com/protocol-buffers/docs/proto3
- https://www.deadalnix.me/2017/01/08/variable-size-integer-encoding/
- https://zhuanlan.zhihu.com/p/73549334
- https://www.jianshu.com/p/72108f0aefca
