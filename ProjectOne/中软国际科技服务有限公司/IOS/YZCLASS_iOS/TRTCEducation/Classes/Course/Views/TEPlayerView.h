//
//  TEPlayerView.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/9.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TRTCVideoView.h"
#import "TRTCCloudManager.h"

@class  TEPlayerView;
NS_ASSUME_NONNULL_BEGIN
@protocol TEPlayerViewDelegate <NSObject>

- (void)playerViewBackBtnDidClick:(TEPlayerView *)playerView;

- (void)playerViewFullScreenChange:(TEPlayerView *)playerView isFullScreen:(BOOL)isFullScreen;

@end


@interface TEPlayerView : UIView
/** trtc参数 */
@property (nonatomic,strong) TRTCParams *param;
/** 直播视图 */
@property (nonatomic,strong) TRTCVideoView *localView;
/** 视频画面支持点击切换，需要用一个变量记录当前哪一路画面是全屏状态的 */
@property (nonatomic,copy) NSString *mainViewUserId;
/** 一个或者多个远程画面的view key:userId value: videoView */
@property (nonatomic,strong) NSMutableDictionary *remoteViewDic;
/** 是否全屏 */
@property (nonatomic,assign) BOOL isFullScreen;
/// 设置播放器的父view
@property (nonatomic, strong) UIView *fatherView;
/** 背景图片 */
@property (nonatomic,strong) UIImageView *bgImageView;


@property (nonatomic, weak) id<TEPlayerViewDelegate> delegate;

- (instancetype)initWithFrame:(CGRect)frame userId:(TRTCParams *)param;
 
- (void)relayout;

@end

NS_ASSUME_NONNULL_END
