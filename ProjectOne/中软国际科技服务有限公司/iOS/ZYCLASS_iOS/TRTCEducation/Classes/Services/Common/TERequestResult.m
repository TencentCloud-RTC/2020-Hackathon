//
//  ZYRequestResult.m
//  ZhiYunEducation
//
//  Created by caijunlai on 2019/12/25.
//  Copyright © 2019 caijunlai. All rights reserved.
//

#import "TERequestResult.h"

@interface TERequestResult()
/** 提示信息 */
@property (nonatomic,copy) NSString *message;
/** 请求状态码 */
@property (nonatomic,assign) NSInteger statusCode;
/** 请求是否成功 */
@property (nonatomic,assign) BOOL isSuccess;
/** 请求是否有异常 */
@property (nonatomic,assign) BOOL isError;
/** 请求数据 */
@property (nonatomic,strong) id data;
@end

@implementation TERequestResult

- (instancetype)initWithResponse:(CJLResponse *)response
{
    if (self = [super init]) {
        if (response.responeStatus != CJLResponseStatusSuccess) {
            if (response.responseObject) {
                NSDictionary *dict = (NSDictionary *)response.responseObject;
                self.message = dict[@"message"];
            }else{
                self.message = response.errorMessage;
            }
            self.statusCode = response.responseStatusCode;
            self.isSuccess = NO;
            self.isError = YES;
            self.data = nil;
            if (response.responseStatusCode == 401 && [response.errorMessage isEqualToString:@"Request failed: unauthorized (401)"]) {
                [[NSNotificationCenter defaultCenter] postNotificationName:@"networkAuthorizationExpireNotification" object:nil];
            }
            
        }else{
            if ([response.responseObject isKindOfClass:[NSDictionary class]]) {
                NSDictionary *dict = (NSDictionary *)response.responseObject;
                self.message = dict[@"message"];
                self.statusCode = [dict[@"code"] integerValue];
                self.isSuccess = [dict[@"success"] boolValue];
                self.isError = [dict[@"error"] boolValue];
                self.data = dict[@"result"];
            }else{
                NSAssert(YES, @"check request Data is NSDictionary");
            }
        }
    }
    return self;
}
@end
