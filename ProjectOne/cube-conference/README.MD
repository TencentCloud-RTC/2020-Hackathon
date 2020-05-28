# 魔方会议 TRTC Web 版

## 项目介绍
魔方会议主要面向企业用户，和一些企业的定制化需求，产品的定位是做一个开放的技术平台，目标是为了更好的服务不同行业的办公人群，让沟通与协作变得更轻松。

## 框架概要
魔方会议 Web 版使用原生 JavaScript 开发，其中集成了主要库有 `trtc.js`、`socket.io.js`、`qrcode.js`、`sp-graphic.js` 和 `cubepack`

 - `cubepack`： 魔方团队开发的轻量级的 Web 包管理工具，用于项目的构建和工程化管理
 
 - `trtc.js`：腾讯实时音视频 SDK，用于音视频通信
 
 - `socket.io`：用于管理私有信令层，聊天室，白板，会控等数据通道管理
 
 - `qrcodejs`: 用于生成二维码，快速分享给其他人 
 
 - `sp-graphic`: 魔方团队开发的实时图形处理库，用于会议中的白板功能

## 环境要求

- Node.js v8.0+
- npm 5.6.0+
- Chrome 47+
- 魔方会议 Web 版依赖以下测试域名和端口进行数据传输，请提前配置好防火墙白名单。
- 域名：jellycode.cn，端口：3000

## 初始化项目

```sh
$ npm install
```

> 需要注意的是，由于目录结构的原因，初始化项目后需要对 cubepack 稍作改动。


## 编译项目
```
$ npm run build
```

## 启动项目

- 用浏览器打开 index.html

> 需放到 HTTP 服务中访问，类似于：`http://localhost:8080/`。


## 目录介绍
```
├── images              资源目录
│   ├── wb             白板工具图标
│   └── *              其它模块图标
├── dist                编译后的文件目录
├── lib                 依赖库
├── node_modules        开发依赖
├── src                 源代码
├── styles              样式
├── index.html          首页
└── conference.html     主页
```

## 核心模块介绍

- `Conference.js` - 项目核心类，用于操作 TRTC 接口，管理会控指令、消息等业务逻辑。
- `ViewManager.js` - 视图管理器，用于区分会议逻辑和视图控制。
- `Participant.js` - 参会成员模型，用于管理参会成员的流及部分业务逻辑。
- `Helper.js` - 辅助工具
- `UI.js` - UI 工具，包含一些常用的 UI 组件，及一些简化 dom 操作的 API
- `models/*` - 各个弹出层模块。

## 其它

> 音频参数设置


| 参数项 | 当前采用 | 补充 |
| ------ | ------ | ------ |
| codec | opus | 支持 opus, pcmu, pcma, aac, ac3, nellymoser |
| sampleRate | 48000 | 可设置 48000， 32000，16000 |
| channelNum | 2 | 可设置 2 ，1 |
| VAD | 开启 | 静音抑制，可关闭 |
| AGC | 关闭 | 自动增益控制，可开启 |
| ANS | 关闭 | 噪音抑制，可开启 |
| AEC | 关闭 | 回声消除，可开启 |


> 视频参数设置

| 参数项 | 当前采用 | 补充 |
| ------ | ------ | ------ |
| codec | vp8 | 支持 h264, vp8, h265, vp9 |
| frameRate | 30 | 可设置 6， 12，15, 24， 30， 48， 60 |
| simulcast | 开启 | "f", "h"
