//
//  TECourseDetailViewController.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TECourseDetailViewController.h"
#import "TECourseDetailContentView.h"
#import "TETitlePageView.h"

#import "TEMemberListViewController.h"

#import "TELoadingView.h"
#import "TUIChatController.h"

#import "TRTCVideoView.h"
#import "TEPlayerView.h"
#import "TELoadingView.h"
#import "TEVoiceCallView.h"
#import "Masonry.h"
#import "TEOnlineMemberCell.h"
#import "UIImageView+WebCache.h"

#import "MJExtension.h"
#import "TELoginAuthModel.h"
#import "TEDataServices.h"


@interface TECourseDetailViewController ()<TETitlePageViewDataSource,TRTCCloudDelegate,TRTCVideoViewDelegate,TEPlayerViewDelegate,TEVoiceCallViewDelegate>

@property (nonatomic,strong) UIView *playerBackView;
@property (nonatomic,strong) TECourseDetailContentView *contentView;
@property (nonatomic,strong) TETitlePageView *pageView;

@property (strong, nonatomic) TRTCCloud *trtc;

/** 播放器承载视图 */
@property (nonatomic,strong) UIView *holderView;
/** 播放器 */
@property (nonatomic,strong) TEPlayerView *playerView;
/** 加载视图 */
@property (nonatomic,strong) TELoadingView *loadingView;
/** 连麦弹框 */
@property (nonatomic,strong) TEVoiceCallView *voiceCallView;
/** 连麦计时器 */
@property (nonatomic,strong) NSTimer *timer;
/** 连麦时间/秒 */
@property (nonatomic,assign) NSInteger onlineSeconds;
/** 水印改变定时器 */
@property (nonatomic,strong) NSTimer *waterTimer;

@end

@implementation TECourseDetailViewController
{
    UIButton *_sendVoiceBtn;
    
    UIImageView *_coverImageView;
   
    UILabel *_watermarkLabel;
    
}
#pragma mark ---- UI相关
- (TELoadingView *)loadingView
{
    if (!_loadingView) {
        _loadingView = [[TELoadingView alloc] initWithFrame:CGRectMake((self.playerView.width - 80) * 0.5, (self.playerView.height - 100) * 0.5, 80, 100)];
    }
    return _loadingView;
}

- (TEVoiceCallView *)voiceCallView
{
    if (!_voiceCallView) {
        _voiceCallView = [[NSBundle mainBundle] loadNibNamed:NSStringFromClass([TEVoiceCallView class]) owner:self options:nil].firstObject;
        _voiceCallView.headerImageView.backgroundColor = HEX(@"43B478");
        _voiceCallView.headerImageView.layer.cornerRadius = 25;
        _voiceCallView.headerImageView.layer.masksToBounds = YES;
        _voiceCallView.frame = CGRectMake(20, (self.view.height - 220) * 0.5, SCREEN_WIDTH - 40, 220);
        _voiceCallView.layer.cornerRadius = 8;
        _voiceCallView.layer.masksToBounds = YES;
        _voiceCallView.delegate = self;
    }
    return _voiceCallView;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = RGB(247, 247, 247);
    self.onlineSeconds = 0;
    [self enterLive];
    [self setupView];
    
     self.settingsManager.videoView = self.playerView.localView;
    
    _trtc = [TRTCCloud sharedInstance];
    [_trtc setDelegate:self];
    self.settingsManager.remoteUserManager = self.remoteUserManager;
    [self.settingsManager setVideoMuted:NO];
    
    // 开始登录、进房
     [self.settingsManager enterRoom];
    
    [self onlineMember];
    
    self.timer = [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(timerRun) userInfo:nil repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:self.timer forMode:NSRunLoopCommonModes];
    [self.timer setFireDate:[NSDate distantFuture]];
}

