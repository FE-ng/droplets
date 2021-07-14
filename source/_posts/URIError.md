---
title: 'URIError: URI malformed'
date: 2021-07-14 17:25:15
tags:
---

# URIError: URI malformed

最近在使用 decodeURIComponent 的时候，发现浏览器参数中含有特殊符号%，会导致 decodeURIComponent 解码报错
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210714173129.png"  alt="效果图" />

# encodeURIComponent

首先我们需要知道 encodeURIComponent 是对 v8 内置的对于浏览器参数进行编码的函数而 decodeURIComponent 是对其进行解码。

例如在 `https://droplets.vercel.app/?droplets%E5%8D%9A%E5%AE%A2%E5%A5%BD%E8%AF%84%E7%8E%8799` 中使用`decodeURIComponent(window.location.href)`  
我们能正常解析得到 `https://droplets.vercel.app/?droplets博客好评率99`  
但是在 `https://droplets.vercel.app/?param=droplets%E5%8D%9A%E5%AE%A2%E5%A5%BD%E8%AF%84%E7%8E%8799%` 中使用时  
我们能预期的正常解析为 `https://droplets.vercel.app/?droplets博客好评率99%`  
差别点在于**99**变成了**99%**  
但此时调用`decodeURIComponent(window.location.href)`就会报错  
严重时一旦应用中没有相应的处理就会直接导致页面的崩溃;P0 级别难受呀

之所以我们需要使用 encodeURIComponent 是为了处理浏览器中的不安全字符 避免一定程度的 xss 攻击

| 不安全符号 | 解释                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------- |
| 空格       | Url 的传输，用户的排版，文本程序处理 Url 的过程，都有可能引入多余的空格，或者将去除了由意义的空格 |
| 引号以及<> | 引号和尖括号通常用于在普通文本中起到分隔 Url 的作用                                               |
| #          | 通常用于表示书签或者锚点                                                                          |
| %          | 百分号本身用作对不安全字符进行编码时使用的特殊字符，因此本身需要编码                              |
| {}\^[]`~   | 某一些网关或者传输代理会篡改这些字符                                                              |
| &          | URL Search 分隔符                                                                                 |
| =          | URL 中指定参数的值                                                                                |

# 逐本溯源

[encodeURIComponent v8 源码](https://chromium.googlesource.com/v8/v8/+/3.30.3/src/uri.js?autodive=0%2F)
<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210714174536.png"  alt="效果图" />

找到 `encodeURIComponent` 函数;
我们可以发现函数只是内置了一个简单的校验函数`unescapePredicate`,  
并使用闭包将数据值以及校验函数传给了`Encode`函数;
其中`isAlphaNumeric`进行了数字和字母的校验;
然后我们就可以进入到`Encode`中查看逻辑

<img class="image600" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210714175055.png"  alt="效果图" />

我们可以惊喜的发现`URI malformed`的报错已经在我们眼前,那说明`%`导致的问题就是由此三者抛出的  
其中`unescape`就是我们传入的校验函数`unescapePredicate`,  
实际上`%`经过函数之后会`return false`也佐证了`%`的处理 会走到 for 循环中共的 else 模块;
我们可以使用以下代码进行简单的处理

```javascript
const cc1 = '%'.charCodeAt();
console.log(cc1 < 0xd800 || cc1 > 0xdbff);
// true
```

运气不错直接进入了第一个报错;由此报错的底层原因也找到了

# 怎么处理呢?

## 对%进行处理

```javascript
const percent2percent25 = (URI) => {
  if (URI.indexOf('%') > -1) {
    return URI.replace(/%/g, '%25');
  } else {
    return URI;
  }
};
```

## 对查询关键字中的特殊字符进行编码

```javascript
function encodeSearchKey(key) {
  const encodeArr = [
    {
      code: '%',
      encode: '%25',
    },
    {
      code: '?',
      encode: '%3F',
    },
    {
      code: '#',
      encode: '%23',
    },
    {
      code: '&',
      encode: '%26',
    },
    {
      code: '=',
      encode: '%3D',
    },
  ];
  return key.replace(/[%?#&=]/g, ($, index, str) => {
    for (const k of encodeArr) {
      if (k.code === $) {
        return k.encode;
      }
    }
  });
}
```

## 简单明了的 try...catch

```javascript
function decodeURIComponentSafely(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    console.log('URI Component not decodable: ' + uri);
    return uri;
  }
}
```
