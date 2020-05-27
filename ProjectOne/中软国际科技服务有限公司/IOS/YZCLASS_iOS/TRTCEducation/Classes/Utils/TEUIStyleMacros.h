//
//  ZYUIStyleMacros.h
//  ZhiYunEducation
//
//  Created by caijunlai on 2019/12/24.
//  Copyright © 2019 caijunlai. All rights reserved.
//

#ifndef TEUIStyleMacros_h
#define TEUIStyleMacros_h

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height

#define KEYWINDOW [UIApplication sharedApplication].keyWindow

#define IS_IPHONEX_SERIES \
({BOOL iPhoneX_Series = NO;\
if (@available(iOS 11.0, *)){\
iPhoneX_Series = [[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0;\
}\
(iPhoneX_Series);})

#define STATUSBAR_HEIGHE (IS_IPHONEX_SERIES? 44.0 : 20.0)
#define NAVIGATIONBAR_HEIGHT 44.0
#define TABBAR_HEIGHT (IS_IPHONEX_SERIES? (49.0 + 34.0) : 49.0)
#define TABBAR_SAFEBOTTOM_MARGIN (IS_IPHONEX_SERIES? 34.0 : 0.0)
#define STATUSBAR_NAVIGATIONBAR_HEIGHT (IS_IPHONEX_SERIES? 88.0 : 64.0)
#define VIEW_NORMAL_HEIGHT (SCREEN_HEIGHT - STATUSBAR_NAVIGATIONBAR_HEIGHT - TABBAR_SAFEBOTTOM_MARGIN)
#define TABBAR_VIEW_NORMAL_HEIGHT (SCREEN_HEIGHT - STATUSBAR_NAVIGATIONBAR_HEIGHT - TABBAR_HEIGHT)
//宽高比例以iPhone 6s屏幕大小为准
#define WIDTH_SCALE [UIScreen mainScreen].bounds.size.width/375
#define HEIGHT_SCALE (IS_IPHONEX_SERIES? 1.0 :  [UIScreen mainScreen].bounds.size.height/667)

#define RGB(r, g, b) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1.0]
#define RGBA(r, g, b, a) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:a]
#define HEX(color) [TEUtilFunction colorWithHexString:color]

#define MAIN_TEXT_SIZE [UIFont systemFontOfSize:14]

#define IS_IPHONE (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone)
#define IS_PAD (UI_USER_INTERFACE_IDIOM()== UIUserInterfaceIdiomPad)

#endif /* TEUIStyleMacros_h */