- (void)dealloc
{
    [self.settingsManager exitRoom];
    [self sendContentCustomType:2];
    
    [[TEDataServices sharedInstance] deleteOnlineMember:self.courseInfo.courseNumber userNumber:self.param.userId result:^(BOOL isSuccess, NSString * _Nonnull message) {
    }];
    
    [self exitLive];
    
}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
}
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    //设置屏幕常亮
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    //展示水印
    [self showWatermark];
    
   //监听键盘
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [UIApplication sharedApplication].idleTimerDisabled = NO;
    [self.timer invalidate];
    
    [_watermarkLabel removeFromSuperview];
    [self.waterTimer invalidate];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
-(UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (BOOL)prefersStatusBarHidden
{
    if (self.playerView.isFullScreen) {
        return YES;
    }else{
        return NO;
    }
}

- (void)setupView
{
    UIView *statusBarView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, STATUSBAR_HEIGHE)];
    statusBarView.backgroundColor = [UIColor blackColor];
    [self.view addSubview:statusBarView];
    
    self.playerBackView = [[UIView alloc] initWithFrame:CGRectMake(0, STATUSBAR_HEIGHE, SCREEN_WIDTH, SCREEN_WIDTH * 9/16)];
    [self.view addSubview:_playerBackView];
    self.playerBackView.userInteractionEnabled = YES;
    
    self.playerView = [[TEPlayerView alloc] initWithFrame:self.playerBackView.bounds userId:self.param];
    self.playerView.fatherView = self.playerBackView;
    self.playerView.delegate = self;
    [self.playerBackView addSubview:_playerView];
   
    
    //加载视图
    if ([self.courseInfo.isNoshowing isEqualToString:@"Y"]) {
        [self.loadingView startLoading];
        [self.playerView addSubview:self.loadingView];
    }else{
        self.loadingView.imageView.image = [UIImage imageNamed:@"no_live_icon"];
        self.loadingView.label.text = @"暂无直播";
        [self.playerView addSubview:self.loadingView];
    }
    
    
    self.contentView = [[NSBundle mainBundle] loadNibNamed:NSStringFromClass([TECourseDetailContentView class]) owner:self options:nil].firstObject;
    self.contentView.frame = CGRectMake(0, CGRectGetMaxY(self.playerBackView.frame), SCREEN_WIDTH, 100);
    self.contentView.titleLabel.text = self.courseInfo.courseName;
    [self.contentView.collectionView registerNib:[UINib nibWithNibName:NSStringFromClass([TEOnlineMemberCell class]) bundle:nil] forCellWithReuseIdentifier:@"onlineMemberCell"];
    [self.view addSubview:_contentView];
    self.contentView.leftImageView.layer.cornerRadius = 20;
    self.contentView.leftImageView.layer.masksToBounds = YES;
    [self.contentView.leftImageView sd_setImageWithURL:[NSURL URLWithString:self.courseInfo.teacherInfo.faceImgPath] placeholderImage:[UIImage imageNamed:@"placeholder_icon"]];
    self.contentView.nameLabel.text = self.courseInfo.teacherInfo.nickname;
    
    
    self.pageView = [[TETitlePageView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(self.contentView.frame) + 10, SCREEN_WIDTH, SCREEN_HEIGHT - CGRectGetMaxY(self.contentView.frame) - 10 - TABBAR_SAFEBOTTOM_MARGIN)];
    self.pageView.backgroundColor = [UIColor whiteColor];
    self.pageView.dataSource = self;
    [self.view addSubview:_pageView];
    
    [self setupChildViewControllers];
    
    //发语音按钮
    _sendVoiceBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_sendVoiceBtn setImage:[UIImage imageNamed:@"voice_white"] forState:UIControlStateNormal];
    [_sendVoiceBtn setTitle:@"发送语音" forState:UIControlStateNormal];
    [_sendVoiceBtn setImage:[UIImage imageNamed:@"voice_online_icon"] forState:UIControlStateSelected];
    [_sendVoiceBtn setTitle:@"通话中..." forState:UIControlStateSelected];
    _sendVoiceBtn.backgroundColor = HEX(@"43B478");
    _sendVoiceBtn.frame = CGRectMake(SCREEN_WIDTH - 110, CGRectGetMaxY(self.contentView.frame) + 62, 130, 40);
    _sendVoiceBtn.titleLabel.font = [UIFont systemFontOfSize:14];
    _sendVoiceBtn.layer.cornerRadius = 20;
    _sendVoiceBtn.layer.masksToBounds = YES;
    [_sendVoiceBtn addTarget:self action:@selector(sendVoiceBtnClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:_sendVoiceBtn];
    
    _coverImageView = [[UIImageView alloc] initWithFrame:self.view.bounds];
    UIColor *color = [[UIColor blackColor] colorWithAlphaComponent:0.6];
    _coverImageView.image = [TEUtilFunction imageWithColor:color];
    _coverImageView.userInteractionEnabled = YES;
    [_coverImageView addSubview:self.voiceCallView];
    [self.view addSubview:_coverImageView];
    _coverImageView.hidden = YES;
}

