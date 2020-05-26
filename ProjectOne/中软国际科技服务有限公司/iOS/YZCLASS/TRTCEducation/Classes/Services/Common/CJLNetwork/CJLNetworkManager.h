//
//  CJLNetworkManager.h
//  iOS_SDK高级特性剖析
//
//  Created by caijunlai on 2019/11/26.
//  Copyright © 2019 Chinasoft. All rights reserved.
//

#import <Foundation/Foundation.h>
@class CJLRequest;

NS_ASSUME_NONNULL_BEGIN



@interface CJLNetworkManager : NSObject

- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

+ (CJLNetworkManager *)sharedNetworkManager;


- (void)addRequest:(CJLRequest *)request;

- (void)cancelRequest:(CJLRequest *)request;

- (void)cancelAllRequests;

@end

NS_ASSUME_NONNULL_END
