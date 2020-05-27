//
//  TECourseListCell.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TECourseListCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UIImageView *coverImageView;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UIView *liveView;

@end

NS_ASSUME_NONNULL_END
