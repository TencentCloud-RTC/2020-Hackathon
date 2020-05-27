//
//  TELoginAuthModel.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/8.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TELoginAuthModel.h"

@implementation TELoginAuthModel

+ (TELoginAuthModel *)sharedInstance
{
    static TELoginAuthModel *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[TELoginAuthModel alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    if (self = [super init]) {
        self.nickName = @"";
    }
    return self;
}

- (void)save
{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    [userDefaults setObject:self.token_type forKey:@"tokenType"];
    [userDefaults setObject:self.access_token forKey:@"accessToke"];
    [userDefaults setObject:self.userName forKey:@"userName"];
    [userDefaults setObject:self.nickName forKey:@"nickName"];
    [userDefaults synchronize];
}

- (void)fetch
{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    self.access_token = [userDefaults objectForKey:@"accessToke"];
    self.token_type = [userDefaults objectForKey:@"tokenType"];
    self.userName = [userDefaults objectForKey:@"userName"];
    self.nickName = [userDefaults objectForKey:@"nickName"];
}

- (void)clear
{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    [userDefaults removeObjectForKey:@"accessToke"];
    [userDefaults removeObjectForKey:@"accessToke"];
    [userDefaults removeObjectForKey:@"userName"];
    [userDefaults removeObjectForKey:@"nickName"];
}


@end
