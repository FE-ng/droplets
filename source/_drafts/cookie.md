<!--
 * @Author: your name
 * @Date: 2021-07-23 17:47:49
 * @LastEditTime: 2021-07-23 17:47:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/cookie.md
-->

#### 一、Cookie 的出现

浏览器和服务器之间的通信少不了 HTTP 协议，但是因为 HTTP 协议是无状态的，所以服务器并不知道上一次浏览器做了什么样的操作，这样严重阻碍了交互式 Web 应用程序的实现。

针对上述的问题，网景公司的程序员创造了 Cookie。

#### 二、Cookie 的传输

服务器端在实现 Cookie 标准的过程中，需要对任意 HTTP 请求发送 Set-Cookie HTTP 头作为响应的一部分：

Set-Cookie: name=value; expires=Tue, 30-Apr-202114:10:21 GMT; path=/; domain=.sftcwl.com;

浏览器端会存储这样的 Cookie，并且为之后的每个请求添加 Cookie HTTP 请求头发送回服务器：

cookie: name=value;

服务器通过验证 Cookie 值，来判断浏览器发送请求属于哪一个用户。

#### 三、浏览器中的 Cookie

浏览器中的 Cookie 主要由以下几部分组成：

- **name**：Cookie 唯一的名称。
- **value**：必须经过 URL 编码处理。
- **domain**：默认情况下 cookie 在当前域下有效，你也可以设置该值来确保对其子域是否有效。
- **path**：指定 Cookie 在哪些路径下有效，默认是当前路径下。
- **expires/Max-Age**：  为此 cookie 超时时间。若设置其值为一个时间，那么当到达此时间后，此 cookie 失效。不设置的话默认值是 Session，意思是 cookie 会和 session 一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此 cookie 失效。
- **secure**：指定之后只允许 Cookie 发送给 https 协议。
- **httpOnly**：若此属性为 true，则只有在 http 请求头中会带有此 cookie 的信息，而不能通过 document.cookie 来访问此 cookie。

浏览器在发送请求时，只会将名称与值添加到请求头的 Cookie 字段中，发送给服务端。

浏览器提供了一个 API 来操作 Cookie：document.cookie  通过上述方法可以对该 Cookie 进行写操作，每一次只能写入一条 Cookie 字符串：

document.cookie='a=1; secure; path=/'

通过该方法还可以进行 Cookie 的读操作：

document.cookie // "a=1"

由于上述方法操作 Cookie 非常的不直观，一般都会写一些函数来简化 Cookie 读取、设置和删除操作。

对于 Cookie 的设置操作中，需要以下几点：

对于名称和值进行 URL 编码处理，也就是采用 JavaScript 中的 encodeURIComponent()方法（Cookie 存储不能出现中文）；

expires 要求传入 GMT 格式的日期；

```
 function setCookie(key, value, attributes) {
 	const _attributes = Object.assign({},{ path: '/'}, attributes);
 	let {domain,path,expires,secure} = _attributes;
 	if (typeof expires === 'number') {
 		expires = new Date(Date.now() + expires * 1000);
 	}
 	if (expires instanceof Date) {
 		expires = expires.toUTCString();
 	} else {
 		expires = '';
 	}
 	const _key = encodeURIComponent(key);
 	const _value = encodeURIComponent(value);
 	let cookieStr = `${key} = ${value}`;
 	if (domain) {
 		cookieStr += `;domain = ${domain}`;
 	}
 	if (path) {
 		cookieStr += `;path = ${path}`;
 	}
 	if (expires) {
 		cookieStr += `;expires = ${expires}`;
 	}
 	if (secure) {
 		cookieStr += `;secure`;
 	}
 	document.cookie = cookieStr;
}
```

Cookie 的读操作需要注意的是将名称与值进行 URL 解码处理，也就是调用 JavaScript 中的 decodeURIComponent()方法

```
function getCookie(name) {
 let cookies = \[\];
 let jar = {};
 if (document.cookie) {
	cookies = document.cookie.split('; ')
 }
 for (let i = 0, max = cookies.length; i < max; i++){
 	let \[key, value\] = cookies\[i\].split('=');
 	key = decodeURIComponent(key);
 	value = decodeURIComponent(value);
 	jar\[key\]= value;
 	if(key === name){
		break;
 	}
 }
 return name ? jar\[name\] : jar;
}
```

最后一个清除的方法就更加简单了，只要将失效日期（expires）设置为过去的日期即可：

```
function removeCookie(key) {
 setCookie(key, '', {expires: -1})
}
```

介绍 Cookie 基本操作的封装之后，还需要了解浏览器为了限制 Cookie 不会被恶意使用，Cookie 所占磁盘空间的大小以及每个域名下 Cookie 的个数。

#### 四、服务端的 Cookie

相比较浏览器端，服务端执行 Cookie 的写操作时，是将拼接好的 Cookie 字符串放入响应头的 Set-Cookie 字段中；执行 Cookie 的读操作时，则是解析 HTTP 请求头字段 Cookie 中的键值对。

**signed**

当设置 signed=true 时，服务端会对该条 Cookie 字符串生成两个 Set-Cookie 响应头字段：

```
Set-Cookie: lastTime=2021-04-30T14:31:05.543Z; path=/; httponly
Set-Cookie: lastTime.sig=URXREOYTtMnGm0b7qCYFJ2Db400; path=/; httponly
```

这里通过再发送一条以.sig 为后缀的名称以及对值进行加密的 Cookie，来验证该条 Cookie 是否在传输的过程中被篡改。

**httpOnly**

服务端 Set-Cookie 字段中新增 httpOnly 属性，当服务端在返回的 Cookie 信息中含有 httpOnly 字段时，开发者是不能通过 JavaScript 来操纵该条 Cookie 字符串的。

这样做的好处主要在于面对 XSS 攻击时，黑客无法拿到设置 httpOnly 字段的 Cookie 信息。

此时，你会发现 localStorage 相比较 Cookie，在 XSS 攻击的防御上就略逊一筹了。

**sameSite**

在介绍这个新属性之前，首先你需要明白：_**当用户从http://a.com发起http://b.com的请求也会携带上Cookie，而从http://a.com携带过来的Cookie称为第三方Cookie。**_

虽然第三方 Cookie 有一些好处，但是给 CSRF 攻击的机会。

为了从根源上解决 CSRF 攻击，sameSite 属性便闪亮登场了，它的取值有以下几种：

- **strict**：浏览器在任何跨域请求中都不会携带 Cookie，这样可以有效的防御 CSRF 攻击，但是对于有多个子域名的网站采用主域名存储用户登录信息的场景，每个子域名都需要用户重新登录，造成用户体验非常的差。
- **lax**：相比较 strict，它允许从三方网站跳转过来的时候使用 Cookie。

为了方便大家理解 sameSite 的实际效果，可以看这个例子：

```
// a.com 服务端会在访问页面时返回如下Cookie
cookies.set('foo','aaaaa')
cookies.set('bar','bbbbb')
cookies.set('name','cccccc')

// b.com 服务端会在访问页面时返回如下Cookie
cookies.set('foo','a',{sameSite:'strict'})
cookies.set('bar','b',{sameSite:'lax'})
cookies.set('baz','c')
```

如何现在用户在[a.com](http://a.com/)中点击链接跳转到[b.com](http://b.com/)，它的请求头是这样的：

Request Headers

Cookie: bar = b; baz = c
