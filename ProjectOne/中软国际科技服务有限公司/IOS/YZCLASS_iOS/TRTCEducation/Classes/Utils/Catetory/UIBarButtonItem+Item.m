//
//  UIBarButtonItem+Item.h
//  GreeProject
//
//  Created by caijunlai on 2019/1/24.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import "UIBarButtonItem+Item.h"

@implementation BackView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
    }
    return self;
}
-(void)layoutSubviews{
    [super layoutSubviews];
    UINavigationBar *navBar = nil;
    UIView *aView = self.superview;
    while (aView) {
        if ([aView isKindOfClass:[UINavigationBar class]]) {
            navBar = (UINavigationBar *)aView;
            break;
        }
        aView = aView.superview;
    }
    UINavigationItem * navItem =   (UINavigationItem *)navBar.items.lastObject;
    UIBarButtonItem *leftItem = navItem.leftBarButtonItem;
    UIBarButtonItem *rightItem = navItem.rightBarButtonItem;
    
    
    if (rightItem) {//右边按钮
        BackView *backView = rightItem.customView;
        if ([backView isKindOfClass:self.class]) {
            backView.btn.x = backView.width -backView.btn.width;
            backView.btn.y = (backView.height - backView.btn.height) * 0.5;
        }
    }
    if (leftItem) {//左边按钮
        BackView *backView = leftItem.customView;
        if ([backView isKindOfClass:self.class]) {
             backView.btn.y = (backView.height - backView.btn.height) * 0.5;
        }
    }
}
@end

@implementation UIBarButtonItem (Item)
+ (UIBarButtonItem *)barButtonItemWithImage:(UIImage *)image hightLightImage:(UIImage *)highLightImage target:(id)target action:(SEL)action forControlEvents:(UIControlEvents)controlEvents
{
    BackView *customView = [[BackView alloc] initWithFrame:CGRectMake(0, 0, 40, 30)];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:target action:action];
    [customView addGestureRecognizer:tap];
    customView.btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [customView.btn setBackgroundImage:image forState:UIControlStateNormal];
    [customView.btn setBackgroundImage:highLightImage forState:UIControlStateHighlighted];
    [customView.btn sizeToFit];
    
    [customView.btn addTarget:target action:action forControlEvents:controlEvents];
    [customView addSubview:customView.btn];
    return  [[UIBarButtonItem alloc] initWithCustomView:customView];

}

+ (UIBarButtonItem *)barButtonItemWithImage:(UIImage *)image selectedImage:(UIImage *)selectedImage target:(id)target action:(SEL)action forControlEvents:(UIControlEvents)controlEvents
{
    BackView *customView = [[BackView alloc] initWithFrame:CGRectMake(0, 0, 40, 30)];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:target action:action];
    [customView addGestureRecognizer:tap];
    customView.btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [customView.btn setBackgroundImage:image forState:UIControlStateNormal];
    [customView.btn setBackgroundImage:selectedImage forState:UIControlStateSelected];
    [customView.btn sizeToFit];
    
    [customView.btn addTarget:target action:action forControlEvents:controlEvents];
    [customView addSubview:customView.btn];
    return  [[UIBarButtonItem alloc] initWithCustomView:customView];

}


@end
