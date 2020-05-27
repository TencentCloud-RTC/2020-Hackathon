//
//  TConversationListViewModel.m
//  TXIMSDK_TUIKit_iOS
//
//  Created by annidyfeng on 2019/5/17.
//

#import "TConversationListViewModel.h"
#import "TUILocalStorage.h"
#import "TUIKit.h"
#import "THeader.h"
#import "THelper.h"
#import "ReactiveObjC.h"
#import "UIView+MMLayout.h"
#import "TIMMessage+DataProvider.h"

@import ImSDK;

@interface TConversationListViewModel ()
@property BOOL isLoadFinished;
@property BOOL isLoading;
@property (nonatomic, strong) NSMapTable *missC2CIds;
@property (nonatomic, strong) NSMapTable *missGroupIds;
//会话列表总未读计数
@property (nonatomic, strong) NSNumber *totalUnReadCount;

@end

@implementation TConversationListViewModel

- (instancetype)init
{
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onRefreshNotification:) name:TUIKitNotification_TIMRefreshListener object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onNewMessageNotification:) name:TUIKitNotification_TIMMessageListener object:nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(didTopConversationListChanged:) name:kTopConversationListChangedNotification object:nil];
        self.missC2CIds = [[NSMapTable alloc] init];
        self.missGroupIds = [[NSMapTable alloc] init];

        [self loadConversation];
    }
    return self;
}

- (void)onRefreshNotification:(NSNotification *)no
{
    NSArray *conversations = no.object;

    if (conversations == nil)
        [self loadConversation];
    else
        [self updateConversation:conversations];


    // 统计当前会话的未读计数，并将其以通知形式发送
    int unReadCount = 0;
    NSArray *convs = [[TIMManager sharedInstance] getConversationList];
    for (TIMConversation *conv in convs) {
        if([conv getType] == TIM_SYSTEM){
            continue;
        }
        //过滤掉直播间讨论组
        if (([conv getType] == TIM_GROUP) && ([conv.getGroupName containsString:@"直播间讨论组"])) {
            continue;
        }
        unReadCount += [conv getUnReadMessageNum];
    }
    self.totalUnReadCount = [NSNumber numberWithInteger:unReadCount];
    [[NSNotificationCenter defaultCenter] postNotificationName:TUIKitNotification_onChangeUnReadCount object:self.totalUnReadCount];

}


- (void)onNewMessageNotification:(NSNotification *)no
{
    NSArray<TIMMessage *> *msgs = no.object;
    for (TIMMessage *msg in msgs) {
        for (int i = 0; i < msg.elemCount; i++) {
            TIMElem *e = [msg getElem:i];
            if ([e isKindOfClass:[TIMGroupSystemElem class]]) {
                TIMGroupSystemElem *ge = (TIMGroupSystemElem *)e;
                // 监听退群消息
                if (ge.type == TIM_GROUP_SYSTEM_DELETE_GROUP_TYPE) {
                    TUIConversationCellData *data = [self cellDataOf:ge.group];
                    if (data) {
                        [THelper makeToast:[NSString stringWithFormat:@"%@ 群已解散", data.title]];
                        [self removeData:data];
                    }
                } else if (ge.type == TIM_GROUP_SYSTEM_KICK_OFF_FROM_GROUP_TYPE) {
                    TUIConversationCellData *data = [self cellDataOf:ge.group];
                    if (data) {
                        [THelper makeToast:[NSString stringWithFormat:@"您已被踢出 %@ 群", data.title]];
                        [self removeData:data];
                    }
                } else if (ge.type == TIM_GROUP_SYSTEM_QUIT_GROUP_TYPE) {
                    TUIConversationCellData *data = [self cellDataOf:ge.group];
                    if (data) {
                        [THelper makeToast:[NSString stringWithFormat:@"您已退出 %@ 群", data.title]];
                        [self removeData:data];
                    }
                }
            }
        }
    }
}

- (void)didTopConversationListChanged:(NSNotification *)no
{
    NSMutableArray *dataList = [NSMutableArray arrayWithArray:self.dataList];
    [self sortDataList:dataList];
    self.dataList = dataList;
}

- (TUIConversationCellData *)cellDataOf:(NSString *)convId
{
    for (TUIConversationCellData *data in self.dataList) {
        if ([data.convId isEqualToString:convId]) {
            return data;
        }
    }
    return nil;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)loadConversation
{
    TIMManager *manager = [TIMManager sharedInstance];
    NSArray *convs = [manager getConversationList];

    [self updateConversation:convs];
}

