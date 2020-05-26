//
//  TEDataServices.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/7.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TEDataServices.h"

#import "CJLRequest.h"
#import "TERequestResult.h"
#import "MJExtension.h"

#import "TELoginAuthModel.h"
#import "TECourseInfoModel.h"
#import "TEMemberModel.h"



@implementation TEDataServices

+ (TEDataServices *)sharedInstance
{
    static TEDataServices *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[TEDataServices alloc] init];
    });
    return instance;
}

- (void)loginWithUserName:(NSString *)userName password:(NSString *)password result:(void(^)(BOOL isSuccess,NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
       request.requestUrl = LOGIN_URL;
       
           request.requestParameter = @{@"client_id" : @"zy-titc-client",
           @"client_secret" : @"zy-titc-secret",@"grant_type" : @"password", @"username" : userName, @"password" : password};
       
       request.requestMethod = CJLRequestMethodPOST;
       [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
           TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
           NSDictionary *dict = (NSDictionary *)result.data;
           TELoginAuthModel *model = [TELoginAuthModel mj_objectWithKeyValues:dict];
           model.userName = userName;
           [model save];
           [model fetch];
           block(result.isSuccess, result.message);
          
       } failure:^(__kindof CJLResponse * _Nonnull response) {
           TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
           block(result.isSuccess,result.message);
       }];
    
}

- (void)queryCourseList:(void(^)(BOOL isSuccess, NSArray *courseList, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
    request.requestUrl = QUERY_COURSE_LIST;
    
    request.requestParameter = @{@"appType" : @"app"};
    request.requestMethod = CJLRequestMethodPOST;
    request.requestSerializerType = CJLRequestSerializerTypeJSON;
    [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        NSArray *courseArr;
        if (result.isSuccess) {
             courseArr = [TECourseInfoModel mj_objectArrayWithKeyValuesArray:result.data[@"my"]];
        }
       
        block(result.isSuccess, courseArr, result.message);
        
    } failure:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess, nil, result.message);
    }];
    
}

- (void)queryMemberListLiveRoomId:(NSString *)liveRoomId currentPage:(NSInteger)page result:(void(^)(BOOL isSuccess, NSArray *memberList,NSInteger totalNumbers, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
       request.requestUrl = QUERY_MEMBER_LIST;
       request.requestMethod = CJLRequestMethodPOST;
       request.requestParameter = @{@"data" : @{@"liveRoomId" : liveRoomId},@"page" : @{@"pageNumbers" : [NSString stringWithFormat:@"%ld",page],@"countPerPages" : @"10"}};
       request.requestSerializerType = CJLRequestSerializerTypeJSON;
       [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
           TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
           if (result.isSuccess) {
                NSArray *memberList = [TEMemberModel mj_objectArrayWithKeyValuesArray:result.data[@"data"]];
                NSInteger total = [result.data[@"total"] integerValue];
                      block(result.isSuccess,[memberList copy],total,result.message);
           }else{
                block(result.isSuccess,nil,0,result.message);
           }
          
       } failure:^(__kindof CJLResponse * _Nonnull response) {
           TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
           block(result.isSuccess,nil,0,result.message);
       }];
}

- (void)enterLive:(NSString *)liveRoomId result:(void(^)(BOOL isSuccess, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
    request.requestUrl = ENTER_LIVEROOM;
    request.requestMethod = CJLRequestMethodPOST;
    request.requestParameter = @{@"liveRoomId" : liveRoomId, @"intoRoomChannel" : @"ios"};
    request.requestSerializerType = CJLRequestSerializerTypeJSON;
    [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    } failure:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    }];
}

- (void)exitLive:(NSString *)liveRoomId userId:(NSString *)userId result:(void(^)(BOOL isSuccess, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
    request.requestUrl = EXIT_LIVEROOM;
    request.requestMethod = CJLRequestMethodPOST;
    request.requestParameter = @{@"liveRoomId" : liveRoomId};
    request.requestSerializerType = CJLRequestSerializerTypeJSON;
    [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    } failure:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    }];
}

- (void)queryOnlineVoiceMemberListCourseNumber:(NSString *)courseNumber result:(void(^)(BOOL isSuccess, NSArray *onlineMemberList, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
    request.requestUrl = ONLINE_MEMBER_LIST;
    request.requestMethod = CJLRequestMethodPOST;
    request.requestParameter = @{@"courseNumber" : courseNumber};
    request.requestSerializerType = CJLRequestSerializerTypeJSON;
    [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        if (result.isSuccess) {
            NSArray *memberList = [TEMemberModel mj_objectArrayWithKeyValuesArray:result.data[@"list"]];
            block(result.isSuccess,[memberList copy],result.message);
        }else{
            block(result.isSuccess,nil,result.message);
        }
        
    } failure:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,nil,result.message);
    }];
}

- (void)deleteOnlineMember:(NSString *)courseNumber userNumber:(NSString *)userNumber result:(void(^)(BOOL isSuccess, NSString *message))block
{
    CJLRequest *request = [[CJLRequest alloc] init];
    request.requestUrl = DELETE_ONLINE_MEMBER;
    request.requestMethod = CJLRequestMethodDELETE;
    request.requestParameter = @{@"courseNumber" : courseNumber,@"userNumber" : userNumber};
    request.HTTPMethodsEncodingParametersInURI = [NSSet setWithObjects:@"GET", @"HEAD", nil];
    request.requestSerializerType = CJLRequestSerializerTypeJSON;
    [request startWithCompletionBlockWithSuccess:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    } failure:^(__kindof CJLResponse * _Nonnull response) {
        TERequestResult *result = [[TERequestResult alloc] initWithResponse:response];
        block(result.isSuccess,result.message);
    }];
}
@end
