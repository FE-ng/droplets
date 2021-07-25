<!--
 * @Author: your name
 * @Date: 2021-07-23 17:04:25
 * @LastEditTime: 2021-07-23 17:31:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/camera.md
-->

## 一、需求：H5 调手机摄像头扫描条形码并获取到条形码的内容

## 二、拆解需求后需要解决两个问题：

1\. H5 怎么调手机摄像头?  
2\. 调起摄像头后怎么扫描条形码并获取到条形码的内容？

## 三、解决方案：

本次用到了第三方插件 quagga.js。quagga.js 是一个完全由 js 编写的扫描条形码插件，支持实时流解析和静态图片解析。本次项目采用的是实时解析手机摄像头拍到的条形码，此时需用到 html5 的 getUserMedia 属性；调起后置摄像头用到了 MediaDevices 的 enumerateDevices()方法，获取到用户手机的后置摄像头的设备 ID。

## 四、具体步骤：

### 1\. 怎么调起摄像头？

- 这里就要用到 MediaDevices.getUserMedia()啦，MediaDevices.getUserMedia()会提示用户给予使用媒体输入的许可（这里会请求打开手机摄像头），点击允许后，会调起摄像头并返回一个 promise 对象，成功后会 resolve 回调一个 MediaStream 对象。
- 注意点：mediaDevices.getUserMedia()在大多数浏览器中访问需要安全来源,除了[http://localhost 外，需要在 https 环境下才能调起摄像头。](http://localhost%E5%A4%96%EF%BC%8C%E9%9C%80%E8%A6%81%E5%9C%A8https%E7%8E%AF%E5%A2%83%E4%B8%8B%E6%89%8D%E8%83%BD%E8%B0%83%E8%B5%B7%E6%91%84%E5%83%8F%E5%A4%B4%E3%80%82/)
- mediaDevices.getUserMedia()还需要给传个参数 constraints，告诉它想要调 video 还是 audio，还是都要调。
- constraints 参数是一个包含了 video 和 audio 两个成员的 MediaStreamConstraints 对象，用于说明请求的媒体类型。必须至少一个类型或者两个同时可以被指定。

- 接着来实操一把，用 video 接住这个 stream，就能看见拍到的东西啦。

  ```
  const video = document.querySelector('video');
  // 给video设置为true，或者下面的直接设置分辨率
  //const constraints = {
  //    video: true
  //}
  // 给video设置为想要的摄像头分辨率
  const constraints={video : {width: 480, height: 320}};
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    /* 在这里就可以使用这个stream啦 */
     video.srcObject = stream;
     //srcObject属性 见底部参考资料3
     video.play();
  })
  .catch(function(err) {
    /* 处理error */
    console.log(err);
  });
  ```

- 但是，运行完上面的代码怎么调起的前置摄像头呢，我明明是想调后置摄像头的。玄机还是藏在 constraints 了，还有个属性控制着前置后置摄像头 ---- facingMode

  ```
  // 调前置摄像头
  video: { facingMode: "user" }
  // 强制掉后置摄像头
  video: { facingMode: { exact: "environment" }
  // 完整的constraints
  const constraints = {
      video : {
          width: 480, 
          height: 320
          facingMode: { exact: "environment" }
      }
      
  };
  ```

- 但是为啥有的能调起后置摄像头，有的还是调的前置呢（试了两个巴枪，两个安卓机，一个巴枪和一个安卓机调的前置，另两个调的后置）；这就奇了怪了， 经查证，原来设置了 facingMode 也不能精确的调起后置摄像头。那么怎么才能让有后置摄像头的手机都能调起后置摄像头呢？

### 2\. 如何调起后置摄像头

- MediaDevices 的方法 enumerateDevices()闪亮登场。
- MediaDevices 的方法 enumerateDevices()能获取到摄像头的设备 ID，无论手机有几个摄像头都能给你获取到。
- navigator.mediaDevices.enumerateDevices()返回一个 promise，成功后会 resolve 回调一个数组，这个数组里包含着描述设备的 deviceId。

  ```
  // 来一个MDN上的例子
  // 列出相机和麦克风。

  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device);
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
  // 在Mac上运行后打印出的信息
  // InputDeviceInfo {deviceId: "583146e6c9055fd1d33160ee0751aaf1aebd3d43ffe4290a3f28b0644278390b", groupId: "30088fbe16e1ab136a89cb82907bbcd6aa346f1f87e0c51623d895cd37f9fb1f", kind: "videoinput", label: "FaceTime HD Camera"}
  // MediaDeviceInfo {deviceId: "", groupId: "3684b400de4581e57660f0679c8be229e7b8cb20b0e6af8ac62b251b4da77581", kind: "audiooutput", label: ""}
  ```

- 加上一层判断 device.kind === 'videoinput' && device.label.indexOf('back') !== -1 时就能获取到所有后置摄像头的 deviceId。

  ```
  let deviceId = '';
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('该浏览器 不支持获取后置摄像头设备ID');
    return;
  }

  function getDevices(mediaDevices) {
    mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput' && mediaDevice.label.indexOf('back') !== -1) {
        deviceId = mediaDevice.deviceId; // 获取一个就行
        return;
        }
    });
  }
  navigator.mediaDevices.enumerateDevices().then(getDevices).catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
  ```

- ```
  完整的constraints的配置
  ```

  ```
  // 完整的constraints的配置
  const constraints = {
      video : {
          width: 480,
          height: 320, 
          facingMode: { exact: "environment" }, 
          deviceId: {  exact: 'bf3f610f773db7205d763c3df876d9f6c391859cc81e4d2947abcdedd00f720d' }
          // 我的手机后置摄像头的ID
      }
  }
  ```

到这里就能都精准的调起后置摄像头了。

### 3.  怎么正确的获取到条形码的内容呢–条形码的编码格式

扫描条形码用到了 quagga.js， 那么 quagga.js 怎么准确的解析出条形码的内容呢，当然是知道要扫描的条形码的类型，经查资料，物流中一般是 code128 的格式，所以在 quagga 中配置的条形码类型为**code_128_reader**。

### 4\. 完整的 quagga 配置

quagga 中已经集成了 getUserMedia 和 enumerateDevices，我们传配置和调方法就行啦。

npm install quagga --save； --------安装  
import Quagga from 'quagga'; -------- 项目中引入

```
const video = document.querySelector('video');   //Quagga提供了video元素
if(video){
  console.log('init前video: ', video);
  video.style.display = 'block';
}

// Quagga.init 初始化
Quagga.init({
      inputStream : {
          name : "Live",
          type : "LiveStream", // 使用摄像机从实时流中解码图像
          constraints: {
            facingMode: "environment", // 约束调起后置摄像头
            deviceId: deviceId  //获取到的后置摄像头的deviceId
          },
          target: document.querySelector('.photo-view'), // 用户显示画面的目标元素， Quagga写好的vedio元素就放在这个元素里，
      },
      decoder : {
          readers:\['code\_128\_reader'\],  // 解码的条形码类型 项目中的是扫描物流运单号和茅台酒的物流码，所以用的这个
          debug: {
              drawBoundingBox: false,
              showFrequency: false,
              drawScanline: false,
              showPattern: false
          },
          multiple: false // multiple属性设置为false，在找到有效的条形码后不会继续解码了
      }
  }, function(err) { // 初始化完成后的回调
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start(); // 启动视频流并开始查找和解码图像。
      Quagga.onProcessed(function(data){
          console.log('识别中', data)
      })
      Quagga.onDetected(function(data){
            // 识别成功，拿到条形码内容
          console.log('data.codeResult.code: ', data.codeResult.code);
          
          Quagga.stop();  // 停止识别，断开摄像头的连接
          const video = document.querySelector('video');
          if(video) {
            video.style.display = 'none';
          }
      })
  });


 // 解码的条形码类型
code\_128\_reader ( 默认值)
ean_reader
ean\_8\_reader
code\_39\_reader
code\_39\_vin_reader
codabar_reader
upc_reader
upc\_e\_reader
i2of5_reader
2of5_reader
code\_93\_reader
```

### 参考资料

1 MediaDevices.getUserMedia() [https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)

2 MediaDevices.enumerateDevices() [https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices)

3 srcObject [https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/srcObject](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/srcObject)

4 Quagga github [https://github.com/serratus/quaggaJS](https://github.com/serratus/quaggaJS)

5 [https://serratus.github.io/quaggaJS/](https://serratus.github.io/quaggaJS/)

6 Quagga 中文  [https://hant.kutu66.com/GitHub/article_117347](https://hant.kutu66.com/GitHub/article_117347)
