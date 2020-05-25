//
//  TELoginViewController.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TELoginViewController.h"
#import "TEDataServices.h"

#import "TECourseListViewController.h"
#import "TENavigationController.h"

#import "TETencentCloudServices.h"
#import <ImSDK/TIMFriendshipManager.h>

#import "TELoginAuthModel.h"

@interface TELoginViewController ()
@property (weak, nonatomic) IBOutlet UIImageView *logoImageView;
@property (weak, nonatomic) IBOutlet UITextField *userNameTextField;
@property (weak, nonatomic) IBOutlet UITextField *passwordTextField;
@property (weak, nonatomic) IBOutlet UIButton *loginBtn;

@end

@implementation TELoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupView];
}

- (void)setupView
{
    self.logoImageView.layer.cornerRadius = 10;
    self.logoImageView.layer.masksToBounds = YES;
    
    self.loginBtn.layer.cornerRadius = 20;
    self.loginBtn.layer.masksToBounds = YES;
    CAGradientLayer *gradientLayer = [TEUtilFunction setGradualChangingColor:self.loginBtn fromColor:@"00D142" toColor:@"00A39C"];
    [self.loginBtn.layer addSublayer:gradientLayer];
    
//    self.userNameTextField.text = @"17136410628";
//    self.passwordTextField.text = @"123456";
}




-(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    [self.view endEditing:YES];
}

//17136410128
- (IBAction)loginBtnClick:(id)sender {
    if (self.userNameTextField.text.length == 0) {
        [MBProgressHUD showMessage:@"请输入用户名！"];
        return;
    }
    
    if (self.passwordTextField.text.length == 0) {
        [MBProgressHUD showMessage:@"请输入密码！"];
        return;
    }
    [MBProgressHUD showLoadingWithMessage:@"正在登录..." toView:self.view];
    [[TEDataServices sharedInstance] loginWithUserName:self.userNameTextField.text password:self.passwordTextField.text result:^(BOOL isSuccess, NSString * _Nonnull message) {
        [MBProgressHUD hideHUDForView:self.view];
        if (isSuccess) {
            //登录im
            [TETencentCloudServices loginIMWithUserName:self.userNameTextField.text loginResult:^(BOOL isSuccess, NSString * _Nonnull message) {
                if (isSuccess) {
                    
                    [[TIMFriendshipManager sharedInstance] getSelfProfile:^(TIMUserProfile *profile) {
                        [TELoginAuthModel sharedInstance].nickName = profile.nickname;
                        [[TELoginAuthModel sharedInstance] save];
                    } fail:^(int code, NSString *msg) {
                        
                    }];
                    CATransition *animation = [CATransition animation];
                    animation.type = kCATransitionPush;
                    animation.subtype = kCATransitionFromRight;
                    animation.duration = 0.25;
                    // 在window上执行CATransition, 即可在ViewController转场时执行动画
                    [self.view.window.layer addAnimation:animation forKey:@"kTransitionAnimation"];
                    TECourseListViewController *courseListVc = [[TECourseListViewController alloc] init];
                    TENavigationController *navVc = [[TENavigationController alloc] initWithRootViewController:courseListVc];
                    KEYWINDOW.rootViewController = navVc;
                }else{
                    [MBProgressHUD showError:message];
                }
            }];
        }else{
            [MBProgressHUD showError:message];
        }
    }];
    
}


@end
