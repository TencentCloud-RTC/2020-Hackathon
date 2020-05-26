//
//  TEVoiceCallView.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/12.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TEVoiceCallView.h"

@implementation TEVoiceCallView

- (IBAction)cancelBtnClick:(id)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(cancelBtnDidClick)]) {
        [self.delegate cancelBtnDidClick];
    }
    
}

- (IBAction)exitBtnClick:(id)sender {
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(exitBtnDidClick)]) {
        [self.delegate exitBtnDidClick];
    }
}

@end
