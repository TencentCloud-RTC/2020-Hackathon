const fs = require("fs")
const path = require('path');

//引入 SDK 和相关模块
//将 require 中路径替换为项目中 SDK 的真实路径
const tencentcloud = require("./sdk");
const Asr = tencentcloud.asrRealtime;
const Config = tencentcloud.config;

//Config实例的三个参数分别为 SecretId, SecretKey, appId。请前往控制台获取后修改下方参数
let config = new Config("AKIDSkwwmSIERWR9h4TfDamtreFhEpKllHMV", "MdnuvshXJzmP7lEcswtgSCmDXo2AOUjv", 1255627983)

//设置接口需要参数，具体请参考 实时语音识别接口说明
let query = {
  engineModelType: '16k_0',
  resultTextFormat: 0,
  resType: 0,
  voiceFormat: 1,
  cutLength: 50000,
}
//创建调用实例
const asrReq = new Asr(config, query)

//调用方式1:识别整个文件
//需要将"本地文件地址"替换为用户需要识别的文件地址，例：'./test.wav'
let filePath = path.resolve('本地录音文件地址');
let data = fs.readFileSync(filePath)

//发送识别请求，sendVoice函数最后一个参数为文件分片请求返回时触发的回调，可根据业务修改
//error为请求错误，response为请求响应，data为请求结果
asrReq.sendVoice(data, (error, response, data) => {
  if (error) {
    console.log(error)
    return
  }
  console.log(data)
})