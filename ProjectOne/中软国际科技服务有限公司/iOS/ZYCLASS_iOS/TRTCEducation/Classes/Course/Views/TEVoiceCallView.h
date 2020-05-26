//
//  TEVoiceCallView.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/12.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol TEVoiceCallViewDelegate <NSObject>

- (void)cancelBtnDidClick;

- (void)exitBtnDidClick;

@end

NS_ASSUME_NONNULL_BEGIN

@interface TEVoiceCallView : UIView
@property (weak, nonatomic) IBOutlet UIImageView *headerImageView;
@property (weak, nonatomic) IBOutlet UILabel *tipsLabel;
@property (weak, nonatomic) IBOutlet UIButton *confirmBtn;

@property (nonatomic,weak) id<TEVoiceCallViewDelegate> delegate;
@end

NS_ASSUME_NONNULL_END
