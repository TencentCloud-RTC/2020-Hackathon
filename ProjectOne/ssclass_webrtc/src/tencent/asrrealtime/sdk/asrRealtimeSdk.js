const fs = require("fs");
const crypto = require('crypto');
const request = require('request');

class Asr {
  /**
   * 实例化client对象
   * @param {Config} config 认证信息实例
   * @param {Object} query 配置参数
   */
  constructor(config, query){
    
    this.config = config || null;

    this.query = query || null;
  }

  sign(secretKey, signStr) {
    let hash = crypto.createHmac("sha1",secretKey || "");
    let sign = hash.update(Buffer.from(signStr, 'utf8')).digest('base64');
    return sign;
  }

  formatSignString(params){
    let strParam = "";
    let signStr = "POSTasr.cloud.tencent.com/asr/v1/";
    if(this.config['appId']){
      signStr += this.config['appId'];
    }
    let keys = Object.keys(params);
    keys.sort();
    for (let k in keys) {
      strParam += ("&" + keys[k] + "=" + params[keys[k]]);
    }
    let strSign = signStr + '?' + strParam.slice(1);
    return strSign;
  }

  randStr(n){
    let seed = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let sa = "";
    for(let i = 0; i< n; i++){
      let pos = Math.round(Math.random() * (seed.length-1));
      sa += seed[pos];
    }
    return sa
  }

  createQuery(){
    let params = {};
    let time = new Date().getTime();

    params['projectid'] = 0;
    params['secretid'] = this.config.secretId;
    params['sub_service_type'] = 1;
    params['engine_model_type'] = this.query.engineModelType;
    params['result_text_format'] = this.query.resultTextFormat;
    params['res_type'] = this.query.resType;
    params['voice_format'] = this.query.voiceFormat;
    params['needvad'] = 0;
    params['source'] = 0;
    params['timestamp'] = '' + Math.round(time / 1000);
    params['expired'] = Math.round(time / 1000) + 24 * 60 * 60;
    params['nonce'] = Math.round(time / 100000);
    params['timeout'] = 100;

    return params;
  }

  sendVoice(file, callback){
    if(!file){
      console.log('file can not be empty');
      return;
    }
    let query = this.createQuery();
    query['voice_id'] = this.randStr(16);

    let bytesPerPiece = this.query.cutLength; 
    let seq = 0;
    let end = 0;
    let start = 0;
    let datalen = file.slice(start,start + bytesPerPiece).length; //slice可用，但size不可用

    let headers = {};

    let res = {};

    while(datalen > 0) {
      if(datalen < bytesPerPiece){
        end = 1;
      }
      query['end'] = end;
      query['seq'] = seq;

      let signStr = this.formatSignString(query);
      let autho = this.sign(this.config.secretKey, signStr);
      let chunk = file.slice(start,start + bytesPerPiece);

      datalen = chunk.length;
      if(datalen === 0){
        break;
      }
      
      start = start + bytesPerPiece;
      headers['Authorization'] = autho;
      headers['Content-Length'] = datalen;
      headers['Content-Type'] = 'application/octet-stream';
      headers['Host'] = 'asr.cloud.tencent.com';
      let reqUrl = "http://" + signStr.substring(4, signStr.length);
      this.doRequest(reqUrl, chunk, headers, callback);

      if(end === 0){
        seq = seq + 1;
      }else{
        seq = 0;
      }

    }
    return res;
  }

  doRequest(url, data, headers, callback) {
    let req = {
        method: 'POST',
        url: url,
        headers: headers,
        json: false,
        body: data
    };

    request(req, function (error, response, body) {
      /**
      * `.request` 的请求回调
      * @callback requestCallback
      * @param {Error} error 请求错误
      * @param {Object} response 请求响应
      * @param {String} body API 请求结果
      */
      callback(error, response, body);
    })
  }

  sendRequest(chunk, voiceId, seq, endFlag, callback){

    if(chunk.size === 0){
      console.log('content length can not be empty');
      return '';
    }
    let query = this.createQuery();

    query['voice_id'] = voiceId;
    query['end'] = endFlag;
    query['seq'] = seq;

    let signStr = this.formatSignString(query);
    let autho = this.sign(this.config.secretKey, signStr);
    let datalen = chunk.length;

    let headers = {};
    headers['Authorization'] = autho;
    headers['Content-Length'] = datalen;
    headers['Content-Type'] = 'application/octet-stream';
    headers['Host'] = 'asr.cloud.tencent.com';
    
    let reqUrl = "http://" + signStr.substring(4, signStr.length);
    let res = this.doRequest(reqUrl, chunk, headers, callback);
    return res;
  }
}

module.exports = Asr;