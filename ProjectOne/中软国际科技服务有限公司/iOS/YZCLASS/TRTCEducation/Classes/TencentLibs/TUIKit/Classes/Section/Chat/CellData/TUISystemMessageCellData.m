//
//  TUISystemMessageCellData.m
//  TXIMSDK_TUIKit_iOS
//
//  Created by annidyfeng on 2019/5/21.
//

#import "TUISystemMessageCellData.h"
#import "NSString+TUICommon.h"
#import "THeader.h"

@implementation TUISystemMessageCellData

- (instancetype)initWithDirection:(TMsgDirection)direction
{
    self = [super initWithDirection:direction];
    if (self) {
        _contentFont = [UIFont systemFontOfSize:12];
        _contentColor = [UIColor whiteColor];
        self.cellLayout =  [TUIMessageCellLayout systemMessageLayout];
    }
    return self;
}

- (CGSize)contentSize
{
    CGSize size = [self.content textSizeIn:CGSizeMake(TSystemMessageCell_Text_Width_Max, MAXFLOAT) font:self.contentFont];
    size.height += 10;
    size.width += 16;
    return size;
}

- (CGFloat)heightOfWidth:(CGFloat)width
{
    return [self contentSize].height + 16;
}
@end
