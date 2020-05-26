//
//  CJLBatchRequest.m
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/28.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "CJLBatchRequest.h"
#import "CJLRequest.h"
#import "CJLResponse.h"

#define TAG_OFFSET 10000

@interface CJLBatchRequest()<CJLRequestDelegate>

@property (nonatomic,strong) NSMutableArray *responseArrM;

@end

@implementation CJLBatchRequest
- (instancetype)init
{
   return [self initWithRequestArray:nil];
}

- (instancetype)initWithRequestArray:(NSArray<CJLRequest *> * _Nullable)requestArray
{
    if (self = [super init]) {
        _requestArray = [requestArray copy];
        _responseArrM = [NSMutableArray arrayWithCapacity:_requestArray.count];
        for (NSInteger i = 0; i < _requestArray.count; i++) {
            CJLRequest *req = _requestArray[i];
            req.tag = i + TAG_OFFSET;
            if (![req isKindOfClass:[CJLRequest class]]) {
                NSLog(@"Batch Request Error,request item must be YTKRequest instance.");
                return nil;
            }
        }
    }
    return self;
}

- (void)start {
    if (_responseArrM.count > 0) {
        NSLog(@"Error! Batch request has already started.");
        return;
    }
    _failedRequest = nil;
   
    for (CJLRequest * req in _requestArray) {
        req.delegate = self;
        [req clearCompletionBlock];
        [req start];
    }
}

- (void)stop
{
    _delegate = nil;
    [self clearRequest];
}


- (void)clearRequest {
    for (CJLRequest * req in _requestArray) {
        [req stop];
    }
    [self clearCompletionBlock];
}
- (void)setCompletionBlockWithSuccess:(CJLBatchRequestSuccessBlock)success
                              failure:(CJLBatchRequestFailBlock)failure
{
    self.successCompletionBlock = success;
    self.failureCompletionBlock = failure;
}

- (void)clearCompletionBlock
{
    self.successCompletionBlock = nil;
    self.failureCompletionBlock = nil;
}

- (void)startWithCompletionBlockWithSuccess:(CJLBatchRequestSuccessBlock)success failure:(CJLBatchRequestFailBlock)failure
{
    [self setCompletionBlockWithSuccess:success failure:failure];
    [self start];
}

- (void)dealloc
{
    [self clearRequest];
}

#pragma mark -- CJLRequestDelegate
- (void)requestSuccessed:(__kindof CJLResponse *)response
{
    for (CJLRequest *req in _requestArray) {
        if (response.tag == req.tag) {
            [_responseArrM insertObject:response atIndex:(response.tag - TAG_OFFSET)];
            break;
        }
    }
    if (_responseArrM.count == _requestArray.count) {
        if ([_delegate respondsToSelector:@selector(batchRequestSuccess:)]) {
            [_delegate batchRequestSuccess:[_responseArrM copy]];
        }
        
        if (_successCompletionBlock) {
            _successCompletionBlock([_responseArrM copy]);
        }
        [self clearCompletionBlock];
    }
}

- (void)requestFailed:(__kindof CJLResponse *)response
{
    for (CJLRequest *req in _requestArray) {
        if (response.tag == req.tag) {
            _failedRequest = req;
            break;
        }
    }
    for (CJLRequest *req in _requestArray) {
        [req stop];
    }
    if ([_delegate respondsToSelector:@selector(batchRequestFailed:)]) {
        [_delegate batchRequestFailed:response];
    }
    if (_failureCompletionBlock) {
        _failureCompletionBlock(nil);
    }
    [self clearCompletionBlock];
}

@end