- (void)setupChildViewControllers
{
    TIMConversation *conv = [[TIMManager sharedInstance] getConversation:TIM_GROUP receiver:self.courseInfo.avchatRoomId];
    TUIChatController *chatVc = [[TUIChatController alloc] initWithConversation:conv];
    chatVc.title = @"聊天室";
    [self addChildViewController:chatVc];
    
    TEMemberListViewController *memberVc = [[TEMemberListViewController alloc] init];
    memberVc.title = @"学员列表";
    memberVc.courseInfo = self.courseInfo;
    [self addChildViewController:memberVc];
}

- (void)showWatermark
{
    _watermarkLabel = [[UILabel alloc] initWithFrame:CGRectMake(25, STATUSBAR_HEIGHE + 30, 240, 30)];
    _watermarkLabel.text = self.param.userId? : @"";
    _watermarkLabel.font = [UIFont systemFontOfSize:20];
    _watermarkLabel.textAlignment = NSTextAlignmentCenter;
    
    
    _watermarkLabel.opaque = YES;
    UIColor *textColor = [RGB(122, 44, 39) colorWithAlphaComponent:0.5];
    _watermarkLabel.textColor = textColor;
    [self.playerView addSubview:_watermarkLabel];
    
    _waterTimer = [NSTimer timerWithTimeInterval:10 target:self selector:@selector(watermarkChangeLocation) userInfo:nil repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:_waterTimer forMode:NSRunLoopCommonModes];
    
    
}

- (void)watermarkChangeLocation
{
    CGFloat minX;
    CGFloat maxX;
    CGFloat minY;
    CGFloat maxY;
    if (self.playerView.isFullScreen) {
        minX = 0;
        maxX = SCREEN_HEIGHT - 240 - TABBAR_SAFEBOTTOM_MARGIN;
        minY = 0;
        maxY = SCREEN_WIDTH - 30;
    }else{
        minX = 0;
        maxX = SCREEN_WIDTH - 240;
        minY = STATUSBAR_HEIGHE;
        maxY = SCREEN_WIDTH * 9/16 - 30 - STATUSBAR_HEIGHE;
    }
    
    CGFloat randomX = (int)minX + arc4random() % ((int)maxX + 1);
    CGFloat randomY = (int)minY + arc4random() % ((int)maxY + 1);
    
    _watermarkLabel.x = randomX;
    _watermarkLabel.y = randomY;
}

#pragma mark ---- 数据接口

- (void)enterLive
{
    //进入直播间
    [[TEDataServices sharedInstance] enterLive:self.courseInfo.liveRoomId result:^(BOOL isSuccess, NSString * _Nonnull message) {
    }];
}

- (void)exitLive
{
    [[TEDataServices sharedInstance] exitLive:self.courseInfo.liveRoomId userId:self.param.userId result:^(BOOL isSuccess, NSString * _Nonnull message) {
        
    }];
}
- (void)onlineMember
{
    [[TEDataServices sharedInstance] queryOnlineVoiceMemberListCourseNumber:self.courseInfo.courseNumber result:^(BOOL isSuccess, NSArray * _Nonnull onlineMemberList, NSString * _Nonnull message) {
        if (isSuccess) {
            self.contentView.onlineMemberList = onlineMemberList;
            [self.contentView.collectionView reloadData];
        }
    }];
}

