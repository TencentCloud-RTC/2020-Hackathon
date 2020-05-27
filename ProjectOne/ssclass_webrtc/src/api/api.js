import {
  post
} from './index'

// Live
const getRoomInfo = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomInfo', params)
const getUserID = params => post('https://main.xuezhiqu.com.cn/main/live/getUserID', params)
const getLoginInfo = params => post('https://main.xuezhiqu.com.cn/main/live/getLoginInfo', params)
const getRoomTeacher = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomTeacher', params)
const joinRoom = params => post('https://main.xuezhiqu.com.cn/main/live/joinRoom', params)
const startRoom = params => post('https://main.xuezhiqu.com.cn/main/live/startRoom', params)
const pauseRoom = params => post('https://main.xuezhiqu.com.cn/main/live/pauseRoom', params)
const resumeRoom = params => post('https://main.xuezhiqu.com.cn/main/live/resumeRoom', params)
const quitRoom = params => post('https://main.xuezhiqu.com.cn/main/live/quitRoom', params)
const closeRoom = params => post('https://main.xuezhiqu.com.cn/main/live/closeRoom', params)
const startScreenShare = params => post('https://main.xuezhiqu.com.cn/main/live/startScreenShare', params)
const stopScreenShare = params => post('https://main.xuezhiqu.com.cn/main/live/stopScreenShare', params)
const setRequestType = params => post('https://main.xuezhiqu.com.cn/main/live/setRequestType', params)
const muteAll = params => post('https://main.xuezhiqu.com.cn/main/live/muteAll', params)
const muteChat = params => post('https://main.xuezhiqu.com.cn/main/live/muteChat', params)
const kickOut = params => post('https://main.xuezhiqu.com.cn/main/live/kickOut', params)
const getBlockWord = params => post('https://main.xuezhiqu.com.cn/main/live/getBlockWord', params)
const startSignIn = params => post('https://main.xuezhiqu.com.cn/main/live/startSignIn', params)
const signIn = params => post('https://main.xuezhiqu.com.cn/main/live/signIn', params)
const stopSignIn = params => post('https://main.xuezhiqu.com.cn/main/live/stopSignIn', params)
const startQa = params => post('https://main.xuezhiqu.com.cn/main/live/startQa', params)
const setAnswer = params => post('https://main.xuezhiqu.com.cn/main/live/setAnswer', params)
const stopQa = params => post('https://main.xuezhiqu.com.cn/main/live/stopQa', params)
const getRoomMembers = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomMembers', params)
const saveImMsg = params => post('https://main.xuezhiqu.com.cn/main/live/saveImMsg', params)
const addFeedback = params => post('https://main.xuezhiqu.com.cn/main/live/addFeedback', params)
const getRoomImMsg = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomImMsg', params)
const getRoomVideo = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomVideo', params)
const getRoomUserLog = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomUserLog', params)
const modifyUserName = params => post('https://main.xuezhiqu.com.cn/main/live/modifyUserName', params)
const getRoomQa = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomQa', params)
const getRoomQaAnswer = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomQaAnswer', params)
const getRoomSignIn = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomSignIn', params)
const getRoomSignInLog = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomSignInLog', params)
const saveBoardMsg = params => post('https://main.xuezhiqu.com.cn/main/live/saveBoardMsg', params)
const getRoomBoardMsg = params => post('https://main.xuezhiqu.com.cn/main/live/getRoomBoardMsg', params)
// Clouddesk
const getSupportType = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/getSupportType', params)
const getTranscodeType = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/getTranscodeType', params)
const getClouddeskFileList = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/getClouddeskFileList', params)
const getClouddeskFileInfo = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/getClouddeskFileInfo', params)
const addClouddeskFile = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/addClouddeskFile', params)
const deleteClouddeskFile = params => post('https://tool.xuezhiqu.com.cn/tool/clouddesk/deleteClouddeskFile', params)
// Sms
const sendCheckCode = params => post('https://tool.xuezhiqu.com.cn/tool/sms/sendCheckCode', params)
const getSmsLog = params => post('https://tool.xuezhiqu.com.cn/tool/sms/getSmsLog', params)
// Log
const getLocation = params => post('https://tool.xuezhiqu.com.cn/tool/log/getLocation', params)
const addLiveLog = params => post('https://tool.xuezhiqu.com.cn/tool/log/addLiveLog', params)

