/**
 * 认证信息类
 * @class
 */
class Config {
  /**
   * @param {string} secretId
   * @param {string} secretKey
   * @param {number} appId
   */
  constructor(secretId, secretKey, appId){
    /**
     * secretId,可在控制台获取
     * @type {string || null}
     */
    this.secretId = secretId || null;

    /**
     * secretKey,可在控制台获取
     * @type {string || null}
     */
    this.secretKey = secretKey || null;

    /**
     * appId,用户在腾讯云注册账号的 appId,可在控制台获取
     * @type {number || null}
     */
    this.appId = appId || null;
  }
}
module.exports = Config;