- (void)deleteOnlineMember
{
    [[TEDataServices sharedInstance] deleteOnlineMember:self.courseInfo.courseNumber userNumber:self.param.userId result:^(BOOL isSuccess, NSString * _Nonnull message) {
        [self sendContentCustomType:2];
        [self onlineMember];
    }];
}
#pragma mark ----- 私有方法
- (void)sendVoiceBtnClick
{
    if (_sendVoiceBtn.selected) {
        if (_coverImageView.hidden) {
            _coverImageView.hidden = NO;
        }
    }else{
        self.voiceCallView.tipsLabel.text = @"是否发起连麦申请？";
        [self.voiceCallView.confirmBtn setTitle:@"发起申请" forState:UIControlStateNormal];
        _coverImageView.hidden = NO;
        
    }
}
//自定义消息的内容customType 1：学生请求连麦 2：学生退出连麦 3：教师同意连麦 4：教师拒绝连麦
- (BOOL)sendContentCustomType:(NSInteger)customType
{
    NSString *userId = self.param.userId;
    [[TELoginAuthModel sharedInstance] fetch];
    NSString *userName = [TELoginAuthModel sharedInstance].nickName;
    NSDictionary *contentDict = @{ @"userId" : userId, @"userName" : userName};
    NSString *message = [contentDict mj_JSONString];
    NSData * data = [message dataUsingEncoding:NSUTF8StringEncoding];
   BOOL isSuccess = [self.trtc sendCustomCmdMsg:customType data:data reliable:YES ordered:NO];
    return isSuccess;
}

- (void)timerRun
{
    self.onlineSeconds++;
    self.voiceCallView.tipsLabel.text = [NSString stringWithFormat:@"正在连麦，连接时长%@",[self getMMSSFromSS:self.onlineSeconds]];
   
}

//传入 秒
-(NSString *)getMMSSFromSS:(NSInteger)totalTime{

    NSInteger seconds = totalTime;

    NSString *minute = [NSString stringWithFormat:@"%02d",seconds/60];
    
    NSString *second = [NSString stringWithFormat:@"%02d",seconds%60];
  
    NSString *time = [NSString stringWithFormat:@"%@:%@",minute,second];

    return time;

}

- (void)keyboardWillShow:(NSNotification *)notification
{
    //获取键盘的高度
    NSDictionary *userInfo = [notification userInfo];
//    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
//    CGRect keyboardRect = [value CGRectValue];
//    CGFloat height = keyboardRect.size.height;

    // 获取键盘弹出动画时间
    NSValue *animationDurationValue = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    NSTimeInterval animationDuration;
    [animationDurationValue getValue:&animationDuration];
    
    CGRect frame = _sendVoiceBtn.frame;
    frame.origin.y = CGRectGetMinY(self.contentView.frame) + 5;
    [UIView animateWithDuration:animationDuration animations:^{
        self->_sendVoiceBtn.frame = frame;
    }];
}
- (void)keyboardWillHide:(NSNotification *)notification
{
    
    //获取键盘的高度
    NSDictionary *userInfo = [notification userInfo];
    //    NSValue *value = [userInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    //    CGRect keyboardRect = [value CGRectValue];
    //    CGFloat height = keyboardRect.size.height;
    
    // 获取键盘弹出动画时间
    NSValue *animationDurationValue = [userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey];
    NSTimeInterval animationDuration;
    [animationDurationValue getValue:&animationDuration];
    
    CGRect frame = _sendVoiceBtn.frame;
    frame.origin.y = CGRectGetMaxY(self.contentView.frame) + 62;
    [UIView animateWithDuration:animationDuration animations:^{
        self->_sendVoiceBtn.frame = frame;
    }];
}


#pragma mark ---- TETitlePageViewDataSourse
- (NSInteger)numberOfPages
{
    return self.childViewControllers.count;
}

- (NSString *)titlePageView:(TETitlePageView *)titlePageView titleForHeadViewInPage:(NSInteger)pageIndex
{
    UIViewController *vc = self.childViewControllers[pageIndex];
    return vc.title;
}

