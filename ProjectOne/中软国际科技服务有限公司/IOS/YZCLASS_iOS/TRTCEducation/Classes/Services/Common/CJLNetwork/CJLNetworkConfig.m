//
//  CJLNetworkConfig.m
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/26.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "CJLNetworkConfig.h"
#import "AFSecurityPolicy.h"

#import "TELoginAuthModel.h"

#define CDN_URL  @""
#define REQUEST_TIMEOUT 30

@implementation CJLNetworkConfig

+ (CJLNetworkConfig *)sharedNetworkConfig
{
    static id sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    if (self = [super init]) {
        _baseUrl = TE_BASE_URL;
        _cdnUrl = CDN_URL;
        _requestTimeOut = REQUEST_TIMEOUT;
        _securityPolicy = [AFSecurityPolicy defaultPolicy];
        _sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
        _requestHeaderFieldValueDictionary = nil;
        _requestAuthorizationHeaderFieldArray = nil;
    }
    return self;
}

- (NSDictionary *)requestHeaderFieldValueDictionary
{
    [[TELoginAuthModel sharedInstance] fetch];
    if ([TELoginAuthModel sharedInstance].access_token.length > 0) {
         return @{@"Authorization" : [NSString stringWithFormat:@"%@ %@",[TELoginAuthModel sharedInstance].token_type,[TELoginAuthModel sharedInstance].access_token]};
    }else{
         return @{@"Authorization" : @""};
    }

}

@end
