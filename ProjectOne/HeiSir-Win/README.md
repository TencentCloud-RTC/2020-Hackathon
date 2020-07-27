
### 产品介绍
产品名：云桌面

开发日期：2020-05-26

版本：v1.0

介绍：云桌面是一款帮助用户不管在何时何地都可以通过其他终端（包括但不限于电脑、手机、pad）远程控制自己的终端实现办公、甚至是玩游戏的系统软件。最终希望云桌面可以运行在各大主流终端上，帮助人们解决远程办公的问题。

---

官网：[云桌面系统](https://heisir.djdeveloper.cn:3005/)
软件下载：[云桌面系统](https://github.com/HeiSir2014/2020-Hackathon/releases/download/v1.0/Release.zip)

### 背景需求
目前市场上的无人值守的远程工具我了解到的也就Teamviewer、向日葵。

对于Teamviewer，不可否认远程是挺好用的，但是日常使用起来Teamviwer的限制太多了，使用的频率和时间高了之后会经常被5分钟限制，而购买的费用偏高（个人最低配置版一年1000元），其收费模式不是很合适；

而向日葵，使用起来很卡很模糊，体验极为不佳，根本没有远程的欲望。

综合以上各种因素，所以就产生了实现此产品的想法。

### 商业价值
现阶段，桌面远程工具使用的用户群还是比较多的，再加上受疫情影响，大家在家办公之后，作为开发者的我基本就是靠远程工具上班的。
接下来在云计算普及后，假设大家在云端都有一台个人主机，平时办公玩游戏只是通过简单的输入终端远程连接到云主机上进行操作。那么每个人都会用到远程工具，那将是远程桌面的春天。
### 产品架构
#### 界面
此产品有2个界面，分别是软件主页面和远程控制页面。

![image.png](https://github.com/HeiSir2014/2020-Hackathon/blob/master/ProjectOne/HeiSir-Win/Resource/1.png?raw=true)

![image.png](https://github.com/HeiSir2014/2020-Hackathon/blob/master/ProjectOne/HeiSir-Win/Resource/2.png?raw=true)

#### 技术思路
客户端启动之后通过长连接接入信令服务器，当用户需要远程某一台终端时，信令服务器下达指令使此终端通过TRTC sdk接入到指定房间并分享终端的桌面，然后用户那端可以通过TRTC sdk的消息传送当前的鼠标和键盘消息给欲被控制的终端，接着使用模拟控制输入达到远程控制的效果。
#### 技术架构

![image.png](https://github.com/HeiSir2014/2020-Hackathon/blob/master/ProjectOne/HeiSir-Win/Resource/image.png?raw=true)


### 软件说明书
#### 环境
操作系统：Windows7及以上

软件环境：.Net4.5及以上、云桌面

内存：2G以上

网络：正常连接互联网。

#### 使用说明
可以官网下载软件安装包，安装成功后，双击启动云桌面，她会显示一个界面取下图

![image.png](https://github.com/HeiSir2014/2020-Hackathon/blob/master/ProjectOne/HeiSir-Win/Resource/1.png?raw=true)

界面左侧显示终端硬件码ID和一个临时密码。右侧是输入其他终端ID和密码的地方，输入终端ID和密码后，点击开始连接按钮进行远程控制其他终端。

如果您有另外一台主机，也安装了此软件，这时候就可以进行远程控制了。

#### 软件演示视频

### [演示视频](https://heisir.djdeveloper.cn:3005/)

### 未来规划
目前软件功能还不完善，在这里列举出几点未来有待实现的功能。

功能 | 描述
---|---
用户系统 | 实现终端信息同步功能
剪辑版同步 | 方便复制粘贴
文件传输 | 在远程过程中快速传输文件
多屏切换 | 用户存在多个显示器时多个屏幕可以切换控制那个


### 致谢
目前云桌面是使用TRTC SDK开发完成的，在此感谢TRTC，感谢腾讯云提供这么好的平台，祝腾讯云越做越好。

### 关于对TRTC的建议
TRTC目前主要方向是在多人互动音视频上，建议可以增加一种远程桌面的高实时、高清晰度模式，那么云桌面在未来体验会更好。

### 联系作者

公司：上海岱嘉

昵称：HeiSir

QQ：1586462

微信：
<img src="https://github.com/HeiSir2014/2020-Hackathon/blob/master/ProjectOne/HeiSir-Win/Resource/mmqrcode.png?raw=true" width="240px" />