- (NSArray<UIViewController *> *)containChildViewControllersIntitlePageView:(TETitlePageView *)titlePageView
{
    return self.childViewControllers;
}


#pragma mark - TRTCCloudDelegate

/**
 * 大多是不可恢复的错误，需要通过 UI 提示用户
 */
- (void)onError:(TXLiteAVError)errCode errMsg:(NSString *)errMsg extInfo:(nullable NSDictionary *)extInfo {
    // 有些手机在后台时无法启动音频，这种情况下，TRTC会在恢复到前台后尝试重启音频，不应调用exitRoom
    BOOL isStartingRecordInBackgroundError =
        errCode == ERR_MIC_START_FAIL &&
        [UIApplication sharedApplication].applicationState != UIApplicationStateActive;
    
    if (!isStartingRecordInBackgroundError) {
        NSString *msg = [NSString stringWithFormat:@"发生错误: 连接房间失败"];
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"已退房"
                                                                                 message:msg
                                                                          preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:[UIAlertAction actionWithTitle:@"确定"
                                                            style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * _Nonnull action) {
            
            [self.navigationController popViewControllerAnimated:YES];
            
        }]];
        [self presentViewController:alertController animated:YES completion:nil];
    }
}

- (void)onEnterRoom:(NSInteger)result {
    if (result >= 0) {
    } else {
        [self.settingsManager exitRoom];
    }
}


- (void)onExitRoom:(NSInteger)reason {
    if (reason == 1) {
        [MBProgressHUD showBottomMessage:@"您被剔出房间了！"];
        [self.navigationController popViewControllerAnimated:YES];
    }
}

/**
 * 有新的用户加入了当前视频房间
 */
- (void)onRemoteUserEnterRoom:(NSString *)userId {
    NSLog(@"onRemoteUserEnterRoom: %@", userId);
    [self.remoteUserManager addUser:userId roomId:[NSString stringWithFormat:@"%@", @(self.param.roomId)]];
}
/**
 * 有用户离开了当前视频房间
 */
- (void)onRemoteUserLeaveRoom:(NSString *)userId reason:(NSInteger)reason {
    NSLog(@"onRemoteUserLeaveRoom: %@", userId);
    [self.remoteUserManager removeUser:userId];
    
    // 更新UI
    UIView *playerView = [self.playerView.remoteViewDic objectForKey:userId];
    [playerView removeFromSuperview];
    [self.playerView.remoteViewDic removeObjectForKey:userId];

    NSString* subViewId = [NSString stringWithFormat:@"%@-sub", userId];
    UIView *subStreamPlayerView = [self.playerView.remoteViewDic objectForKey:subViewId];
    [subStreamPlayerView removeFromSuperview];
    [self.playerView.remoteViewDic removeObjectForKey:subViewId];

    // 如果该成员是大画面，则当其离开后，大画面设置为本地推流画面
    if ([userId isEqual:self.playerView.mainViewUserId] || [subViewId isEqualToString:self.playerView.mainViewUserId]) {
        self.playerView.mainViewUserId = self.param.userId;
    }

    [self.playerView relayout];
    [self.settingsManager updateCloudMixtureParams];
    
    //当老师离开
    if ([userId isEqualToString:self.courseInfo.teacherInfo.userAccount]) {
        [self.loadingView stopLoading];
        self.loadingView.imageView.image = [UIImage imageNamed:@"no_live_icon"];
        self.loadingView.label.text = @"暂无直播";
        [self.playerView addSubview:self.loadingView];
        [self.loadingView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.width.equalTo(@80);
            make.height.equalTo(@100);
            make.center.equalTo(self.playerView);
        }];
        [self exitBtnDidClick];
    }
}

- (void)onUserAudioAvailable:(NSString *)userId available:(BOOL)available {
    NSLog(@"onUserAudioAvailable:userId:%@ available:%u", userId, available);
    [self.remoteUserManager updateUser:userId isAudioEnabled:available];

    TRTCVideoView *playerView = [self.playerView.remoteViewDic objectForKey:userId];
    if (!available) {
        [playerView setAudioVolumeRadio:0.f];
    }
}

