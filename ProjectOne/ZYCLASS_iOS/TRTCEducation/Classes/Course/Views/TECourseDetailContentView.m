//
//  TECourseDetailContentView.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TECourseDetailContentView.h"
#import "TEMemberModel.h"

#import "TEOnlineMemberCell.h"
#import "UIImageView+WebCache.h"

@implementation TECourseDetailContentView

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return self.onlineMemberList.count;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    TEOnlineMemberCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"onlineMemberCell" forIndexPath:indexPath];
    cell.headerImageView.layer.cornerRadius = 20;
    cell.headerImageView.layer.masksToBounds = YES;
    TEOnlineVoiceMemberModel *model = self.onlineMemberList[indexPath.item];
    
    [cell.headerImageView sd_setImageWithURL:[NSURL URLWithString:model.headFileUrl] placeholderImage:[UIImage imageNamed:@"placeholder_icon"]];
    return cell;
}

@end
