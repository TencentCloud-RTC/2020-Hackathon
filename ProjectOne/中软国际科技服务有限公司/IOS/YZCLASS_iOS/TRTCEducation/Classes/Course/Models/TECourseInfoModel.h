//
//  TECourseInfoModel.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/8.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class TECourseTeacherInfo;

@interface TECourseInfoModel : NSObject
/** 课程名称 */
@property (nonatomic,copy) NSString *courseName;
/** 课程描述 */
@property (nonatomic,copy) NSString *courseDes;
/** 课程id */
@property (nonatomic,copy) NSString *courseNumber;
/** 课程封面 */
@property (nonatomic,copy) NSString *coverFileUrl;
/** 直播状态 N：否  Y：是 */
@property (nonatomic,copy) NSString *isNoshowing;
/** 讨论组id */
@property (nonatomic,copy) NSString *avchatRoomId;
/** 房间id */
@property (nonatomic,copy) NSString *liveRoomId;

/** 老师信息 */
@property (nonatomic,strong) TECourseTeacherInfo *teacherInfo;
@end

@interface TECourseTeacherInfo : NSObject

/** number */
@property (nonatomic,copy) NSString *number;
/** 用户账号 */
@property (nonatomic,copy) NSString *userAccount;
/** 用户名称 */
@property (nonatomic,copy) NSString *nickname;
/** 头像 */
@property (nonatomic,copy) NSString *faceImgPath;

@end

NS_ASSUME_NONNULL_END
