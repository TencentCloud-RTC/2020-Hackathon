//
//  TETitlePageView.m
//  ZhiYunEducation
//
//  Created by caijunlai on 2019/12/28.
//  Copyright © 2019 caijunlai. All rights reserved.
//

#import "TETitlePageView.h"

@interface TETitlePageView()<UIScrollViewDelegate>
/** 头部视图 */
@property (nonatomic,strong) UIView *headView;
/** 内容视图 */
@property (nonatomic,strong) UIScrollView *scrollView;
/** 头部视图指示线 */
@property (nonatomic,strong) UIView *indicateLine;
/** 存放标题按钮 */
@property (nonatomic,strong) NSArray *buttonArr;
@end
@implementation TETitlePageView

static CGFloat kHeadviewHeight = 42.0;
static CGFloat kButtonHeight = 40.0;
static CGFloat kInterval = 70;

- (void)setIsScroll:(BOOL)isScroll
{
    _isScroll = isScroll;
    self.scrollView.scrollEnabled = isScroll;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self setupHeadView];
        [self setupScrollView];
        self.buttonArr = [NSArray array];
        self.selectedIndex = 0;
        self.titleColor = HEX(@"9E9E9F");
        self.selectedTitleColor = HEX(@"43B478");
        self.titleFont = [UIFont systemFontOfSize:15];
        self.indicateLineColor = HEX(@"43B478");
        self.isScroll = YES;
    }
    return self;
}

- (void)setupHeadView
{
    self.headView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, kHeadviewHeight)];
    [self addSubview:_headView];
    
    UIView *headerBottomLineView = [[UIView alloc] initWithFrame:CGRectMake(0, kHeadviewHeight - 1, SCREEN_WIDTH, 1)];
    headerBottomLineView.backgroundColor = HEX(@"E5E5E5");
    [self.headView addSubview:headerBottomLineView];
    
}

- (void)setupScrollView
{
    self.scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, kHeadviewHeight, SCREEN_WIDTH, self.height - kHeadviewHeight)];
    self.scrollView.bounces = NO;
    self.scrollView.pagingEnabled = YES;
    self.scrollView.showsHorizontalScrollIndicator = NO;
    self.scrollView.delegate = self;
    self.scrollView.scrollEnabled = self.isScroll;
    [self addSubview:self.scrollView];
}

- (void)layoutSubviews
{
    [self loadData];
}

- (void)loadData
{
    if (_buttonArr.count > 0) {
        for (UIButton *button in _buttonArr) {
            [button removeFromSuperview];
        }
    }
    NSInteger titleNumber = [self.dataSource numberOfPages];
    self.scrollView.contentSize = CGSizeMake(SCREEN_WIDTH * titleNumber, self.scrollView.height);
    NSMutableArray *buttonArrayM = [NSMutableArray arrayWithCapacity:titleNumber];
    for (NSInteger i = 0; i < titleNumber; i++) {
        UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
        CGFloat buttonW = SCREEN_WIDTH / titleNumber;
        CGFloat buttonX = buttonW * i;
        button.frame = CGRectMake(buttonX, 0, buttonW, kButtonHeight);
        NSString *title = [self.dataSource titlePageView:self titleForHeadViewInPage:i];
        [button setTitle:title forState:UIControlStateNormal];
        [button setTitleColor:_titleColor forState:UIControlStateNormal];
        [button setTitleColor:_selectedTitleColor forState:UIControlStateSelected];
        button.titleLabel.font = _titleFont;
        [button addTarget:self action:@selector(titleBtnClick:) forControlEvents:UIControlEventTouchUpInside];
        if (i == self.selectedIndex) {
            button.selected = YES;
        }else{
            button.selected = NO;
        }
        [self.headView addSubview:button];
        [buttonArrayM addObject:button];
    }
    self.buttonArr = [buttonArrayM copy];
    [self creatIndicateLine];
    [self setupScrollViewCurrentSubView];
}

- (void)creatIndicateLine
{
    if (_indicateLine) {
        [_indicateLine removeFromSuperview];
    }
    NSInteger titleNumber = [self.dataSource numberOfPages];
    self.indicateLine = [[UIView alloc] init];
    CGFloat lineW = SCREEN_WIDTH / titleNumber - kInterval * 2;
    CGFloat lineX = lineW * self.selectedIndex + kInterval * 2 * self.selectedIndex + kInterval;
    self.indicateLine.frame = CGRectMake(lineX, kButtonHeight, lineW,kHeadviewHeight - kButtonHeight);
    self.indicateLine.backgroundColor = _indicateLineColor;
    [self.headView addSubview:_indicateLine];
}

- (void)setupScrollViewCurrentSubView
{
    for (UIView *view in self.scrollView.subviews) {
        [view removeFromSuperview];
    }
    
    UIViewController *willShowVc = [self.dataSource containChildViewControllersIntitlePageView:self][self.selectedIndex];
//    if ([willShowVc isViewLoaded]) {
//        return;
//    }
    willShowVc.view.frame = CGRectMake(SCREEN_WIDTH * self.selectedIndex, 0, SCREEN_WIDTH, self.scrollView.height);
    [self.scrollView addSubview:willShowVc.view];
    if (_delegate && [_delegate respondsToSelector:@selector(titlePageView:selectedIndex:)]) {
         [self.delegate titlePageView:self selectedIndex:self.selectedIndex];
    }
}

- (void)titleBtnClick:(UIButton *)btn
{
    if (btn.selected) {
        return;
    }
    for (UIButton *button in self.buttonArr) {
        if (button.selected) {
            button.selected = NO;
        }
    }
    btn.selected = YES;
    
    NSInteger index = [self.buttonArr indexOfObject:btn];
    CGFloat offsetX =  SCREEN_WIDTH * index;
    //[self.scrollView setContentOffset:CGPointMake(offsetX, 0) animated:YES];
    self.scrollView.contentOffset = CGPointMake(offsetX, 0);
    self.selectedIndex = index;
    [self setupScrollViewCurrentSubView];
}


#pragma mark ------ UIScrollViewDelegate代理
- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat offsetX = scrollView.contentOffset.x;
    CGFloat radio = 1.0 / [self.dataSource numberOfPages];
    self.indicateLine.x = offsetX * radio + kInterval;
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
    NSInteger currentIndex = scrollView.contentOffset.x / SCREEN_WIDTH;
    if (self.selectedIndex == currentIndex) {
        return;
    }
    UIButton *previousSelectedBtn = self.buttonArr[self.selectedIndex];
    UIButton *nowSelectedBtn = self.buttonArr[currentIndex];
    previousSelectedBtn.selected = NO;
    nowSelectedBtn.selected = YES;
    self.selectedIndex = currentIndex;
    
    [self setupScrollViewCurrentSubView];
    
}


@end
