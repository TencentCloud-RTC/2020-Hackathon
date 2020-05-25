//
//  CJLNetworkManager.m
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/26.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "CJLNetworkManager.h"
#import "CJLRequest.h"
#import "CJLResponse.h"
#import "CJLNetworkConfig.h"
#import "AFNetworking.h"
#import <pthread/pthread.h>

#define Lock() pthread_mutex_lock(&_lock)
#define Unlock() pthread_mutex_unlock(&_lock)

typedef NS_ENUM(NSInteger, CJLDownloadPrioritization) {
    CJLDownloadPrioritizationFIFO,
    CJLDownloadPrioritizationLIFO
};

@implementation CJLNetworkManager
{
    AFHTTPSessionManager *_manager;
    CJLNetworkConfig *_config;
    AFJSONResponseSerializer *_jsonResponseSerializer;
    AFXMLParserResponseSerializer *_xmlParserResponseSerialzier;
    NSMutableDictionary<NSNumber *, CJLRequest *> *_requestsRecord;
    
//    dispatch_queue_t _completionQueue;
    pthread_mutex_t _lock;
    
    
}

+ (CJLNetworkManager *)sharedNetworkManager
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
        _manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:_config.sessionConfiguration];
        _manager.securityPolicy = _config.securityPolicy;
        _manager.responseSerializer = [AFHTTPResponseSerializer serializer];
        
      
    
        //        _completionQueue = dispatch_queue_create("com.cjlnetwork.completionquene", DISPATCH_QUEUE_CONCURRENT);
        //        _manager.completionQueue = _completionQueue;
        _requestsRecord = [NSMutableDictionary dictionary];
    
        _jsonResponseSerializer = [AFJSONResponseSerializer serializer];
        _xmlParserResponseSerialzier = [AFXMLParserResponseSerializer serializer];
        pthread_mutex_init(&_lock, NULL);
    
    }
    return self;
}

- (NSString *)buildRequestUrl:(CJLRequest *)request
{
    NSString *detailUrl = request.requestUrl;
    NSURL *tempUrl = [NSURL URLWithString:detailUrl];
    if (tempUrl && tempUrl.host && tempUrl.scheme) {
        return detailUrl;
    }
    NSString *baseUrl;
    if (request.useCDN) {
        baseUrl = request.cdnUrl;
    }else{
        baseUrl = request.baseUrl;
    }
    NSURL *url = [NSURL URLWithString:baseUrl];
    
    if (baseUrl.length > 0 && ![baseUrl hasSuffix:@"/"]) {
        url = [url URLByAppendingPathComponent:@""];
    }
    
    return [NSURL URLWithString:detailUrl relativeToURL:url].absoluteString;
    
}


- (void)addRequest:(CJLRequest *)request
{
    NSParameterAssert(request);
    
    NSError * __autoreleasing requestSerializationError = nil;
    request.requestTask = [self sessionTaskForRequest:request error:&requestSerializationError];
    if (requestSerializationError) {
        NSLog(@"FAIL:Request Path %@, error = %@",
              request.requestUrl, requestSerializationError.localizedDescription);
        return;
    }
    
    switch (request.requestPriority) {
        case CJLRequestPriorityHigh:
            request.requestTask.priority = NSURLSessionTaskPriorityHigh;
            break;
        case CJLRequestPriorityLow:
            request.requestTask.priority = NSURLSessionTaskPriorityLow;
            break;
        case CJLRequestPriorityDefault:
        default:
            request.requestTask.priority = NSURLSessionTaskPriorityDefault;
            break;
    }
    
    [self addRequestToRecord:request];
    [request.requestTask resume];
}

- (void)cancelRequest:(CJLRequest *)request
{
    NSParameterAssert(request);
    
    [request.requestTask cancel];
    [self removeRequestFromRecord:request];
    [request clearCompletionBlock];
}