- (void)onUserVideoAvailable:(NSString *)userId available:(BOOL)available {
    NSLog(@"onUserVideoAvailable:userId:%@ available:%u", userId, available);
    [self.remoteUserManager updateUser:userId isVideoEnabled:available];

    if (userId != nil) {
        TRTCVideoView* remoteView = [self.playerView.remoteViewDic objectForKey:userId];
        if (available) {
            if(remoteView == nil) {
                // 创建一个新的 View 用来显示新的一路画面
                remoteView = [TRTCVideoView newVideoViewWithType:VideoViewType_Remote userId:userId];
                if (!self.settingsManager.audioConfig.isVolumeEvaluationEnabled) {
                    [remoteView showAudioVolume:NO];
                }
                remoteView.delegate = self;
                [remoteView setBackgroundColor:HEX(@"262626")];
                [self.playerView addSubview:remoteView];

                
                [self.playerView.remoteViewDic setObject:remoteView forKey:userId];
                
                // 将新进来的成员设置成大画面
                self.playerView.mainViewUserId = userId;
                
                [self.settingsManager updateCloudMixtureParams];
            }
            
            [_trtc startRemoteView:userId view:remoteView];
            [_trtc setRemoteViewFillMode:userId mode:TRTCVideoFillMode_Fit];
        }else {
            [_trtc stopRemoteView:userId];
            [remoteView removeFromSuperview];
            [self.playerView.remoteViewDic removeObjectForKey:userId];
        }
        [self.playerView relayout];
//        [remoteView showVideoCloseTip:!available];
    }
}

- (void)onUserSubStreamAvailable:(NSString *)userId available:(BOOL)available {
    NSLog(@"onUserSubStreamAvailable:userId:%@ available:%u", userId, available);
    NSString* viewId = [NSString stringWithFormat:@"%@-sub", userId];
    if (available) {
        
        TRTCVideoView *remoteView = [TRTCVideoView newVideoViewWithType:VideoViewType_Remote userId:userId];
        remoteView.streamType = TRTCVideoStreamTypeSub;
        if (!self.settingsManager.audioConfig.isVolumeEvaluationEnabled) {
            [remoteView showAudioVolume:NO];
        }
        remoteView.delegate = self;
        [remoteView setBackgroundColor:HEX(@"262626")];
        [_holderView addSubview:remoteView];
        [self.playerView.remoteViewDic setObject:remoteView forKey:viewId];


        [_trtc startRemoteSubStreamView:userId view:remoteView];
        [_trtc setRemoteSubStreamViewFillMode:userId mode:TRTCVideoFillMode_Fit];

        //辅流显示在主屏幕
        // 将新进来的成员设置成大画面
        self.playerView.mainViewUserId = viewId;
        [self.playerView relayout];
        [self.settingsManager updateCloudMixtureParams];
    }else {
        UIView *playerView = [self.playerView.remoteViewDic objectForKey:viewId];
        [playerView removeFromSuperview];
        [self.playerView.remoteViewDic removeObjectForKey:viewId];
        [_trtc stopRemoteSubStreamView:userId];

        if ([viewId isEqual:self.playerView.mainViewUserId]) {
            self.playerView.mainViewUserId = self.param.userId;
        }
    }
    [self.playerView relayout];
   
}

- (void)onFirstVideoFrame:(NSString *)userId streamType:(TRTCVideoStreamType)streamType width:(int)width height:(int)height {
    
    [self.loadingView stopLoading];
    [self.loadingView removeFromSuperview];
    
    NSLog(@"onFirstVideoFrame userId:%@ streamType:%@ width:%d height:%d", userId, @(streamType), width, height);
}

//- (void)onNetworkQuality:(TRTCQualityInfo *)localQuality remoteQuality:(NSArray<TRTCQualityInfo *> *)remoteQuality {
//    [_localView setNetworkIndicatorImage:[self imageForNetworkQuality:localQuality.quality]];
//    for (TRTCQualityInfo* qualityInfo in remoteQuality) {
//        TRTCVideoView* remoteVideoView = [_remoteViewDic objectForKey:qualityInfo.userId];
//        [remoteVideoView setNetworkIndicatorImage:[self imageForNetworkQuality:qualityInfo.quality]];
//    }
//}



