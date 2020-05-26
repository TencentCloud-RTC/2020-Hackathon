//
//  CJLResponse.m
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/25.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "CJLResponse.h"

@implementation CJLResponse

- (instancetype)initWithRequestTask:(NSURLSessionTask *)task
{
    if (self = [super init]) {
        _response = (NSHTTPURLResponse *)task.response;
        _responseStatusCode = _response.statusCode;
        _responseHeaders = _response.allHeaderFields;
    }
    return self;
}

- (NSString *)errorMessage
{
    if (_error) {
        if (_error.code == NSURLErrorTimedOut) {
            _responeStatus = CJLResponseStatusTimeout;
            return @"连接超时，服务器无响应";
        }
        if (_error.code == NSURLErrorCancelled) {
            _responeStatus = CJLResponseStatusCanceled;
            return @"请求已取消，请重新请求";
        }
        if (_error.code == NSURLErrorNotConnectedToInternet) {
            _responeStatus = CJLResponseStatusNetworkError;
            return @"无法连接互联网，请检查网络设置";
        }
        _responeStatus = CJLResponseStatusUnknow;
        return self.error.localizedDescription;
    }else{
        return nil;
    }
}
- (CJLResponeStatus)responeStatus
{
    if (_error) {
        if (_error.code == NSURLErrorTimedOut) {
            return CJLResponseStatusTimeout;
        }
        if (_error.code == NSURLErrorCancelled) {
            return CJLResponseStatusCanceled;
        }
        if (_error.code == NSURLErrorNotConnectedToInternet) {
            return CJLResponseStatusNetworkError;
        }
        return CJLResponseStatusUnknow;
    }else{
        return CJLResponseStatusSuccess;
    }
}

@end
