//
//  TETitlePageView.h
//  ZhiYunEducation
//
//  Created by caijunlai on 2019/12/28.
//  Copyright © 2019 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@class TETitlePageView;
@protocol TETitlePageViewDataSource <NSObject>
@required
- (NSInteger)numberOfPages;
- (NSString *)titlePageView:(TETitlePageView *)titlePageView titleForHeadViewInPage:(NSInteger)pageIndex;
- (NSArray<UIViewController *> *)containChildViewControllersIntitlePageView:(TETitlePageView *)titlePageView;

@end

@protocol TETitlePageViewDelegate <NSObject>
- (void)titlePageView:(TETitlePageView *)titlePageView selectedIndex:(NSInteger)index;

@end
@interface TETitlePageView : UIView
/** 标题大小 */
@property (nonatomic,strong) UIFont *titleFont;
/** 标题颜色 */
@property (nonatomic,strong) UIColor *titleColor;
/** 选中标题颜色 */
@property (nonatomic,strong) UIColor *selectedTitleColor;
/** 指示线颜色 */
@property (nonatomic,strong) UIColor *indicateLineColor;
/** 当前选中的标题索引 */
@property (nonatomic,assign) NSInteger selectedIndex;
/** 是否可以滚动切换 */
@property (nonatomic,assign) BOOL isScroll;

/** 数据源代理 */
@property (nonatomic,weak) id<TETitlePageViewDataSource> dataSource;
@property (nonatomic,weak) id<TETitlePageViewDelegate> delegate;
@end

NS_ASSUME_NONNULL_END
