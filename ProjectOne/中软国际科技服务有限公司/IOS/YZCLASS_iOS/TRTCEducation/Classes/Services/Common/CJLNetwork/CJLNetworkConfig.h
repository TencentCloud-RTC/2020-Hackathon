//
//  CJLNetworkConfig.h
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/26.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <Foundation/Foundation.h>
@class AFSecurityPolicy;

NS_ASSUME_NONNULL_BEGIN

@interface CJLNetworkConfig : NSObject

@property (nonatomic, strong) NSString *baseUrl;

@property (nonatomic, strong) NSString *cdnUrl;

@property (nonatomic, strong) AFSecurityPolicy *securityPolicy;

@property (nonatomic, strong) NSURLSessionConfiguration* sessionConfiguration;

@property (nonatomic,assign) NSTimeInterval requestTimeOut;

@property (nonatomic,strong) NSDictionary *requestHeaderFieldValueDictionary;

@property (nonatomic,strong) NSArray<NSString *> *requestAuthorizationHeaderFieldArray;


- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

+ (CJLNetworkConfig *)sharedNetworkConfig;




@end

NS_ASSUME_NONNULL_END
