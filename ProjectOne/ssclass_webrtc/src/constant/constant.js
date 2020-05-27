const Constant = {
  /**
   * 客户端类型
   */
  ClientType: {
    PC: '0',
    Mobile: '1'
  },

  /**
   * 课程类型
   */
  ClassType: {
    Live: '0', // 直播类型，需要实时监控成员
    Class: '1' // 班级类型，成员固定
  },

  /**
   * 课堂场景
   * https://cloud.tencent.com/document/product/647/38751
   */
  LiveScene: {
    VideoCall: 'videoCall', //实时通话模式，支持1000人以下场景，低延时
    Live: 'live', //直播模式，支持1000人以上场景，会增加600ms左右延时
  },

  /**
   * 房间角色
   * 仅适用于直播模式（LIVE），角色ANCHOR具有上行权限
   */
  RoleType: {
    Anchor: 'anchor', //主播
    Audience: 'audience', //观众
  },

  /**
   * 消息类型
   */
  ImMsgType: {
    TEXT: 'TIMTextElem', //文本
    FACE: 'TIMFaceElem', //表情
    IMAGE: 'TIMImageElem', //图片
    CUSTOM: 'TIMCustomElem', //自定义
    SOUND: 'TIMSoundElem', //语音,只支持显示
    FILE: 'TIMFileElem', //文件,只支持显示
    LOCATION: 'TIMLocationElem', //地理位置
    GROUP_TIP: 'TIMGroupTipElem' //群提示消息,只支持显示
  },

  /**
   * 云盘配置
   */
  Clouddesk: {
    SecretId: 'AKID16SqDIdaj6UQNJj7Z5jP2uiNtDMYqfp0',
    SecretKey: 'JezLgzHXmzC1nbL5nUCsXBmLzcFjHoJn',
    Bucket: 'clouddesk-1255627983',
    Region: 'ap-shanghai'
  },

  /**
   * 白板
   */
  WebBoard: {
    WhiteBoardId: '#DEFAULT'
  },

  /**
   * 直播状态
   */
  LiveState: {
    NotStart: 'NotStart',
    Living: 'Living',
    Pause: 'Pause',
    Quit: 'Quit',
    Close: 'Close',
    ForceClose: 'ForceClose',
    TeacherLeave: 'TeacherLeave' // 老师离开，没有点退出，也没有点结束
  },

  /**
   * 用户命令
   */
  UserCommand: {
    ImComming: 'UserCommand_ImComming',
    ImHere: 'UserCommand_ImHere',
    IQuit: 'UserCommand_IQuit',
  },

  /**
   * 老师视频状态
   */
  TeacherVideoState: {
    NotStart: 'NotStart',
    ShowVideo: 'ShowVideo',
    VoiceLive: 'VoiceLive',
    HasNoStream: 'HasNoStream',
    TeacherLeave: 'TeacherLeave',
    LivePause: 'LivePause',
    LiveOver: 'LiveOver'
  },

  /**
   * 直播命令
   */
  LiveCommand: {
    Start: 'LiveCommand_Start', // 开始
    Pause: 'LiveCommand_Pause', // 暂停
    Quit: 'LiveCommand_Quit', // 退出 
    Close: 'LiveCommand_Close', // 关闭

    OpenAll: 'LiveCommand_OpenAll',
    CloseAll: 'LiveCommand_CloseAll',
    VoiceCall: 'LiveCommand_VoiceCall',
    VideoCall: 'LiveCommand_VideoCall',
    CloseLink: 'LiveCommand_CloseLink',

    OpenCamera: 'LiveCommand_OpenCamera',
    CloseCamera: 'LiveCommand_CloseCamera',
    OpenMic: 'LiveCommand_OpenMic',
    CloseMic: 'LiveCommand_CloseMic',
    OpenPen: 'LiveCommand_OpenPen',
    ClosePen: 'LiveCommand_ClosePen',

    MaxTeacherVideo: 'LiveCommand_MaxTeacherVideo',
    NormalTeacherVideo: 'LiveCommand_NormalTeacherVideo',

    MaxMineCamera: 'LiveCommand_MaxMineCamera',
    NormalMineCamera: 'LiveCommand_NormalMineCamera',

    UpPlatform: 'LiveCommand_UpPlatform',
    OffPlatform: 'LiveCommand_OffPlatform',

    StartSignIn: 'LiveCommand_StartSignIn',
    SignIn: 'LiveCommand_SignIn',
    CloseSignIn: 'LiveCommand_CloseSignIn',

    StartQa: 'LiveCommand_StartQa',
    SetAnswer: 'LiveCommand_SetAnswer',
    CloseQa: 'LiveCommand_CloseQa',

    ThumbsUp: 'LiveCommand_ThumbsUp',

    RaiseHand: 'LiveCommand_RaiseHand',
    PutDownHand: 'LiveCommand_PutDownHand',

    RequestMic: 'LiveCommand_RequestMic', // 学生申请连麦
    RequestVideo: 'LiveCommand_RequestVideo', // 学生申请视频
    RequestNone: 'LiveCommand_RequestNone', // 学生取消申请

    AgreenRequest: 'LiveCommand_AgreenRequest', // 同意连麦
    RejectRequest: 'LiveCommand_RejectRequest', // 拒绝连麦

    MuteAll: 'LiveCommand_MuteAll',
    UnMuteAll: 'LiveCommand_UnMuteAll',

    ScreenSnap: 'LiveCommand_ScreenSnap',
  },

  /**
   * 答题类型
   */
  QaType: {
    Choice: 'Choice',
    MultiChoice: 'MultiChoice',
  },

  /**
   * 答题命令
   */
  QaCommand: {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    H: 'H',
    I: 'I',
    J: 'J'
  },

  /**
   * 表扬命令
   */
  AwesomeCommand: {
    Flower: 'AwesomeCommand_Flower',
    Clap: 'AwesomeCommand_Clap',
  },

  /**
   * 诊断命令
   */
  DoctorCommand: {
    CameraList: 'DoctorCommand_CameraList',
    MicList: 'DoctorCommand_MicList',
    PlyerList: 'DoctorCommand_PlyerList',

    CameraState: 'DoctorCommand_CameraState',
    MicState: 'DoctorCommand_MicState',
    PlyerState: 'DoctorCommand_PlyerState',

    ChangeCamera: 'DoctorCommand_ChangeCamera',
    ChangeMic: 'DoctorCommand_ChangeMic',
    ChangePayer: 'DoctorCommand_ChangePayer',
  },
}

export default Constant