export default {
  /**
   * 获得房间信息
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 RoomInfo roomInfo; 房间信息
   */
  getRoomInfo,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 String userID; 用户ID
   */
  getUserID,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   *	 LoginInfo loginInfo; 互动直播或者实时音视频 appID
   *	 String loginTime; 登录时间
   */
  getLoginInfo,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 String teacherID; 老师ID
   *	 String teacherName; 用户名
   */
  getRoomTeacher,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 String userName; 用户名
   *	 String groupName = "Default"; 分组组名
   *	 int userType = -1; 用户类型
   *	 String osType; 操作系统类型
   *	 String browserType; 浏览器
   *	 String browserVersion; 浏览器版本号
   *	 String userAgent; 硬件信息
   *	 int clientType = 0; 客户端类型
   *	 String ip; ip地址
   *	 String country = ""; 国家
   *	 String province = ""; 省份
   *	 String city = ""; 城市
   *	 String isp = ""; 电信供应商
   *	 int loadMember = 1; 获得成员
   * rsp: 
   *	 String roomID; 房间id
   *	 String roomName; 班级名称
   *	 Member teacher; 老师信息
   *	 ArrayList<Member> assistants = null; 助教
   *	 ArrayList<Member> students = null; 学生
   *	 String startTime; 开始时间 maxLen:20
   *	 String endTime; 结束时间 maxLen:20
   *	 String roomStartTime; 开始时间
   *	 long liveSecond; 直播秒数
   *	 int liveID; 直播房间号，唯一
   *	 String liveState; 直播状态
   *	 int memberCount; 成员数量
   *	 int muteAll; 屏蔽所有
   *	 int isMuteChat; 禁言
   *	 int isKickOut; 踢出
   *	 int forceClose; 强制关闭
   *	 int isEnd; 0-未结束;1-结束
   */
  joinRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 String roomStartTime; 开始时间
   *	 long liveSecond; 直播时长秒
   */
  startRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   */
  pauseRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   */
  resumeRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   */
  quitRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String closerID; 关闭人
   *	 String closerName; 关闭人名字
   * rsp: 
   */
  closeRoom,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   */
  startScreenShare,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   */
  stopScreenShare,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 int requestType = 1; 申请类型
   * rsp: 
   */
  setRequestType,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 int muteState; 禁言状态
   * rsp: 
   */
  muteAll,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 int muteState; 禁言状态
   * rsp: 
   */
  muteChat,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   */
  kickOut,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 ArrayList<BlockWord> blockWords; 屏蔽词
   */
  getBlockWord,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String signInID; 签到id
   *	 int showSecond = 180; 显示时间
   * rsp: 
   *	 String signInID; 签到ID
   *	 String startTime; 开始时间
   */
  startSignIn,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 String signInID; 签到id
   * rsp: 
   */
  signIn,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   */
  stopSignIn,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String qaID = ""; 答题ID
   *	 String qaContent; 题目
   * rsp: 
   *	 String qaID; 答题id
   *	 String startTime; 开始时间
   */
  startQa,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 String qaID; 题目
   *	 String answer; 答案
   *	 int isRight; 是否正确
   *	 int costSecond; 耗时描述
   * rsp: 
   *	 int isRight; 是否正确
   *	 int costSecond; 耗时
   */
  setAnswer,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   */
  stopQa,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String groupName = ""; 组名字
   *	 int pageIndex = 0; 页码
   *	 int pageSize = 300; 每页数量
   * rsp: 
   *	 ArrayList<RoomUser> members; 学生信息
   *	 int memberCount; 总数
   */
  getRoomMembers,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 String userName; 用户名字
   *	 String message; 消息
   *	 int isBlock = 0; 是否被屏蔽
   *	 String reciverID; 接收人
   * rsp: 
   */
  saveImMsg,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   *	 String userName; 用户名
   *	 int userType; 用户类型 user,organization,public
   *	 int hasIssule; 是否有问题
   *	 String feedback; 问题描述
   * rsp: 
   */
  addFeedback,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 ArrayList<ImMsg> imMsgs = new ArrayList<>(); 聊天信息
   */
  getRoomImMsg,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String startTime; 开始时间
   *	 String endTime; 结束时间
   * rsp: 
   *	 ArrayList<RoomVideo> roomVideos; 
   */
  getRoomVideo,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 用户ID
   * rsp: 
   *	 ArrayList<RoomUserLog> roomUserLogs; 
   */
  getRoomUserLog,
  /**
   * req: 
   *	 String userID; 用户ID
   *	 int userType; user,organization,public
   *	 String userName; 
   * rsp: 
   */
  modifyUserName,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 ArrayList<Qa> qas; 答题
   *	 int qaCount; 答题数量
   */
  getRoomQa,
  /**
   * req: 
   *	 String qaID; 用户ID
   * rsp: 
   *	 ArrayList<QaAnswer> qaAnswers; 回答
   *	 int answerCount; 数量
   */
  getRoomQaAnswer,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 ArrayList<SignIn> signIns; 所有签到
   *	 int signInCounts; 数量
   */
  getRoomSignIn,
  /**
   * req: 
   *	 String signInID; 签到id
   * rsp: 
   *	 ArrayList<SignInLog> signInLogs; 签到日志
   *	 int logCount; 数量
   */
  getRoomSignInLog,
  /**
   * req: 
   *	 String roomID; 房间号
   *	 String userID; 机构名或者用户名
   *	 String message; 消息
   * rsp: 
   */
  saveBoardMsg,
  /**
   * req: 
   *	 String roomID; 房间号
   * rsp: 
   *	 ArrayList<RoomBoardmsg> roomBoardmsgs; 
   */
  getRoomBoardMsg,
  /**
   * 获得云盘支持的文件格式
   * rsp: 
   *	 ArrayList<String> types; 获得云盘支持的文件格式
   */
  getSupportType,
  /**
   * rsp: 
   *	 ArrayList<String> types; 获得需要转换的文件格式
   */
  getTranscodeType,
  /**
   * req: 
   *	 String userID; 用户ID
   *	 String userType = "user"; user,organization,public
   *	 String path; 文件路径
   * rsp: 
   *	 ArrayList<ClouddeskFile> clouddeskFiles; 云盘文件列表
   */
  getClouddeskFileList,
  /**
   * req: 
   *	 String fileID; 录像ID（腾讯）
   * rsp: 
   *	 ClouddeskFile clouddeskFile; 云盘文件
   */
  getClouddeskFileInfo,
  /**
   * req: 
   *	 String userID; 机构名或者用户名
   *	 String userType = "user"; user,organization,public
   *	 String path; 路径
   *	 String fileName; 文件名
   *	 int fileSize = 0; 文件大小
   *	 String cosUrl = ""; Cos文件路径
   *	 int isStaticPpt = 1; 是否是动态ppt
   * rsp: 
   *	 String fileID; 录像ID（腾讯）
   */
  addClouddeskFile,
  /**
   * req: 
   *	 String fileID; 文件ID
   *	 String userType = "user"; user,organization,public
   *	 String userID; 用户ID
   *	 String path; 路径
   *	 String fileName; 文件名
   */
  deleteClouddeskFile,
  /**
   * 发送验证码
   * req: 
   *	 String mobile; 手机
   * rsp: 
   *	 String checkCode; 校验码
   *	 String sendTime; 发送时间
   */
  sendCheckCode,
  /**
   * req: 
   *	 String organizationID; 机构ID
   *	 String searchInfo; 查询信息
   *	 int pageIndex; 页码
   *	 int pageSize; 每页数量
   * rsp: 
   *	 String totalCount; 总数
   *	 ArrayList<SmsLog> smsLogs; 发送日志
   */
  getSmsLog,
  /**
   * 根据IP 获得地址位置
   * req: 
   *	 String ip; 
   * rsp: 
   *	 String country; 国家
   *	 String province; 省份
   *	 String city; 城市
   *	 String isp; 电信供应商
   */
  getLocation,
  /**
   * req: 
   *	 String userID; 用户ID
   *	 String operateTime; 日志时间 maxLen:25
   *	 String userName; 用户名
   *	 String roomID; 房间号
   *	 String roomName; 房间名
   *	 int liveID; 直播房间号
   *	 int userType; 用户类型 0-老师；1-学生；2-助理；3-巡课 maxLen:6
   *	 String osType; 操作系统类型
   *	 String event; 事件类型
   *	 int errorCode; 错误代码
   *	 int timeCost; 耗时(毫秒)
   *	 String ip; ip地址
   *	 String sdkAppInfo; SdkAppInfo
   *	 String extendJson; 日志json
   * rsp: 
   */
  addLiveLog
}