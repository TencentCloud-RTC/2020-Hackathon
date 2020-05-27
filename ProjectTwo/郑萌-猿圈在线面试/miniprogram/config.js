  /**
 * @desc 小程序配置文件
 * @author 
 * sunqi
 * @company 猿圈科技
 */


const env = 'development'

// APP VERSIION
const version = 1.2



const config = {
    appid: '', //测试
    env,
    version,
    host: hosts[env],
    storage: {
        sessionKey: 'token',
    },
    baseColor: '#1890FF'
    
}
module.exports = config