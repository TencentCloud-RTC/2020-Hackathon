//
//  AppDelegate.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/4/30.
//  Copyright © 2020 caijunlai. All rights reserved.
//


//1400362544  ed8fec0e976d2bae2f85a4796233dfbab85d0ebb4b7f52be37c39e3cf7f21821
#import "AppDelegate.h"
#import "TENavigationController.h"
#import "TECourseListViewController.h"
#import "TELoginViewController.h"

#import "TELoginAuthModel.h"

#import "TUIKit.h"
#import <ImSDK/TIMManager.h>
#import "TETencentCloudServices.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

    //监听IM在其他地方登陆的通知
       [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onUserStatus:) name:TUIKitNotification_TIMUserStatusListener object:nil];
       //初始化TUIKit
       [[TUIKit sharedInstance] setupWithAppId:[TENCENT_APPID integerValue]];
    
    [[TELoginAuthModel sharedInstance] clear];
    
    [[TELoginAuthModel sharedInstance] fetch];
    if ([TELoginAuthModel sharedInstance].access_token.length > 0) {
        
        TECourseListViewController *courseListVc = [[TECourseListViewController alloc] init];
        TENavigationController *navVc = [[TENavigationController alloc] initWithRootViewController:courseListVc];
        self.window.rootViewController = navVc;
        [[TIMManager sharedInstance] autoLogin:[TELoginAuthModel sharedInstance].userName succ:nil fail:^(int code, NSString *msg) {
            TELoginViewController *loginVc = [[TELoginViewController alloc] init];
            self.window.rootViewController = loginVc;
        }];
    }else{
        TELoginViewController *loginVc = [[TELoginViewController alloc] init];
        self.window.rootViewController = loginVc;
    }

    
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)onUserStatus:(NSNotification *)notification
{
    TUIUserStatus status = [notification.object integerValue];
    switch (status) {
        case TUser_Status_ForceOffline:
        {
            [self exitLogin];
            
        }
            break;
        case TUser_Status_ReConnFailed:
        {
            NSLog(@"连网失败");
        }
            break;
        case TUser_Status_SigExpired:
        {
            NSLog(@"userSig过期");
            [self exitLogin];
        }
            break;
        default:
            break;
    }
}

- (void)exitLogin
{
    [[TELoginAuthModel sharedInstance] clear];
    
    CATransition *animation = [CATransition animation];
    animation.type = kCATransitionPush;
    animation.subtype = kCATransitionFromLeft;
    animation.duration = 0.25;
    // 在window上执行CATransition, 即可在ViewController转场时执行动画
    [self.window.layer addAnimation:animation forKey:@"kTransitionAnimation"];
    TELoginViewController *loginVc = [[TELoginViewController alloc] init];
    KEYWINDOW.rootViewController = loginVc;
}

@end
