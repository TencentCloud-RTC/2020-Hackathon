//
//  TEPlayerView.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/9.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TEPlayerView.h"
#import "TRTCVideoView.h"

#import "Masonry.h"

@interface TEPlayerView()<TRTCVideoViewDelegate>
/** 返回按钮 */
@property (nonatomic,strong) UIButton *backBtn;
/** 全屏按钮 */
@property (nonatomic,strong) UIButton *fullScreenBtn;

@end

#define PLAYER_WIDTH 150.0

@implementation TEPlayerView

- (instancetype)initWithFrame:(CGRect)frame userId:(TRTCParams *)param;
{
    if (self = [super initWithFrame:frame]) {
        // 本地预览view
        _localView = [TRTCVideoView newVideoViewWithType:VideoViewType_Local userId:param.userId];
        _localView.delegate = self;
        [_localView setBackgroundColor:HEX(@"262626")];
        
        self.param = param;
        self.mainViewUserId = @"";
        self.remoteViewDic = [NSMutableDictionary dictionary];
        [self setupView];
        
        
        [self relayout];
        
        
    }
       return self;
}

- (void)setupView
{
    _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_backBtn setImage:[UIImage imageNamed:@"back_icon"] forState:UIControlStateNormal];
    [_backBtn addTarget:self action:@selector(backBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    
    _fullScreenBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_fullScreenBtn setImage:[UIImage imageNamed:@"fullscreen_icon"] forState:UIControlStateNormal];
    [_fullScreenBtn setImage:[UIImage imageNamed:@"fullscreen_icon_select"] forState:UIControlStateSelected];
    [_fullScreenBtn addTarget:self action:@selector(fullScreenBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    
    _bgImageView = [[UIImageView alloc] init];
    _bgImageView.userInteractionEnabled = YES;
    _bgImageView.backgroundColor = HEX(@"262626");
   
   
    [self addSubview:_bgImageView];
    [self addSubview:_backBtn];
    [self addSubview:_fullScreenBtn];
    
     [self setupSubViewLayout];
}

- (void)setupSubViewLayout
{
//    [_bgImageView mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.edges.equalTo(self);
//    }];
    
    _bgImageView.frame = self.bounds;
    
    [self.backBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.equalTo(self.mas_leading).offset(5);
        make.top.equalTo(self.mas_top).offset(3);
        make.width.height.mas_equalTo(40);
    }];
    
    [self.fullScreenBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.width.height.mas_equalTo(40);
        make.right.equalTo(self).offset(-5 - TABBAR_SAFEBOTTOM_MARGIN);
        make.bottom.equalTo(self).offset(-3);
    }];
}

- (void)relayout
{
    NSMutableArray *views = @[].mutableCopy;
    if ([_mainViewUserId isEqual:@""] || [_mainViewUserId isEqual:self.param.userId]) {
        [views addObject:_localView];
        _localView.enableMove = NO;
    } else if([_remoteViewDic objectForKey:_mainViewUserId] != nil) {
        [views addObject:_remoteViewDic[_mainViewUserId]];
    }
    for (id userID in _remoteViewDic) {
        TRTCVideoView *playerView = [_remoteViewDic objectForKey:userID];
        if ([_mainViewUserId isEqual:userID]) {
            [views addObject:_localView];
            playerView.enableMove = NO;
            _localView.enableMove = YES;
        } else {
            playerView.enableMove = YES;
            [views addObject:playerView];
        }
    }
    
    [self startLayoutViews:[views copy]];
    
    //观众角色隐藏预览view(本地view直接隐藏)
     _localView.hidden = YES;
    if (_param.role == TRTCRoleAudience) {
         _localView.hidden = YES;
        [views removeObject:_localView];
    }
        
}