- (void)updateConversation:(NSArray<TIMConversation *> *)convs
{
    NSMutableArray *dataList = [NSMutableArray arrayWithArray:self.dataList];
    for (TIMConversation *conv in convs) {

        TUIConversationCellData *data = [[TUIConversationCellData alloc] init];
        // ----
        NSString *convId = [conv getReceiver];
        data.convId = convId;
        data.convType = [conv getType];

        data.unRead = [conv getUnReadMessageNum];
        data.subTitle = [self getLastDisplayString:conv];
        data.time = [self getLastDisplayDate:conv];

        if (data.subTitle == nil || data.time == nil) {
            [dataList removeObject:data]; // 清理无效的记录
            continue;
        }

        if(data.convType == TIM_C2C){
            TIMUserProfile *user = [[TIMFriendshipManager sharedInstance] queryUserProfile:convId];
            if (user) {
                data.title = [user showName];
                data.avatarUrl = [NSURL URLWithString:user.faceURL];
            } else {
                [self.missC2CIds setObject:data forKey:convId];
            }
            data.avatarImage = DefaultAvatarImage;
        } else if([conv getType] == TIM_GROUP){
            data.avatarImage = DefaultGroupAvatarImage;
            data.title = [conv getGroupName];

            TIMGroupInfo *groupInfo = [[TIMGroupManager sharedInstance] queryGroupInfo:convId];
            if (groupInfo) {
                data.avatarUrl = [NSURL URLWithString:groupInfo.faceURL];
            } else {
                [self.missGroupIds setObject:data forKey:convId];
            }
        }

        if (self.listFilter) {
            if (!self.listFilter(data))
                continue;
        }

        NSInteger existIdx = [dataList indexOfObject:data];

        if (existIdx != NSNotFound) {
            dataList[existIdx] = data;
        } else {
            [dataList addObject:data];
        }
    }
    [self fixMissIds];
    [self sortDataList:dataList];
    self.dataList = dataList;
}


- (void)sortDataList:(NSMutableArray<TUIConversationCellData *> *)dataList
{
    // 按时间排序，最近会话在上
    [dataList sortUsingComparator:^NSComparisonResult(TUIConversationCellData *obj1, TUIConversationCellData *obj2) {
        return [obj2.time compare:obj1.time];
    }];

    // 将置顶会话固定在最上面
    NSArray *topList = [[TUILocalStorage sharedInstance] topConversationList];
    int existTopListSize = 0;
    for (NSString *userId in topList) {
        int userIdx = -1;
        for (int i = 0; i < dataList.count; i++) {
            if ([dataList[i].convId isEqualToString:userId]) {
                userIdx = i;
                dataList[i].isOnTop = YES;
                break;
            }
        }
        if (userIdx >= 0 && userIdx != existTopListSize) {
            TUIConversationCellData *data = dataList[userIdx];
            [dataList removeObjectAtIndex:userIdx];
            [dataList insertObject:data atIndex:existTopListSize];
            existTopListSize++;
        }
    }
}

- (void)fixMissIds
{

    @weakify(self)
    NSArray *ids = [self.missC2CIds keyEnumerator].allObjects;

    if (ids.count > 0) {
        [[TIMFriendshipManager sharedInstance] getUsersProfile:[self.missC2CIds keyEnumerator].allObjects forceUpdate:YES succ:^(NSArray<TIMUserProfile *> *profiles) {
            @strongify(self)
            for (TIMUserProfile *pf in profiles) {
                TUIConversationCellData *data = [self.missC2CIds objectForKey:pf.identifier];
                if (data) {
                    data.title = [pf showName];
                    data.avatarUrl = [NSURL URLWithString:pf.faceURL];
                }
                [self.missC2CIds removeObjectForKey:pf.identifier];
            }
        } fail:nil];
    }

    ids = [self.missGroupIds keyEnumerator].allObjects;
    if (ids.count > 0) {
        [[TIMGroupManager sharedInstance] getGroupInfo:ids succ:^(NSArray<TIMGroupInfoResult *> *arr) {
            @strongify(self)
            for (TIMGroupInfoResult *gf in arr) {
                TUIConversationCellData *data = [self.missGroupIds objectForKey:gf.group];
                if (data) {
                    data.avatarUrl = [NSURL URLWithString:gf.faceURL];
                }
                [self.missGroupIds removeObjectForKey:gf.group];
            }
        } fail:nil];
    }
}

- (void)removeData:(TUIConversationCellData *)data
{
    NSMutableArray *list = [NSMutableArray arrayWithArray:self.dataList];
    [list removeObject:data];
    self.dataList = list;
    [[TIMManager sharedInstance] deleteConversation:data.convType receiver:data.convId];
}

- (NSString *)getLastDisplayString:(TIMConversation *)conv
{
    NSString *str = @"";
    TIMMessageDraft *draft = [conv getDraft];
    if(draft){
        for (int i = 0; i < draft.elemCount; ++i) {
            TIMElem *elem = [draft getElem:i];
            if([elem isKindOfClass:[TIMTextElem class]]){
                TIMTextElem *text = (TIMTextElem *)elem;
                str = [NSString stringWithFormat:@"[草稿]%@", text.text];
                break;
            }
            else{
                continue;
            }
        }
        return str;
    }

    TIMMessage *msg = [conv getLastMsg];
    str = [msg getDisplayString];
    return str;
}

- (NSDate *)getLastDisplayDate:(TIMConversation *)conv
{
    TIMMessage *msg = [conv getLastMsg];
    if (msg) {
        return msg.timestamp;
    }
    TIMMessageDraft *draft = [conv getDraft];
    if(draft){
        return draft.timestamp;
    }
    return [NSDate distantPast];
}
@end
