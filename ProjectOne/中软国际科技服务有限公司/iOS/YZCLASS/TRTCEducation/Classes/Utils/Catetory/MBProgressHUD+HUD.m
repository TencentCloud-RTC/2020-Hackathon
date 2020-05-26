//
//  MBProgressHUD+HUD.m
//  GreeProject
//
//  Created by caijunlai on 2019/1/30.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "MBProgressHUD+HUD.h"


@implementation MBProgressHUD (HUD)

+ (void)showLoadingToView:(UIView *)view
{
    [MBProgressHUD showLoadingToView:view isBackgroundView:NO];
}

+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view
{
     [MBProgressHUD showLoadingWithMessage:message toView:view isBackgroundView:NO isOffset:YES];
}

+ (void)showLoadingToView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView
{
    [MBProgressHUD showLoadingWithMessage:nil toView:view isBackgroundView:isBackgroundView isOffset:YES];
}
+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView
{
     [MBProgressHUD showLoadingWithMessage:message toView:view isBackgroundView:isBackgroundView isOffset:YES];
}
+ (void)showLoadingWithMessage:(NSString *)message toView:(UIView *)view isBackgroundView:(BOOL)isBackgroundView isOffset:(BOOL)isOffset
{
    if (view == nil) {
        view = KEYWINDOW;
    }
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
    hud.label.text = message;
//    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
//    hud.bezelView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.9];
//    hud.label.textColor = [UIColor whiteColor];
    hud.label.font = [UIFont systemFontOfSize:14];
    if (isBackgroundView) {
        hud.backgroundView.style = MBProgressHUDBackgroundStyleSolidColor;
        hud.backgroundColor = [UIColor whiteColor];
    }
    if (isOffset) {
        hud.offset = CGPointMake(0, -STATUSBAR_NAVIGATIONBAR_HEIGHT * 0.5);
    }
}


+ (void)show:(NSString *)text icon:(NSString *)icon view:(UIView *)view delayIsHide:(BOOL)isDelayHide  backgroundView:(BOOL)isBackgroundView offset:(BOOL)isOffset
{
    if (view == nil) {
        view = KEYWINDOW;
    }
    // 快速显示一个提示信息
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
    hud.label.text = text;
    // 设置图片
    NSString *imageName = [NSString stringWithFormat:@"MBProgressHUD.bundle/%@", icon];
//    UIImage *image = [GRUtilFunction imageChangeColor:[UIColor whiteColor] withImage:[UIImage imageNamed:imageName]];
    hud.customView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    // 再设置模式
    hud.mode = MBProgressHUDModeCustomView;
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = RGB(246, 246, 246);
//    hud.label.textColor = [UIColor whiteColor];
    hud.label.font = [UIFont systemFontOfSize:14];
    hud.label.numberOfLines = 0;
    if (isDelayHide) {
        hud.removeFromSuperViewOnHide = YES;
        [hud hideAnimated:YES afterDelay:2.5];
    }
    if (isBackgroundView) {
        hud.backgroundView.style = MBProgressHUDBackgroundStyleSolidColor;
        hud.backgroundColor = [UIColor whiteColor];
    }
    if (isOffset) {
        hud.offset = CGPointMake(0, -STATUSBAR_NAVIGATIONBAR_HEIGHT * 0.5);
    }
}

+ (void)showSuccess:(NSString *)success toView:(UIView *)view
{
     [self show:success icon:@"success.png" view:view delayIsHide:YES backgroundView:NO offset:NO];
}
+ (void)showError:(NSString *)error toView:(UIView *)view
{
    [self show:error icon:@"error.png" view:view delayIsHide:YES backgroundView:NO offset:YES];
}

+ (void)showControllerError:(NSString *)error toView:(UIView *)view
{
    [self show:error icon:@"error.png" view:view delayIsHide:NO backgroundView:YES offset:YES];
}



+ (void)showMessage:(NSString *)message toView:(UIView *)view
{
 
    [self show:message icon:nil view:view delayIsHide:YES backgroundView:NO offset:NO];
  
}


+ (void)showSuccess:(NSString *)success
{
     [self showSuccess:success toView:nil];
}
+ (void)showError:(NSString *)error
{
    [self show:error icon:@"error.png" view:nil delayIsHide:YES backgroundView:NO offset:NO];
}

+ (void)showMessage:(NSString *)message
{
    [self showMessage:message toView:nil];
    
}

+ (void)showBottomMessage:(NSString *)message
{
//    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:[[UIApplication sharedApplication].windows lastObject] animated:YES];
//    hud.label.text = message;
//    hud.label.font = [UIFont systemFontOfSize:14];
//    hud.label.numberOfLines = 0;
//    hud.removeFromSuperViewOnHide = YES;
//    hud.mode = MBProgressHUDModeCustomView;
//    hud.customView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@""]];
//    [hud hideAnimated:YES afterDelay:2.5];
//    hud.offset = CGPointMake(0.f, MBProgressMaxOffset);
   
}

+ (void)hideHUDForView:(UIView *)view
{
    [self hideHUDForView:view animated:YES];
}
+ (void)hideHUD
{
     [self hideHUDForView:nil];
}
@end
