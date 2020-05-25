//
//  TENavigationController.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/4/30.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TENavigationController.h"

#import "TECourseDetailViewController.h"

#import "TELoginViewController.h"

@interface TENavigationController ()<UINavigationControllerDelegate>

@end

@implementation TENavigationController

+ (void)initialize
{
    NSDictionary *dict = @{NSForegroundColorAttributeName : HEX(@"373232")};
    [UINavigationBar appearance].titleTextAttributes = dict;
   
    //[UINavigationBar appearance].tintColor = [UIColor whiteColor];
    UIImage *originImage = [[UIImage imageNamed:@"back_icon"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
    //隐藏系统返回键
    [UINavigationBar appearance].backIndicatorImage = originImage;
    [UINavigationBar appearance].backIndicatorTransitionMaskImage = originImage;
    
    UIImage *image = [UIImage whiteColorImage];
    
    [[UINavigationBar appearance] setBackgroundImage:image forBarMetrics:UIBarMetricsDefault];
    
}


- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.delegate = self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(networkAuthorizationExpire:) name:@"networkAuthorizationExpireNotification" object:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    if (self.childViewControllers.count > 0) {

        viewController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage new]  style:UIBarButtonItemStylePlain target:nil action:nil];
    }
   
    if ([viewController isKindOfClass:[TECourseDetailViewController class]]) {
         [navigationController setNavigationBarHidden:YES animated:YES];
    }else{
        //系统相册继承自 UINavigationController 这个不能隐藏 所有就直接return
        if ([navigationController isKindOfClass:[UIImagePickerController class]]) {
            return;
        }
        
        //不在本页时，显示真正的navbar
        [navigationController setNavigationBarHidden:NO animated:YES];
    }
    
}

- (void)networkAuthorizationExpire:(NSNotification *)notification
{
    CATransition *animation = [CATransition animation];
    animation.type = kCATransitionPush;
    animation.subtype = kCATransitionFromLeft;
    animation.duration = 0.25;
    // 在window上执行CATransition, 即可在ViewController转场时执行动画
    [self.view.window.layer addAnimation:animation forKey:@"kTransitionAnimation"];
    
     TELoginViewController *loginVc = [[TELoginViewController alloc] init];
     KEYWINDOW.rootViewController = loginVc;
}

@end
