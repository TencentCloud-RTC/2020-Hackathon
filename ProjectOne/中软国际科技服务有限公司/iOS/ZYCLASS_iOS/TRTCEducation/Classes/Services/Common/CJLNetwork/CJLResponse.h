//
//  CJLResponse.h
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/25.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

//响应状态
typedef NS_ENUM(NSInteger,CJLResponeStatus) {
    //请求成功
    CJLResponseStatusSuccess,
    //连接超时，服务器无响应
    CJLResponseStatusTimeout,
    //请求取消
    CJLResponseStatusCanceled,
    //网络故障,检查网络设置
    CJLResponseStatusNetworkError,
    //其他未知错误
    CJLResponseStatusUnknow,
};
@interface CJLResponse : NSObject
/// 请求标识
@property (nonatomic,assign) NSInteger tag;
/// 请求附加信息
@property (nonatomic,strong) NSDictionary *userInfo;
/// http响应
@property (nonatomic, strong, ) NSHTTPURLResponse *response;
/// 响应状态码
@property (nonatomic, assign) NSInteger responseStatusCode;
/// 响应头
@property (nonatomic, strong, nullable) NSDictionary *responseHeaders;
/// 响应数据
@property (nonatomic, strong, nullable) NSData *responseData;
/// 响应对象
@property (nonatomic, strong, nullable) id responseObject;
/// 响应错误
@property (nonatomic, strong, nullable) NSError *error;
/// 错误信息
@property(nonatomic, copy,nullable) NSString *errorMessage;
/// 响应状态
@property (nonatomic,assign) CJLResponeStatus responeStatus;

- (instancetype)initWithRequestTask:(NSURLSessionTask *)task;

@end

NS_ASSUME_NONNULL_END
