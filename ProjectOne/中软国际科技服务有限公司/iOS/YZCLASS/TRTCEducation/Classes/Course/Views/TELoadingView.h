//
//  TELoadingView.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TELoadingView : UIView

@property (nonatomic,strong) UIImageView *imageView;
@property (nonatomic,strong) UILabel *label;

- (void)startLoading;

- (void)stopLoading;

@end

NS_ASSUME_NONNULL_END
