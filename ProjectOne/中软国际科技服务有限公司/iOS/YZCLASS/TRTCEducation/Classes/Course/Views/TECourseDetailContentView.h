//
//  TECourseDetailContentView.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TECourseDetailContentView : UIView<UICollectionViewDataSource,UICollectionViewDelegate>
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;

@property (weak, nonatomic) IBOutlet UIImageView *leftImageView;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UICollectionView *collectionView;

/** 数据 */
@property (nonatomic,strong) NSArray *onlineMemberList;
@end

NS_ASSUME_NONNULL_END
