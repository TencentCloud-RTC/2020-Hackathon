//
//  TELoadingView.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TELoadingView.h"
#import "Masonry.h"

@implementation TELoadingView


- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self setupView];
    }
    return self;
}

- (void)setupView
{
    self.imageView = [[UIImageView alloc] init];
    self.imageView.image = [UIImage imageNamed:@"loading_icon"];
    [self addSubview:_imageView];
    [self.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.right.equalTo(self);
        make.height.equalTo(@80);
    }];
    
    self.label = [[UILabel alloc] init];
    self.label.textColor = [UIColor whiteColor];
    self.label.font = [UIFont systemFontOfSize:14];
    self.label.textAlignment = NSTextAlignmentCenter;
    self.label.text = @"加载中...";
    [self addSubview:_label];
    [self.label mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.imageView.mas_bottom);
        make.left.right.bottom.equalTo(self);
    }];
    
    
}

- (void)startLoading
{
    CABasicAnimation *animation = [CABasicAnimation animationWithKeyPath:@"transform"];
    CATransform3D rotationTransform = CATransform3DMakeRotation(M_PI, 0, 0, 1);
    animation.toValue = [NSValue valueWithCATransform3D:CATransform3DIdentity];
    animation.fromValue = [NSValue valueWithCATransform3D:rotationTransform];
    animation.cumulative = YES;
    animation.duration = 1;
    animation.autoreverses = NO;
    
    animation.fillMode = kCAFillModeForwards;
    animation.repeatCount = CGFLOAT_MAX;
    
    [self.imageView.layer addAnimation:animation forKey:nil];
}

- (void)stopLoading
{
    [self.imageView.layer removeAllAnimations];
}



@end
