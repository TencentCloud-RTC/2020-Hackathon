//
//  TELoginAuthModel.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/8.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TELoginAuthModel : NSObject
/** token */
@property (nonatomic,copy) NSString *access_token;
/** Token前缀 */
@property (nonatomic,copy) NSString *token_type;
/** 有效期 */
@property (nonatomic,copy) NSString *expires_in;
/** 有效范围 */
@property (nonatomic,copy) NSString *scope;
/** jti */
@property (nonatomic,copy) NSString *jti;

/** 用户名 */
@property (nonatomic,copy) NSString *userName;
/** 昵称 */
@property (nonatomic,copy) NSString *nickName;

+ (TELoginAuthModel *)sharedInstance;

- (void)save;

- (void)fetch;

- (void)clear;

@end

NS_ASSUME_NONNULL_END
