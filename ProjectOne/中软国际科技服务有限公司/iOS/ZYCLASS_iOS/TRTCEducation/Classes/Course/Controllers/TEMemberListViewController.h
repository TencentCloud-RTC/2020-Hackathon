//
//  TEMemberListViewController.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TECourseInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface TEMemberListViewController : UIViewController
/** 课程信息 */
@property (nonatomic,strong) TECourseInfoModel *courseInfo;
@end

NS_ASSUME_NONNULL_END
