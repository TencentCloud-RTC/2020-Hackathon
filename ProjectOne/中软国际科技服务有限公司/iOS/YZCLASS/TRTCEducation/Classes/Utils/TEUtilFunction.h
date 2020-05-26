//
//  TEUtilFunction.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TEUtilFunction : NSObject
//十六进制转颜色
+ (UIColor *)colorWithHexString:(NSString *)stringToConvert;
+ (UIColor *)colorWithHexString:(NSString *)stringToConvert andWithAlpha:(CGFloat)alpha;

+ (CAGradientLayer *)setGradualChangingColor:(UIView *)view fromColor:(NSString *)fromHexColorStr toColor:(NSString *)toHexColorStr;

+ (CAGradientLayer *)setGradualChangingColorFromCenter:(UIView *)view fromColor:(NSString *)fromHexColorStr toColor:(NSString *)toHexColorStr;
//根据颜色生成图片
+ (UIImage*)imageWithColor:(UIColor*)color;
@end

NS_ASSUME_NONNULL_END