//布局播放视图
- (void)startLayoutViews:(NSArray<UIView *> *)views
{
    for (UIView * player in views) {
        [self.bgImageView addSubview:player];
        [self.bgImageView bringSubviewToFront:player];
        player.userInteractionEnabled = YES;
    }
    
    if (views.count == 0) {
        return;
    }
      
    if (views.count == 1) {
        views[0].frame = self.bgImageView.bounds;
        return;
    }
    
    [UIView beginAnimations:@"TRTCLayoutEngine" context:nil];
    [UIView setAnimationDuration:0.25];
    
    views[0].frame = self.bgImageView.bounds;
    for (NSInteger i = 1; i < views.count; i++) {
        CGFloat width = 0.0;
        if (self.isFullScreen) {
            width = PLAYER_WIDTH * 2;
        }else{
            width = PLAYER_WIDTH;
        }
        
        CGFloat height = width * 9/16;
        
     CGRect frame = [self relayoutPlayerIndex:i width:width height:height];
        views[i].frame = frame;
    }
    
    [UIView commitAnimations];
}
//四宫格
- (CGRect)relayoutPlayerIndex:(NSInteger)index width:(CGFloat)width height:(CGFloat)height
{
    NSInteger i = index % 4;
    CGFloat intervelX = (self.bgImageView.width - width * 2) / 3;
    CGFloat intervelY = (self.bgImageView.height - height * 2) / 3;
    CGRect frame = CGRectZero;
    switch (i) {
        case 0:
            frame = CGRectMake(intervelX, intervelY, width, height);
            break;
        case 1:
            frame = CGRectMake(intervelX, intervelY * 2 + height, width, height);
            break;
        case 2:
            frame = CGRectMake(intervelX * 2 + width, intervelY * 2 + height, width, height);
            break;
        case 3:
            frame = CGRectMake(intervelX * 2 + width, intervelY, width, height);
            break;
            
            
    }
    return frame;
}

- (void)backBtnClick:(UIButton *)sender
{
    if (self.isFullScreen) {
        self.fullScreenBtn.selected = NO;
        [self setIsFullScreen:NO];
        if (_delegate && [_delegate respondsToSelector:@selector(playerViewFullScreenChange:isFullScreen:)]) {
            [_delegate playerViewFullScreenChange:self isFullScreen:self.isFullScreen];
        }
    }else{
        if (_delegate && [_delegate respondsToSelector:@selector(playerViewBackBtnDidClick:)]) {
              [_delegate playerViewBackBtnDidClick:self];
          }
    }
}

- (void)fullScreenBtnClick:(UIButton *)sender
{
    sender.selected = !sender.selected;
    self.isFullScreen = !self.isFullScreen;
    [self setIsFullScreen:self.isFullScreen];
    
    if (_delegate && [_delegate respondsToSelector:@selector(playerViewFullScreenChange:isFullScreen:)]) {
           [_delegate playerViewFullScreenChange:self isFullScreen:self.isFullScreen];
       }
}


#pragma mark --- 设置父视图
/**
 *  player添加到fatherView上
 */
- (void)addPlayerToFatherView:(UIView *)view {
    [self removeFromSuperview];
    if (view) {
        [view addSubview:self];
       
        [self mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.edges.mas_offset(UIEdgeInsetsZero);
        }];
       
        [self.bgImageView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.edges.mas_offset(UIEdgeInsetsZero);
        }];
        [self.fullScreenBtn mas_updateConstraints:^(MASConstraintMaker *make) {
            make.right.equalTo(self).offset(-5);
        }];
    }
}

- (void)setFatherView:(UIView *)fatherView {
    if (fatherView != _fatherView) {
        [self addPlayerToFatherView:fatherView];
    }
    _fatherView = fatherView;
}


- (UIViewController *)viewController {
    UIView *view = self;
    while (view) {
        UIResponder *nextResponder = [view nextResponder];
        if ([nextResponder isKindOfClass:[UIViewController class]]) {
            return (UIViewController *)nextResponder;
        }
        view = view.superview;
      }
    return nil;
}

#pragma mark - KVO 全屏处理
/**
 *  设置横屏的约束
 */
- (void)setOrientationLandscapeConstraint:(UIInterfaceOrientation)orientation {
    _isFullScreen = YES;
//    [self _switchToLayoutStyle:orientation];
}

/**
 *  设置竖屏的约束
 */
- (void)setOrientationPortraitConstraint {

    [self addPlayerToFatherView:self.fatherView];
    _isFullScreen = NO;
//    [self _switchToLayoutStyle:UIInterfaceOrientationPortrait];
}

