//
//  UIBarButtonItem+Item.h
//  GreeProject
//
//  Created by caijunlai on 2019/1/24.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface BackView:UIView

@property(nonatomic,strong)UIButton *btn;

@end


@interface UIBarButtonItem (Item)
+ (UIBarButtonItem *)barButtonItemWithImage:(UIImage *)image hightLightImage:(UIImage *)highLightImage target:(id)target action:(SEL)action forControlEvents:(UIControlEvents)controlEvents;

+ (UIBarButtonItem *)barButtonItemWithImage:(UIImage *)image selectedImage:(UIImage *)selectedImage target:(id)target action:(SEL)action forControlEvents:(UIControlEvents)controlEvents;

@end
