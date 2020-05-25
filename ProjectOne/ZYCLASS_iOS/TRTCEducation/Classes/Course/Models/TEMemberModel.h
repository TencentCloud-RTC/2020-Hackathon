//
//  TEMemberModel.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/12.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TEMemberModel : NSObject
/** 学员编号 */
@property (nonatomic,copy) NSString *studentNumber;
/** 会员编号 */
@property (nonatomic,copy) NSString *userNumber;
/** 昵称 */
@property (nonatomic,copy) NSString *nickname;
/** 头像地址 */
@property (nonatomic,copy) NSString *headFileUrl;
/** 是否是教师 0：否 1： 是 */
@property (nonatomic,assign) BOOL isTeacher;
@end

@interface TEOnlineVoiceMemberModel : NSObject
/** 课程编号 */
@property (nonatomic,copy) NSString *courseNumber;
/** 会员编号 */
@property (nonatomic,copy) NSString *userNumber;
/** 昵称 */
@property (nonatomic,copy) NSString *nickname;
/** 头像地址 */
@property (nonatomic,copy) NSString *headFileUrl;
/** 用户账号/手机号     */
@property (nonatomic,copy) NSString *userAccount;
@end


NS_ASSUME_NONNULL_END
