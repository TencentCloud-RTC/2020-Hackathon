// https://cloud.tencent.com/document/product/436/8629
// 域名配置：https://cloud.tencent.com/document/product/436/11142?from=10680#.E5.BC.80.E5.90.AF-cdn-.E5.8A.A0.E9.80.9F
import Constant from '@/constant/constant'
import LogEvent from '@/log/LogEvent'

class Cos {
  constructor() {
    this.cos = null
  }

  /**
   * 获得配置
   */
  init() {
    var startTime = Date.now()

    //Cos新建
    this.cos = new COS({
      SecretId: Constant.Clouddesk.SecretId,
      SecretKey: Constant.Clouddesk.SecretKey,
      FileParallelLimit: 3, // 控制文件上传并发数
      ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
      ChunkSize: 1024 * 1024, // 控制分片大小，单位 B
      ProgressInterval: 1, // 控制 onProgress 回调的间隔
      ChunkRetryTimes: 3, // 控制文件切片后单片上传失败后重试次数
    })

    // 日志
    window.logReport.report(LogEvent.CosSdk_init, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: '',
    })
  }

  /**
   * 添加文件
   */
  async addFile(key, file, progress, callback) {
    await this.cos.putObject({
      Bucket: Constant.Clouddesk.Bucket,
      Region: Constant.Clouddesk.Region,
      Key: key,
      Body: file,
      onProgress: (progressData) => {
        progress(progressData)
      }
    }, (err, res) => {
      callback(res)
    })
  }
}

const cos = new Cos()
export default cos