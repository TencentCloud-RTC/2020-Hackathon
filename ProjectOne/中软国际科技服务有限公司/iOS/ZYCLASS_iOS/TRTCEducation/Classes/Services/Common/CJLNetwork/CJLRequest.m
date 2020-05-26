//
//  CJLRequest.m
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/25.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "CJLRequest.h"
#import "CJLResponse.h"
#import "CJLNetworkConfig.h"
#import "CJLNetworkManager.h"

@implementation CJLRequest
{
    CJLNetworkConfig *_config;
}
- (instancetype)init
{
    if (self = [super init]) {
        _config = [CJLNetworkConfig sharedNetworkConfig];
        _baseUrl = _config.baseUrl;
        _cdnUrl = _config.cdnUrl;
        _requestTimeoutInterval = _config.requestTimeOut;
        _requestMethod = CJLRequestMethodGET;
        _requestSerializerType = CJLRequestSerializerTypeHTTP;
        _responseSerializerType = CJLResponseSerializerTypeJSON;
        _requestHeaderFieldValueDictionary = _config.requestHeaderFieldValueDictionary;
        _requestAuthorizationHeaderFieldArray = _config.requestAuthorizationHeaderFieldArray;
        _allowsCellularAccess = YES;
        _requestPriority = CJLRequestPriorityDefault;
        _tag = 0;
        _useCDN = NO;
        _constructingBodyBlock = nil;
        _requestUrl = nil;
        _requestParameter = nil;
        _userInfo = nil;
        
    }
    return self;
}

//只读属性get方法
- (NSURLRequest *)currentRequest {
    return self.requestTask.currentRequest;
}

- (NSURLRequest *)originalRequest {
    return self.requestTask.originalRequest;
}

- (BOOL)isCancelled {
    if (!self.requestTask) {
        return NO;
    }
    return self.requestTask.state == NSURLSessionTaskStateCanceling;
}

- (BOOL)isExecuting {
    if (!self.requestTask) {
        return NO;
    }
    return self.requestTask.state == NSURLSessionTaskStateRunning;
}

- (void)clearCompletionBlock
{
    self.successCompletionBlock = nil;
    self.failureCompletionBlock = nil;
}

- (void)setRequestCompletionBlockWithSuccess:(CJLRequestCompletionBlock)success
                              failure:(CJLRequestCompletionBlock)failure {
    self.successCompletionBlock = success;
    self.failureCompletionBlock = failure;
}

- (void)start {
    [[CJLNetworkManager sharedNetworkManager] addRequest:self];
}

- (void)stop {
    [[CJLNetworkManager sharedNetworkManager] cancelRequest:self];
}

- (void)startWithCompletionBlockWithSuccess:(CJLRequestCompletionBlock)success failure:(CJLRequestCompletionBlock)failure {
    [self setRequestCompletionBlockWithSuccess:success failure:failure];
    [self start];
}

@end