#pragma mark - TRTCVideoViewDelegate

- (void)onMuteVideoBtnClick:(TRTCVideoView *)view stateChanged:(BOOL)stateChanged {
    if (view.streamType == TRTCVideoStreamTypeSub) {
        if (stateChanged) {
            [_trtc stopRemoteSubStreamView:view.userId];
        } else {
            [_trtc startRemoteSubStreamView:view.userId view:view];
        }
    } else {
        [self.remoteUserManager setUser:view.userId isVideoMuted:stateChanged];
    }
}

- (void)onMuteAudioBtnClick:(TRTCVideoView *)view stateChanged:(BOOL)stateChanged {
    [self.remoteUserManager setUser:view.userId isAudioMuted:stateChanged];
}

- (void)onScaleModeBtnClick:(TRTCVideoView *)view stateChanged:(BOOL)stateChanged {
    [self.remoteUserManager setUser:view.userId fillMode:stateChanged ? TRTCVideoFillMode_Fill : TRTCVideoFillMode_Fit];
}

- (void)onViewTap:(TRTCVideoView *)view{
    if (view == self.playerView.localView) {
        self.playerView.mainViewUserId = self.param.userId;
    } else {
        for (id userID in self.playerView.remoteViewDic) {
            UIView *pw = [self.playerView.remoteViewDic objectForKey:userID];
            if (view == pw ) {
                self.playerView.mainViewUserId = userID;
            }
        }
    }
    [self.playerView relayout];
}

#pragma mark ---- TEPlayerViewDelegate
- (void)playerViewBackBtnDidClick:(TEPlayerView *)playerView
{
   
    [self.settingsManager exitRoom];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)playerViewFullScreenChange:(TEPlayerView *)playerView isFullScreen:(BOOL)isFullScreen
{
    for (UIView *view in self.playerView.subviews) {
        if ([view isKindOfClass:[TELoadingView class]]) {
            [self.loadingView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.width.equalTo(@80);
                make.height.equalTo(@100);
                make.center.equalTo(self.playerView);
            }];
        }
    }
    
}
#pragma mark --- TEVoiceCallViewDelegate
- (void)cancelBtnDidClick
{
   _coverImageView.hidden = YES;
}

- (void)exitBtnDidClick
{
    if (!_sendVoiceBtn.selected) {
          BOOL isSuccess = [self sendContentCustomType:1];
          if (isSuccess) {
              _coverImageView.hidden = YES;
          }
    }else{
        _coverImageView.hidden = YES;
           [self.settingsManager setAudioEnabled:NO];
           _sendVoiceBtn.selected = NO;
           [self.timer setFireDate:[NSDate distantFuture]];
           [self deleteOnlineMember];
    }
}

//自定义消息
- (void)onRecvCustomCmdMsgUserId:(NSString *)userId cmdID:(NSInteger)cmdID seq:(UInt32)seq message:(NSData *)message
{
    if (cmdID == 2 || cmdID == 3) {
           [self onlineMember];
       }
    
   NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:message
    options:NSJSONReadingMutableContainers
      error:nil];
    if (!dict) {
        return;
    }
    if ([dict[@"userId"] isEqualToString:self.param.userId]) {
        if (cmdID == 3) { //同意连麦
            [self.settingsManager setAudioEnabled:YES];
            _sendVoiceBtn.selected = YES;
             [self.voiceCallView.confirmBtn setTitle:@"退出连麦" forState:UIControlStateNormal];
            //开始计时
            self.onlineSeconds = 0;
            [self.timer setFireDate:[NSDate date]];
        }else if(cmdID == 4){ //拒绝连麦
            [self.settingsManager setAudioEnabled:NO];
            _coverImageView.hidden = YES;
            [MBProgressHUD showMessage:@"连麦已被拒绝"];
            [self.timer setFireDate:[NSDate distantFuture]];
        }
    }
    
}


@end
