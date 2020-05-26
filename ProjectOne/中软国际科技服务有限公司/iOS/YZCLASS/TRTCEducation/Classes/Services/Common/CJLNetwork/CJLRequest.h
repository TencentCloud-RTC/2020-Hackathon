//
//  CJLRequest.h
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/25.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <Foundation/Foundation.h>
@class CJLResponse;
@class AFSecurityPolicy;

NS_ASSUME_NONNULL_BEGIN
//请求方法
typedef NS_ENUM(NSInteger,CJLRequestMethod) {
    CJLRequestMethodGET = 0,
    CJLRequestMethodPOST,
    CJLRequestMethodHEAD,
    CJLRequestMethodPUT,
    CJLRequestMethodDELETE,
    CJLRequestMethodPATCH,
};

//请求类型
typedef NS_ENUM(NSInteger, CJLRequestSerializerType) {
    CJLRequestSerializerTypeHTTP = 0,
    CJLRequestSerializerTypeJSON,
};

//响应类型
typedef NS_ENUM(NSInteger, CJLResponseSerializerType) {
    /// NSData type
    CJLResponseSerializerTypeHTTP,
    /// JSON object type
    CJLResponseSerializerTypeJSON,
    /// NSXMLParser type
    CJLResponseSerializerTypeXMLParser,
};

//请求优先级
typedef NS_ENUM(NSInteger, CJLRequestPriority) {
    CJLRequestPriorityLow = -4L,
    CJLRequestPriorityDefault = 0,
    CJLRequestPriorityHigh = 4,
};

//任务进度block
typedef void (^AFURLSessionTaskProgressBlock)(NSProgress * _Nullable progress);

@class CJLRequest;
//请求完成block
typedef void(^CJLRequestCompletionBlock)(__kindof CJLResponse * response);

@protocol AFMultipartFormData;
//MultipartFormData的block
typedef void (^AFConstructingBlock)(id<AFMultipartFormData>  formData);

@protocol CJLRequestDelegate <NSObject>

@optional
//请求成功
- (void)requestSuccessed:(CJLResponse *)response;
//请求失败
- (void)requestFailed:(CJLResponse *)response;
@end



@interface CJLRequest : NSObject
/** 请求任务 */
@property (nonatomic,strong) NSURLSessionTask *requestTask;
///任务是否取消
@property (nonatomic, readonly, getter=isCancelled) BOOL cancelled;
///任务是否正在执行
@property (nonatomic, readonly, getter=isExecuting) BOOL executing;
///CJLRequest的代理
@property (nonatomic, weak, nullable) id<CJLRequestDelegate> delegate;

/// 请求成功block，代理方法先执行，再执行block
@property (nonatomic, copy, nullable) CJLRequestCompletionBlock successCompletionBlock;
/// 请求失败block，代理方法先执行，再执行block
@property (nonatomic, copy, nullable) CJLRequestCompletionBlock failureCompletionBlock;

///设置请求成功和失败的block回调
- (void)setRequestCompletionBlockWithSuccess:(nullable CJLRequestCompletionBlock)success failure:(nullable CJLRequestCompletionBlock)failure;

/// 清除请求block回调属性，请求完成自动置nil
- (void)clearCompletionBlock;

///  开始请求，一般使用代理的方法请求，也可以设置请求完成回调的block方式
- (void)start;

///  停止请求
- (void)stop;

///  使用block回调的方法请求
- (void)startWithCompletionBlockWithSuccess:(nullable CJLRequestCompletionBlock)success failure:(nullable CJLRequestCompletionBlock)failure;


#pragma mark - 请求需要设置的属性，大部分有默认值
/// 可以通过继承CJLRequest的方式，重写下面属性的get方法，将每个请求封装成类

///                       必须设置
//==============================================================
/// 请求路径，可以设置全路径，也可以设置相对路径（基于baseUrl）
@property (nonatomic,copy) NSString *requestUrl;
/// 请求参数，使用字典或json字符串的格式，不需要参数可以不设置
@property (nonatomic,strong) id requestParameter;

///                       可以全局配置
///==============================================================
/// 请求的baseUrl，默认值在CJLNetworkConfig中设置，如：https://baidu.com
@property (nonatomic,copy) NSString *baseUrl;
/// 请求超时时间，默认值在CJLNetworkConfig中设置，默认60s
@property (nonatomic,assign) NSTimeInterval requestTimeoutInterval;
/// 设置请求头，默认nil，可以在CJLNetworkConfig全局配置
@property (nonatomic,strong) NSDictionary<NSString * ,NSString *> *requestHeaderFieldValueDictionary;
/// 请求用户名密码授权，默认nil，[usename,password]，可以在CJLNetworkConfig全局配置
@property (nonatomic,strong) NSArray<NSString *> *requestAuthorizationHeaderFieldArray;
/// 是否允许蜂窝网作网络请求，默认YES，可以在CJLNetworkConfig全局配置
@property (nonatomic,assign) BOOL allowsCellularAccess;
/// 相当于baseUrl，必须与useCDN一起设置，当useCDN为YES时，baseUrl = cdnUrl
/// 默认值在CJLNetworkConfig中设置
@property (nonatomic,copy) NSString *cdnUrl;

///                       包含通用默认值
///===============================================================
/// 请求方法，默认是GET
@property (nonatomic,assign) CJLRequestMethod requestMethod;
/// 请求优先级，默认值：CJLRequestPriorityDefault
@property (nonatomic,assign) CJLRequestPriority requestPriority;
/// 请求标识，与响应标识一致，默认值：0
@property (nonatomic,assign) NSInteger tag;
/// 请求附加信息，与响应附加信息一致，默认值：nil
@property (nonatomic, strong, nullable) NSDictionary *userInfo;
/// 启用cdnUrl，默认值：NO
@property (nonatomic,assign) BOOL useCDN;
/// 请求序列类型，默认AFHTTPRequestSerializer
@property (nonatomic,assign) CJLRequestSerializerType requestSerializerType;
/// 响应序列类型，默认AFJSONResponseSerializer
@property (nonatomic,assign) CJLResponseSerializerType responseSerializerType;
//构造http请求体,用于uoload请求，默认nil
@property (nonatomic, copy, nullable) AFConstructingBlock constructingBodyBlock;
/** 默认GET ，HEAD,DELETE请求参数拼接在url后面,即默认值， 如果这三个请求某个请求参数在请求体中，重新设置不包含这个值的数组
    如：HTTPMethodsEncodingParametersInURI = [NSSet setWithObjects:@"GET", @"HEAD", nil];
 */
@property (nonatomic,strong) NSSet<NSString *> *HTTPMethodsEncodingParametersInURI;

@end

NS_ASSUME_NONNULL_END
