//
//  ZYRequestResult.h
//  ZhiYunEducation
//
//  Created by caijunlai on 2019/12/25.
//  Copyright © 2019 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CJLResponse.h"

NS_ASSUME_NONNULL_BEGIN

@interface TERequestResult : NSObject
/** 提示信息 */
@property (nonatomic,copy,readonly) NSString *message;
/** 请求状态码 */
@property (nonatomic,assign,readonly) NSInteger statusCode;
/** 请求是否成功 */
@property (nonatomic,assign,readonly) BOOL isSuccess;
/** 请求是否有异常 */
@property (nonatomic,assign,readonly) BOOL isError;
/** 请求数据 */
@property (nonatomic,strong,readonly) id data;

- (instancetype)initWithResponse:(CJLResponse *)response;

@end

NS_ASSUME_NONNULL_END