- (void)cancelAllRequests
{
    Lock();
    NSArray *allKeys = [_requestsRecord allKeys];
    Unlock();
    if (allKeys && allKeys.count > 0) {
        NSArray *copiedKeys = [allKeys copy];
        for (NSNumber *key in copiedKeys) {
            Lock();
            CJLRequest *request = _requestsRecord[key];
            Unlock();
            [self cancelRequest:request];
        }
    }
}

- (void)addRequestToRecord:(CJLRequest *)request {
    Lock();
    _requestsRecord[@(request.requestTask.taskIdentifier)] = request;
    Unlock();
}

- (void)removeRequestFromRecord:(CJLRequest *)request {
    Lock();
    [_requestsRecord removeObjectForKey:@(request.requestTask.taskIdentifier)];
    Unlock();
}

- (AFHTTPRequestSerializer *)requestSerializerForRequest:(CJLRequest *)request
{
    AFHTTPRequestSerializer *requestSerializer = nil;
    if (request.requestSerializerType == CJLRequestSerializerTypeHTTP) {
        requestSerializer = [AFHTTPRequestSerializer serializer];
    } else if (request.requestSerializerType == CJLRequestSerializerTypeJSON) {
        requestSerializer = [AFJSONRequestSerializer serializer];
    }
    
    requestSerializer.timeoutInterval = request.requestTimeoutInterval;
    requestSerializer.allowsCellularAccess = [request allowsCellularAccess];
      // 这里修改请求类型参数设置 DELETE放在请求体中
    if (request.HTTPMethodsEncodingParametersInURI.count > 0) {
        requestSerializer.HTTPMethodsEncodingParametersInURI = request.HTTPMethodsEncodingParametersInURI;
    }
    
    // 服务器用户名密码授权
    NSArray<NSString *> *authorizationHeaderFieldArray = request.requestAuthorizationHeaderFieldArray;
    if (authorizationHeaderFieldArray != nil) {
        [requestSerializer setAuthorizationHeaderFieldWithUsername:authorizationHeaderFieldArray.firstObject password:authorizationHeaderFieldArray.lastObject];
    }
    
    // 自定义请求头
    NSDictionary<NSString *, NSString *> *headerFieldValueDictionary = request.requestHeaderFieldValueDictionary;
    if (headerFieldValueDictionary != nil) {
        for (NSString *httpHeaderField in headerFieldValueDictionary.allKeys) {
            NSString *value = headerFieldValueDictionary[httpHeaderField];
            [requestSerializer setValue:value forHTTPHeaderField:httpHeaderField];
        }
    }
    return requestSerializer;
}

- (NSURLSessionTask *)sessionTaskForRequest:(CJLRequest *)request error:(NSError * _Nullable __autoreleasing *)error
{
    CJLRequestMethod method = request.requestMethod;
    NSString *url = [self buildRequestUrl:request];
    id param = request.requestParameter;
    AFHTTPRequestSerializer *requestSerializer = [self requestSerializerForRequest:request];
    AFConstructingBlock constructingBlock = request.constructingBodyBlock;
    if (constructingBlock && method != CJLRequestMethodPOST) {
        constructingBlock = nil;
    }
    NSString *methodString;
    switch (method) {
        case CJLRequestMethodGET:
            methodString = @"GET";
            break;
        case CJLRequestMethodPOST:
            methodString = @"POST";
            break;
        case CJLRequestMethodPUT:
            methodString = @"PUT";
            break;
        case CJLRequestMethodHEAD:
            methodString = @"HEAD";
            break;
        case CJLRequestMethodPATCH:
            methodString = @"PATCH";
            break;
        case CJLRequestMethodDELETE:
            methodString = @"DELETE";
            break;
    }
         return [self dataTaskWithHTTPMethod:methodString requestSerializer:requestSerializer URLString:url parameters:param constructingBodyWithBlock:constructingBlock error:error];

   
}


