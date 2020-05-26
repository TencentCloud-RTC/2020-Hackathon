//
//  TECourseDetailViewController.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TRTCCloudManager.h"

#import "TECourseInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface TECourseDetailViewController : UIViewController
/// TRTC SDK 视频通话房间进入所必须的参数
@property (nonatomic) TRTCParams *param;
@property (strong, nonatomic) TRTCCloudManager *settingsManager;
@property (strong, nonatomic) TRTCRemoteUserManager *remoteUserManager;
@property (nonatomic) TRTCAppScene appScene;
/** 课程 */
@property (nonatomic,strong) TECourseInfoModel *courseInfo;

@end

NS_ASSUME_NONNULL_END
