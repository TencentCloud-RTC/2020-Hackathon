//
//  CJLBatchRequest.h
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/28.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class CJLBatchRequest;
@class CJLRequest;
@class CJLResponse;

/// 批量请求成功block，参数为响应数组，响应数组顺序与批量请求数组顺序一一对应
typedef void(^CJLBatchRequestSuccessBlock)( NSArray<CJLResponse *> * _Nullable batchRespones);
/// 批量请求失败block，参数为第一个请求失败的响应
typedef void(^CJLBatchRequestFailBlock)(CJLResponse * _Nullable batchRespones);

@protocol CJLBatchRequestDelegate <NSObject>

@optional
/// 批量请求成功代理，参数为响应数组，响应数组顺序与批量请求数组顺序一一对应
- (void)batchRequestSuccess:( NSArray<CJLResponse *> * _Nullable ) batchRespones;
/// 批量请求失败代理，参数为第一个请求失败的响应
- (void)batchRequestFailed:(CJLResponse *)failRespone;

@end

@interface CJLBatchRequest : NSObject
/// 批量请求数组
@property (nonatomic,strong,nullable) NSArray<CJLRequest *> * requestArray;
/// 批量请求代理
@property (nonatomic, weak, nullable) id<CJLBatchRequestDelegate> delegate;
/// 批量请求成功block
@property (nonatomic, copy, nullable) CJLBatchRequestSuccessBlock successCompletionBlock;
/// 批量请求失败block
@property (nonatomic, copy, nullable) CJLBatchRequestFailBlock failureCompletionBlock;
/// 批量请求第一个失败的请求
@property (nonatomic, strong, readonly, nullable) CJLRequest *failedRequest;
/// 初始化
- (instancetype)initWithRequestArray:(NSArray<CJLRequest *> * _Nullable)requestArray;
/// 开始请求
-(void)startWithCompletionBlockWithSuccess:(CJLBatchRequestSuccessBlock)success failure:(CJLBatchRequestFailBlock)failure;
@end

NS_ASSUME_NONNULL_END