- (UIDeviceOrientation)_orientationForFullScreen:(BOOL)fullScreen {
    UIDeviceOrientation targetOrientation = [UIDevice currentDevice].orientation;
    if (fullScreen) {
        if (!UIDeviceOrientationIsLandscape(targetOrientation)) {
            targetOrientation = UIDeviceOrientationLandscapeLeft;
        }
    } else {
        if (!UIDeviceOrientationIsPortrait(targetOrientation)) {
            targetOrientation = UIDeviceOrientationPortrait;
        }
    //    targetOrientation = (UIDeviceOrientation)[UIApplication sharedApplication].statusBarOrientation;
    }
    return targetOrientation;
}

- (void)_switchToFullScreen:(BOOL)fullScreen {
    if (_isFullScreen == fullScreen) {
        return;
    }
    _isFullScreen = fullScreen;
    [self.fatherView.mm_viewController setNeedsStatusBarAppearanceUpdate];

//    UIDeviceOrientation targetOrientation = [self _orientationForFullScreen:fullScreen];// [UIDevice currentDevice].orientation;

    if (fullScreen) {
        [self removeFromSuperview];
        
        [[UIApplication sharedApplication].keyWindow addSubview:self];

        
        [self mas_remakeConstraints:^(MASConstraintMaker *make) {

               make.width.equalTo(@(SCREEN_HEIGHT));

               make.height.equalTo(@(SCREEN_WIDTH));
               make.center.equalTo([UIApplication sharedApplication].keyWindow);
           }];

//         [[UIApplication sharedApplication].keyWindow layoutIfNeeded];

        [self.bgImageView mas_remakeConstraints:^(MASConstraintMaker *make) {
            if (IS_IPHONEX_SERIES) {
                make.width.equalTo(@(SCREEN_HEIGHT - self.mm_safeAreaTopGap * 2));
                make.width.equalTo(@(SCREEN_HEIGHT));
            } else {
                make.width.equalTo(@(SCREEN_HEIGHT));
            }
            make.height.equalTo(@(SCREEN_WIDTH));
            make.center.equalTo(self);
        }];
        
        [self.fullScreenBtn mas_updateConstraints:^(MASConstraintMaker *make) {
            make.right.equalTo(self).offset(-5 - TABBAR_SAFEBOTTOM_MARGIN);
        }];
    } else {
        [self addPlayerToFatherView:self.fatherView];
    }
//    [self relayout];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self relayout];
}


- (void)_adjustTransform:(UIDeviceOrientation)orientation {

    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.3];

    self.transform = [self getTransformRotationAngleOfOrientation:orientation];
    [UIView commitAnimations];
}

/**
 * 获取变换的旋转角度
 *
 * @return 变换矩阵
 */
- (CGAffineTransform)getTransformRotationAngleOfOrientation:(UIDeviceOrientation)orientation {
    // 状态条的方向已经设置过,所以这个就是你想要旋转的方向
    UIInterfaceOrientation interfaceOrientation = [UIApplication sharedApplication].statusBarOrientation;
    if (interfaceOrientation == (UIInterfaceOrientation)orientation) {
        return CGAffineTransformIdentity;
    }
    // 根据要进行旋转的方向来计算旋转的角度
    if (orientation == UIInterfaceOrientationPortrait) {
        return CGAffineTransformIdentity;
    } else if (orientation == UIInterfaceOrientationLandscapeLeft){
        return CGAffineTransformMakeRotation(-M_PI_2);
    } else if(orientation == UIInterfaceOrientationLandscapeRight){
        return CGAffineTransformMakeRotation(M_PI_2);
    }
    return CGAffineTransformIdentity;
}

#pragma mark 屏幕转屏相关
/** 全屏 */
- (void)setIsFullScreen:(BOOL)fullScreen {

    if (_isFullScreen != fullScreen) {
        [self _adjustTransform:[self _orientationForFullScreen:fullScreen]];
        [self _switchToFullScreen:fullScreen];
    }
    _isFullScreen = fullScreen;
}

/**
 *  屏幕转屏
 *
 *  @param orientation 屏幕方向
 */
- (void)interfaceOrientation:(UIInterfaceOrientation)orientation {
    if (orientation == UIInterfaceOrientationLandscapeRight || orientation == UIInterfaceOrientationLandscapeLeft) {
        // 设置横屏
        [self setOrientationLandscapeConstraint:orientation];
    } else if (orientation == UIInterfaceOrientationPortrait) {
        // 设置竖屏
        [self setOrientationPortraitConstraint];
    }
}


@end
