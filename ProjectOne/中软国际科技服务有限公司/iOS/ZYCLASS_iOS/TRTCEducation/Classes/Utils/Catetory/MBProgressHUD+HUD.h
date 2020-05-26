//
//  MBProgressHUD+HUD.h
//  GreeProject
//
//  Created by caijunlai on 2019/1/30.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "MBProgressHUD.h"

//NS_ASSUME_NONNULL_BEGIN
@interface MBProgressHUD (HUD)
+ (void)showLoadingToView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView;

+ (void)showLoadingToView:(UIView *)view;;

+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view;

+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView;

+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView isOffset:(BOOL)isOffset;

+ (void)showSuccess:(NSString *)success toView:(UIView *)view;
+ (void)showError:(NSString *)error toView:(UIView *)view;
+ (void)showControllerError:(NSString *)error toView:(UIView *)view;

+ (void)showMessage:(NSString *)message toView:(UIView *)view;

+ (void)showSuccess:(NSString *)success;
+ (void)showError:(NSString *)error;

+ (void)showMessage:(NSString *)message;
+ (void)showBottomMessage:(NSString *)message;

+ (void)hideHUDForView:(UIView *)view;
+ (void)hideHUD;
@end

//NS_ASSUME_NONNULL_END
