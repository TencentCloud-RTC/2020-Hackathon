//
//  TEDataServices.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/7.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>


NS_ASSUME_NONNULL_BEGIN


@interface TEDataServices : NSObject

+ (TEDataServices *)sharedInstance;

- (void)loginWithUserName:(NSString *)userName password:(NSString *)password result:(void(^)(BOOL isSuccess,NSString *message))block;

- (void)queryCourseList:(void(^)(BOOL isSuccess, NSArray *courseList, NSString *message))block;

- (void)queryMemberListLiveRoomId:(NSString *)liveRoomId currentPage:(NSInteger)page result:(void(^)(BOOL isSuccess, NSArray *memberList, NSInteger totalNumbers,NSString *message))block;

- (void)enterLive:(NSString *)liveRoomId result:(void(^)(BOOL isSuccess, NSString *message))block;

- (void)exitLive:(NSString *)liveRoomId userId:(NSString *)userId result:(void(^)(BOOL isSuccess, NSString *message))block;

- (void)queryOnlineVoiceMemberListCourseNumber:(NSString *)courseNumber result:(void(^)(BOOL isSuccess, NSArray *onlineMemberList, NSString *message))block;

- (void)deleteOnlineMember:(NSString *)courseNumber userNumber:(NSString *)userNumber result:(void(^)(BOOL isSuccess, NSString *message))block;

@end

NS_ASSUME_NONNULL_END