- (NSURLSessionTask *)dataTaskWithHTTPMethod:(NSString *)method
                           requestSerializer:(AFHTTPRequestSerializer *)requestSerializer
                                   URLString:(NSString *)URLString
                                  parameters:(id)parameters
                   constructingBodyWithBlock:(nullable void (^)(id <AFMultipartFormData> formData))block
                                       error:(NSError * _Nullable __autoreleasing *)error
{
    NSMutableURLRequest *request = nil;
    if (block) {
        request = [requestSerializer multipartFormRequestWithMethod:method URLString:URLString parameters:parameters constructingBodyWithBlock:block error:error];
    }else{
        request = [requestSerializer requestWithMethod:method URLString:URLString parameters:parameters error:error];
    }
    __block NSURLSessionDataTask *dataTask = nil;
    dataTask = [_manager dataTaskWithRequest:request uploadProgress:^(NSProgress * _Nonnull uploadProgress) {
        NSLog(@"=======================================================================%lld,%lld",uploadProgress.totalUnitCount,uploadProgress.completedUnitCount);
    } downloadProgress:^(NSProgress * _Nonnull downloadProgress) {
   NSLog(@"============================================================================%lld,%lld",downloadProgress.totalUnitCount,downloadProgress.completedUnitCount);
    } completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
        [self handleRequestResult:dataTask responseObject:responseObject error:error];
    }];
    return dataTask;
}




- (void)handleRequestResult:(NSURLSessionDataTask *)dataTask responseObject:(id)responseObject error:(NSError *)error
{
    Lock();
    CJLRequest *request = _requestsRecord[@(dataTask.taskIdentifier)];
    Unlock();
    if (!request) {
        return;
    }
    NSLog(@"Request Completion：%@",request.requestUrl);
    NSError * __autoreleasing serializationError = nil;
    __block CJLResponse *cjlResponse = [[CJLResponse alloc] initWithRequestTask:dataTask];
    cjlResponse.tag = request.tag;
    cjlResponse.userInfo = request.userInfo;
    cjlResponse.responseData = (NSData *)responseObject;
    
    switch (request.responseSerializerType) {
        case CJLResponseSerializerTypeHTTP:
            cjlResponse.responseObject = (NSData *)responseObject;
            break;
        case CJLResponseSerializerTypeJSON:
            cjlResponse.responseObject = [_jsonResponseSerializer responseObjectForResponse:dataTask.response data:cjlResponse.responseData error:&serializationError];
            break;
        case CJLResponseSerializerTypeXMLParser:
            cjlResponse.responseObject = [_xmlParserResponseSerialzier responseObjectForResponse:dataTask.response data:cjlResponse.responseData error:&serializationError];
            break;
    }
   
    if (serializationError) {
        NSLog(@"FAIL:Request Path %@,serializationError %@",request.requestUrl,serializationError.localizedDescription);
        cjlResponse.error = serializationError;
        NSLog(@"FAIL:Request Path %@, status code = %ld, error = %@",
            request.requestUrl, cjlResponse.responseStatusCode, error.localizedDescription);
        if (request.delegate != nil) {
            [request.delegate requestFailed:cjlResponse];
        }
        if (request.failureCompletionBlock) {
            request.failureCompletionBlock(cjlResponse);
        }
    }else if (error){
        cjlResponse.error = error;
        NSLog(@"FAIL:Request Path %@, status code = %ld, error = %@",
              request.requestUrl, cjlResponse.responseStatusCode, error.localizedDescription);
        if (request.delegate != nil) {
            [request.delegate requestFailed:cjlResponse];
        }
        if (request.failureCompletionBlock) {
            request.failureCompletionBlock(cjlResponse);
        }
    }else{
        NSLog(@"SUCCES: Request Path %@, status code = %ld",request.requestUrl, (long)cjlResponse.responseStatusCode);
        cjlResponse.error = nil;
        if (request.delegate != nil) {
            [request.delegate requestSuccessed:cjlResponse];
        }
        if (request.successCompletionBlock) {
            request.successCompletionBlock(cjlResponse);
        }
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self removeRequestFromRecord:request];
        [request clearCompletionBlock];
    });
}

@end
