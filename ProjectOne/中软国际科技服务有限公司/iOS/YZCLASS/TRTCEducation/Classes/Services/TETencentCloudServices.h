//
//  TETencentCloudServices.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/8.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TETencentCloudServices : NSObject
//签名过期时间
#define EXPIRETIME  @"604800"

//腾讯云APPID
#define TENCENT_APPID @"1400362544"

//计算签名用的加密密钥
 
#define SECRETKEY @"ed8fec0e976d2bae2f85a4796233dfbab85d0ebb4b7f52be37c39e3cf7f21821"


+ (NSString *)genTestUserSig:(NSString *)identifier;

+ (void)loginIMWithUserName:(NSString *)userName loginResult:(void(^)(BOOL isSuccess,NSString *message))result;
@end

NS_ASSUME_NONNULL_END
