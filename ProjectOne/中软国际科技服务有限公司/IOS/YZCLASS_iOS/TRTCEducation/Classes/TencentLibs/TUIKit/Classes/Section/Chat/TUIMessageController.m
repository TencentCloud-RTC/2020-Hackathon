//
//  TUIMessageController.m
//  UIKit
//
//  Created by annidyfeng on 2019/7/1.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import "TUIMessageController.h"
#import "TUITextMessageCell.h"
#import "TUISystemMessageCell.h"
#import "TUIVoiceMessageCell.h"
#import "TUIImageMessageCell.h"
#import "TUIFaceMessageCell.h"
#import "TUIVideoMessageCell.h"
#import "TUIFileMessageCell.h"
#import "TUIJoinGroupMessageCell.h"
#import "TUIKitConfig.h"
#import "TUIFaceView.h"
#import "THeader.h"
#import "TUIKit.h"
#import "THelper.h"
#import "TUIConversationCellData.h"
#import "TIMMessage+DataProvider.h"
#import "TUIImageViewController.h"
#import "TUIVideoViewController.h"
#import "TUIFileViewController.h"
#import "TUIConversationDataProviderService.h"
#import "NSString+TUICommon.h"
#import "ReactiveObjC.h"
#import "UIView+MMLayout.h"
#import "TIMMessage+DataProvider.h"
#import "TUIUserProfileControllerServiceProtocol.h"
#import <ImSDK/ImSDK.h>

#import <ImSDK/TIMFriendshipManager.h>
#import "UIView+MMLayout.h"
#define MAX_MESSAGE_SEP_DLAY (5 * 60)

@interface TUIMessageController () <TIMMessageListener, TMessageCellDelegate>
@property (nonatomic, strong) TIMConversation *conv;
@property (nonatomic, strong) NSMutableArray *uiMsgs;
@property (nonatomic, strong) NSMutableArray *heightCache;
@property (nonatomic, strong) TIMMessage *msgForDate;
@property (nonatomic, strong) TIMMessage *msgForGet;
@property (nonatomic, strong) TUIMessageCellData *menuUIMsg;
@property (nonatomic, strong) TUIMessageCellData *reSendUIMsg;
@property (nonatomic, strong) UIActivityIndicatorView *indicatorView;
@property (nonatomic, assign) BOOL isScrollBottom;
@property (nonatomic, assign) BOOL isLoadingMsg;
@property (nonatomic, assign) BOOL isInVC;
@property (nonatomic, assign) BOOL isActive;
@property (nonatomic, assign) BOOL noMoreMsg;
@property (nonatomic, assign) BOOL firstLoad;
@property id<TUIConversationDataProviderServiceProtocol> conversationDataProviderService;
@end

@implementation TUIMessageController

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self setupViews];
    self.isActive = YES;
}


- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated
{
    self.isInVC = YES;
    [self readedReport];
    [super viewWillAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.isInVC = NO;
    [self readedReport];
    [super viewWillDisappear:animated];
}

- (void)readedReport
{
    if (self.isInVC && self.isActive) {
        [self.conv setReadMessage:nil succ:nil fail:^(int code, NSString *msg) {
            
        }];
    }
}

- (void)applicationBecomeActive
{
    self.isActive = YES;
    [self readedReport];
}

- (void)applicationEnterBackground
{
    self.isActive = NO;
}

- (void)setupViews
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationEnterBackground) name: UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onNewMessage:) name:TUIKitNotification_TIMMessageListener object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onRevokeMessage:) name:TUIKitNotification_TIMMessageRevokeListener object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onUploadMessage:) name:TUIKitNotification_TIMUploadProgressListener object:nil];
     [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didRecvMessageReceipts:) name:TUIKitNotification_onRecvMessageReceipts object:nil];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didTapViewController)];
    [self.view addGestureRecognizer:tap];
    self.tableView.estimatedRowHeight = 0;
    [self.tableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
    self.tableView.backgroundColor = TMessageController_Background_Color;

    [self.tableView registerClass:[TUITextMessageCell class] forCellReuseIdentifier:TTextMessageCell_ReuseId];
    [self.tableView registerClass:[TUIVoiceMessageCell class] forCellReuseIdentifier:TVoiceMessageCell_ReuseId];
    [self.tableView registerClass:[TUIImageMessageCell class] forCellReuseIdentifier:TImageMessageCell_ReuseId];
    [self.tableView registerClass:[TUISystemMessageCell class] forCellReuseIdentifier:TSystemMessageCell_ReuseId];
    [self.tableView registerClass:[TUIFaceMessageCell class] forCellReuseIdentifier:TFaceMessageCell_ReuseId];
    [self.tableView registerClass:[TUIVideoMessageCell class] forCellReuseIdentifier:TVideoMessageCell_ReuseId];
    [self.tableView registerClass:[TUIFileMessageCell class] forCellReuseIdentifier:TFileMessageCell_ReuseId];
    [self.tableView registerClass:[TUIJoinGroupMessageCell class] forCellReuseIdentifier:TJoinGroupMessageCell_ReuseId];


    _indicatorView = [[UIActivityIndicatorView alloc] initWithFrame:CGRectMake(0, 0, self.tableView.frame.size.width, TMessageController_Header_Height)];
    _indicatorView.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    self.tableView.tableHeaderView = _indicatorView;

    _heightCache = [NSMutableArray array];
    _uiMsgs = [[NSMutableArray alloc] init];
    _firstLoad = YES;
}

- (void)setConversation:(TIMConversation *)conversation
{
    _conv = conversation;

    self.conversationDataProviderService = [[TCServiceManager shareInstance] createService:@protocol(TUIConversationDataProviderServiceProtocol)];
    [self loadMessage];
}

- (void)loadMessage
{
    if(_isLoadingMsg || _noMoreMsg){
        return;
    }
    _isLoadingMsg = YES;
    int msgCount = 20;

    @weakify(self)
    [self.conversationDataProviderService getMessage:self.conv count:msgCount last:_msgForGet succ:^(NSArray *msgs) {
        @strongify(self)
        if(msgs.count != 0){
            self.msgForGet = msgs[msgs.count - 1];
        }
        NSMutableArray *uiMsgs = [self transUIMsgFromIMMsg:msgs];
        dispatch_async(dispatch_get_main_queue(), ^{
            if(msgs.count < msgCount){
                self.noMoreMsg = YES;
                self.indicatorView.mm_h = 0;
            }
            if(uiMsgs.count != 0){
                NSIndexSet *indexSet = [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, uiMsgs.count)];
                [self.uiMsgs insertObjects:uiMsgs atIndexes:indexSet];
                [self.heightCache removeAllObjects];
                [self.tableView reloadData];
                [self.tableView layoutIfNeeded];
                if(!self.firstLoad){
                    CGFloat visibleHeight = 0;
                    for (NSInteger i = 0; i < uiMsgs.count; ++i) {
                        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:i inSection:0];
                        visibleHeight += [self tableView:self.tableView heightForRowAtIndexPath:indexPath];
                    }
                    if(self.noMoreMsg){
                        visibleHeight -= TMessageController_Header_Height;
                    }
                    [self.tableView scrollRectToVisible:CGRectMake(0, self.tableView.contentOffset.y + visibleHeight, self.tableView.frame.size.width, self.tableView.frame.size.height) animated:NO];
                }
            }
            self.isLoadingMsg = NO;
            [self.indicatorView stopAnimating];
            self.firstLoad = NO;
        });
    } fail:^(int code, NSString *msg) {
        @strongify(self)
        self.isLoadingMsg = NO;
        [THelper makeToastError:code msg:msg];
    }];
}

- (void)onNewMessage:(NSNotification *)notification
{
    NSArray *msgs = notification.object;
    NSMutableArray *uiMsgs = [self transUIMsgFromIMMsg:msgs];
    if (uiMsgs.count > 0) {
        //生成需要插入的 index。即行号从 _uiMsgs.count - 1到 _uiMsgs.count + uiMsgs.count +1。 section 恒为 0。
        [self.tableView beginUpdates];
        for(TUIMessageCellData *data in uiMsgs){
            [_uiMsgs addObject:data];
            //此处在对应的 indexPath 处插入 cell，并由数据源委托提供对应数据。从而达到接受新消息时进插入新消息，而无需 reload 整个tableView
            [self.tableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_uiMsgs.count - 1 inSection:0]]//indexArray
                                  withRowAnimation:UITableViewRowAnimationFade];
        }
        [self.tableView endUpdates];
        [self scrollToBottom:YES];
        [self readedReport];
    }
}

- (void)onRevokeMessage:(NSNotification *)notification
{
    TIMMessageLocator *locator = notification.object;
    TUIMessageCellData *uiMsg = nil;
    for (uiMsg in _uiMsgs) {
        TIMMessage *imMsg = uiMsg.innerMessage;
        if(imMsg){
            if([imMsg respondsToLocator:locator]){
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self revokeMsg:uiMsg];
                });
                break;
            }
        }
    }
}

- (void)onUploadMessage:(NSNotification *)notification
{
    NSDictionary *dic = notification.object;
    TIMMessage *msg = [dic objectForKey:@"message"];
    NSNumber *progress = [dic objectForKey:@"progress"];
    for (NSInteger i = 0; i < _uiMsgs.count; ++i) {
        TUIMessageCellData *uiMsg = _uiMsgs[i];
        TIMMessage *imMsg = uiMsg.innerMessage;
        if(imMsg){
            if([imMsg respondsToLocator:[msg locator]]){
                if([uiMsg isKindOfClass:[TUIImageMessageCellData class]]){
                    TUIImageMessageCellData *data = (TUIImageMessageCellData *)uiMsg;
                    data.uploadProgress = progress.intValue;
                }
                else if([uiMsg isKindOfClass:[TUIVideoMessageCellData class]]){
                    TUIVideoMessageCellData *data = (TUIVideoMessageCellData *)uiMsg;
                    data.uploadProgress = progress.intValue;
                }
                else if([uiMsg isKindOfClass:[TUIFileMessageCellData class]]){
                    TUIFileMessageCellData *data = (TUIFileMessageCellData *)uiMsg;
                    data.uploadProgress = progress.intValue;
                }
            }
        }
    }
}

- (NSMutableArray *)transUIMsgFromIMMsg:(NSArray *)msgs
{
    NSMutableArray *uiMsgs = [NSMutableArray array];
    for (NSInteger k = msgs.count - 1; k >= 0; --k) {
        TIMMessage *msg = msgs[k];
        if(msg.status == TIM_MSG_STATUS_HAS_DELETED){
            continue;
        }

        //判断有没要展示的 elem
        bool hasShowElem = false;
        for (int i = 0; i < msg.elemCount; ++i) {
            TIMElem *elem = [msg getElem:i];
            if ([elem isKindOfClass:[TIMSNSSystemElem class]] || [elem isKindOfClass:[TIMProfileSystemElem class]]) {
                //资料关系链消息不往列表里面抛
                continue;
            }
            if ([elem isKindOfClass:[TIMGroupTipsElem class]]) {
                TIMGroupTipsElem *gt = (TIMGroupTipsElem *)elem;
                if (![[gt group] isEqualToString:[_conv getReceiver]]) {
                    continue;
                }
            } else if ([elem isKindOfClass:[TIMGroupSystemElem class]]) {
                TIMGroupSystemElem *gs = (TIMGroupSystemElem *)elem;
                if (![[gs group] isEqualToString:[_conv getReceiver]]) {
                    continue;
                }
            } else if(![[[msg getConversation] getReceiver] isEqualToString:[_conv getReceiver]]){
                continue;
            }
            hasShowElem =true;
        }
        if (!hasShowElem) {
            continue;
        }

        TUISystemMessageCellData *dateMsg = [self transSystemMsgFromDate:msg.timestamp];
        if (dateMsg) {
            _msgForDate = msg;
            [uiMsgs addObject:dateMsg];
        }
        if(msg.status == TIM_MSG_STATUS_LOCAL_REVOKED){
            TUISystemMessageCellData *revoke = [msg revokeCellData];
            if(revoke)
                [uiMsgs addObject:revoke];
            continue;
        }
        if ([self.delegate respondsToSelector:@selector(messageController:onNewMessage:)]) {
            TUIMessageCellData *data = [self.delegate messageController:self onNewMessage:msg];
            if (data) {
                [uiMsgs addObject:data];
                continue;
            }
        }
        for (int i = 0; i < msg.elemCount; ++i) {
            TIMElem *elem = [msg getElem:i];
            if ([elem isKindOfClass:[TIMSNSSystemElem class]] || [elem isKindOfClass:[TIMProfileSystemElem class]]) {
                //资料关系链消息不往列表里面抛
                continue;
            }
            //目前此处已经实现了一步到位，但为了暂时的查阅方便，仍保留了其判断逻辑，
            TUIMessageCellData *data = nil;
            if([elem isKindOfClass:[TIMTextElem class]] || [elem isKindOfClass:[TIMFaceElem class]] || [elem isKindOfClass:[TIMImageElem class]] || [elem isKindOfClass:[TIMSoundElem class]] || [elem isKindOfClass:[TIMVideoElem class]] || [elem isKindOfClass:[TIMFileElem class]]){
                data = [msg cellDataFromElem:elem];
            } else if ([elem isKindOfClass:[TIMCustomElem class]]) {
                data = [msg cellDataFromElem:elem];
            } else {
                data = [msg cellDataFromElem:elem];
            }
            if([[msg getConversation] getType] == TIM_GROUP && !msg.isSelf
               && ![data isKindOfClass:[TUISystemMessageCellData class]]){
                data.showName = YES;
            }
            if(data) {
                data.direction = msg.isSelf ? MsgDirectionOutgoing : MsgDirectionIncoming;
                data.identifier = [msg sender];
                //由于拉取名称的过程，可能收到异步/网络等因素的影响，所以在此处现将 userID 设为 userName，防止出现昵称为空的情况。
                data.name = data.identifier;
                
                void (^block)(TIMUserProfile *) = ^(TIMUserProfile *profile)  {
                    if([[msg getConversation] getType] == TIM_GROUP){
                        //如果是群组消息，优先拉取群名片
                        data.name = [msg getSenderGroupMemberProfile].nameCard;
                    }
                    //更新 profile
                    NSString *showName = [profile showName];
                    if (showName.length > 0)
                        data.name = showName;
                    if (profile.faceURL)
                        data.avatarUrl = [NSURL URLWithString:[profile faceURL]];
                };
                
                [msg getSenderProfile:block];
                //此处改为 群名片>昵称>ID。当高优先级为空时在使用低优先级变量。
                //TIMUserProfile *userProfile = [[TIMFriendshipManager sharedInstance] queryUserProfile:msg.sender];
                //data.name = nameCard.length ? nameCard : userProfile.showName;
                switch (msg.status) {
                    case TIM_MSG_STATUS_SEND_SUCC:
                        data.status = Msg_Status_Succ;
                        break;
                    case TIM_MSG_STATUS_SEND_FAIL:
                        data.status = Msg_Status_Fail;
                        break;
                    case TIM_MSG_STATUS_SENDING:
                        data.status = Msg_Status_Sending_2;
                        break;
                    default:
                        break;
                }
                [uiMsgs addObject:data];
                data.innerMessage = msg;
            }
        }
    }
    return uiMsgs;
}

#pragma mark - Table view data source

-(void) tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath{
    if (_isScrollBottom == NO) {
        [self scrollToBottom:NO];
        if (indexPath.row == _uiMsgs.count-1) {
            _isScrollBottom = YES;
        }
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return _uiMsgs.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat height = 0;
    if(_heightCache.count > indexPath.row){
        return [_heightCache[indexPath.row] floatValue];
    }
    TUIMessageCellData *data = _uiMsgs[indexPath.row];
    height = [data heightOfWidth:Screen_Width];
    [_heightCache insertObject:[NSNumber numberWithFloat:height] atIndex:indexPath.row];
    return height;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    TUIMessageCellData *data = _uiMsgs[indexPath.row];
    TUIMessageCell *cell = nil;
    if ([self.delegate respondsToSelector:@selector(messageController:onShowMessageData:)]) {
        cell = [self.delegate messageController:self onShowMessageData:data];
        if (cell) {
            cell.delegate = self;
            return cell;
        }
    }
    if (!data.reuseId) {
        if([data isKindOfClass:[TUITextMessageCellData class]]) {
            data.reuseId = TTextMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIFaceMessageCellData class]]) {
            data.reuseId = TFaceMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIImageMessageCellData class]]) {
            data.reuseId = TImageMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIVideoMessageCellData class]]) {
            data.reuseId = TVideoMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIVoiceMessageCellData class]]) {
            data.reuseId = TVoiceMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIFileMessageCellData class]]) {
            data.reuseId = TFileMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUIJoinGroupMessageCellData class]]){//入群小灰条对应的数据源
            data.reuseId = TJoinGroupMessageCell_ReuseId;
        }
        else if([data isKindOfClass:[TUISystemMessageCellData class]]) {
            data.reuseId = TSystemMessageCell_ReuseId;
        } else {
            return nil;
        }
    }
    cell = [tableView dequeueReusableCellWithIdentifier:data.reuseId forIndexPath:indexPath];
    //对于入群小灰条，需要进一步设置其委托。
    if([cell isKindOfClass:[TUIJoinGroupMessageCell class]]){
        TUIJoinGroupMessageCell *joinCell = (TUIJoinGroupMessageCell *)cell;
        joinCell.joinGroupDelegate = self;
        cell = joinCell;
    }
    cell.delegate = self;
    [cell fillWithData:_uiMsgs[indexPath.row]];

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
}

- (void)scrollToBottom:(BOOL)animate
{
    if (_uiMsgs.count > 0) {
        [self.tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_uiMsgs.count - 1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:animate];
    }
}

- (void)didTapViewController
{
    if(_delegate && [_delegate respondsToSelector:@selector(didTapInMessageController:)]){
        [_delegate didTapInMessageController:self];
    }
}

- (void)sendMessage:(TUIMessageCellData *)msg
{
    //自己添加，非好友消息发送失败
    if ([self.conv getType] == TIM_C2C) {
        TIMFriend *friend = [[TIMFriendshipManager sharedInstance] queryFriend:[self.conv getReceiver]];
        if (friend == nil) {
            UIAlertController *ac = [UIAlertController alertControllerWithTitle:@"您还未添加好友，无法发送消息！" message:nil preferredStyle:UIAlertControllerStyleAlert];
            [ac addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil]];
            [self presentViewController:ac animated:YES completion:nil];
            return;
        }
    }
    
    [self.tableView beginUpdates];
    TIMMessage *imMsg = msg.innerMessage;
    TUIMessageCellData *dateMsg = nil;
    if (msg.status == Msg_Status_Init)
    {
        //新消息
        if (!imMsg) {
            imMsg = [self transIMMsgFromUIMsg:msg];
        }
        dateMsg = [self transSystemMsgFromDate:imMsg.timestamp];

    } else if (imMsg) {
        //重发
        dateMsg = [self transSystemMsgFromDate:[NSDate date]];
        NSInteger row = [_uiMsgs indexOfObject:msg];
        [_heightCache removeObjectAtIndex:row];
        [_uiMsgs removeObjectAtIndex:row];
        [self.tableView deleteRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:row inSection:0]]
                              withRowAnimation:UITableViewRowAnimationFade];
    } else {
        [self.tableView endUpdates];
        NSLog(@"Unknown message state");
        return;
    }
    TIMUserProfile *selfProfile = [[TIMFriendshipManager sharedInstance] querySelfProfile];

    msg.status = Msg_Status_Sending;
    msg.name = [selfProfile showName];
    msg.avatarUrl = [NSURL URLWithString:selfProfile.faceURL];

    if(dateMsg){
        _msgForDate = imMsg;
        [_uiMsgs addObject:dateMsg];
        [self.tableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_uiMsgs.count - 1 inSection:0]]
                              withRowAnimation:UITableViewRowAnimationFade];
    }
    [_uiMsgs addObject:msg];
    [self.tableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_uiMsgs.count - 1 inSection:0]]
                          withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
    [self scrollToBottom:YES];

    __weak typeof(self) ws = self;
    [self.conv sendMessage:imMsg succ:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [ws changeMsg:msg status:Msg_Status_Succ];
        });
    } fail:^(int code, NSString *desc) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [THelper makeToastError:code msg:desc];
            [ws changeMsg:msg status:Msg_Status_Fail];
        });
    }];

    int delay = 1;
    if([msg isKindOfClass:[TUIImageMessageCellData class]]){
        delay = 0;
    }
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if(msg.status == Msg_Status_Sending){
            [ws changeMsg:msg status:Msg_Status_Sending_2];
        }
    });
}

- (void)changeMsg:(TUIMessageCellData *)msg status:(TMsgStatus)status
{
    msg.status = status;
    NSInteger index = [_uiMsgs indexOfObject:msg];
    TUIMessageCell *cell = [self.tableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0]];
    [cell fillWithData:msg];
}

- (TIMMessage *)transIMMsgFromUIMsg:(TUIMessageCellData *)data
{
    TIMMessage *msg = [[TIMMessage alloc] init];
    if([data isKindOfClass:[TUITextMessageCellData class]]){
        TIMTextElem *imText = [[TIMTextElem alloc] init];
        TUITextMessageCellData *text = (TUITextMessageCellData *)data;
        imText.text = text.content;
        [msg addElem:imText];
    }
    else if([data isKindOfClass:[TUIFaceMessageCellData class]]){
        TIMFaceElem *imImage = [[TIMFaceElem alloc] init];
        TUIFaceMessageCellData *image = (TUIFaceMessageCellData *)data;
        imImage.index = (int)image.groupIndex;
        imImage.data = [image.faceName dataUsingEncoding:NSUTF8StringEncoding];
        [msg addElem:imImage];
    }
    else if([data isKindOfClass:[TUIImageMessageCellData class]]){
        TIMImageElem *imImage = [[TIMImageElem alloc] init];
        TUIImageMessageCellData *uiImage = (TUIImageMessageCellData *)data;
        imImage.path = uiImage.path;
        [msg addElem:imImage];
    }
    else if([data isKindOfClass:[TUIVideoMessageCellData class]]){
        TIMVideoElem *imVideo = [[TIMVideoElem alloc] init];
        TUIVideoMessageCellData *uiVideo = (TUIVideoMessageCellData *)data;
        imVideo.videoPath = uiVideo.videoPath;
        imVideo.snapshotPath = uiVideo.snapshotPath;
        imVideo.snapshot = [[TIMSnapshot alloc] init];
        imVideo.snapshot.width = uiVideo.snapshotItem.size.width;
        imVideo.snapshot.height = uiVideo.snapshotItem.size.height;
        imVideo.video = [[TIMVideo alloc] init];
        imVideo.video.duration = (int)uiVideo.videoItem.duration;
        imVideo.video.type = uiVideo.videoItem.type;
        [msg addElem:imVideo];
    }
    else if([data isKindOfClass:[TUIVoiceMessageCellData class]]){
        TIMSoundElem *imSound = [[TIMSoundElem alloc] init];
        TUIVoiceMessageCellData *uiSound = (TUIVoiceMessageCellData *)data;
        imSound.path = uiSound.path;
        imSound.second = uiSound.duration;
        imSound.dataSize = uiSound.length;
        [msg addElem:imSound];
    }
    else if([data isKindOfClass:[TUIFileMessageCellData class]]){
        TIMFileElem *imFile = [[TIMFileElem alloc] init];
        TUIFileMessageCellData *uiFile = (TUIFileMessageCellData *)data;
        imFile.path = uiFile.path;
        imFile.fileSize = uiFile.length;
        imFile.filename = uiFile.fileName;
        [msg addElem:imFile];
    }
    data.innerMessage = msg;
    return msg;

}
- (TUISystemMessageCellData *)transSystemMsgFromDate:(NSDate *)date
{
    if(_msgForDate == nil || fabs([date timeIntervalSinceDate:_msgForDate.timestamp]) > MAX_MESSAGE_SEP_DLAY){
        TUISystemMessageCellData *system = [[TUISystemMessageCellData alloc] initWithDirection:MsgDirectionOutgoing];
        system.content = [date tk_messageString];
        system.reuseId = TSystemMessageCell_ReuseId;
        return system;
    }
    return nil;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    if(!_noMoreMsg && scrollView.contentOffset.y <= TMessageController_Header_Height){
        if(!_indicatorView.isAnimating){
            [_indicatorView startAnimating];
        }
    }
    else{
        if(_indicatorView.isAnimating){
            [_indicatorView stopAnimating];
        }
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
    if(scrollView.contentOffset.y <= TMessageController_Header_Height){
        [self loadMessage];
    }
}

#pragma mark - message cell delegate

- (void)onSelectMessage:(TUIMessageCell *)cell
{
    if([cell isKindOfClass:[TUIVoiceMessageCell class]]){
        [self playVoiceMessage:(TUIVoiceMessageCell *)cell];
    }
    if ([cell isKindOfClass:[TUIImageMessageCell class]]) {
        [self showImageMessage:(TUIImageMessageCell *)cell];
    }
    if ([cell isKindOfClass:[TUIVideoMessageCell class]]) {
        [self showVideoMessage:(TUIVideoMessageCell *)cell];
    }
    if ([cell isKindOfClass:[TUIFileMessageCell class]]) {
        [self showFileMessage:(TUIFileMessageCell *)cell];
    }
    if ([self.delegate respondsToSelector:@selector(messageController:onSelectMessageContent:)]) {
        [self.delegate messageController:self onSelectMessageContent:cell];
    }
}

- (void)onLongPressMessage:(TUIMessageCell *)cell
{
    TUIMessageCellData *data = cell.messageData;
    if ([data isKindOfClass:[TUISystemMessageCellData class]])
        return; // 系统消息不响应

    NSMutableArray *items = [NSMutableArray array];
    if ([data isKindOfClass:[TUITextMessageCellData class]]) {
        [items addObject:[[UIMenuItem alloc] initWithTitle:@"复制" action:@selector(onCopyMsg:)]];
    }

    [items addObject:[[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(onDelete:)]];
    TIMMessage *imMsg = data.innerMessage;
    if(imMsg){
        if([imMsg isSelf] && [[NSDate date] timeIntervalSinceDate:imMsg.timestamp] < 2 * 60){
            [items addObject:[[UIMenuItem alloc] initWithTitle:@"撤回" action:@selector(onRevoke:)]];
        }
    }
    if(imMsg.status == TIM_MSG_STATUS_SEND_FAIL){
        [items addObject:[[UIMenuItem alloc] initWithTitle:@"重发" action:@selector(onReSend:)]];
    }


    BOOL isFirstResponder = NO;
    if(_delegate && [_delegate respondsToSelector:@selector(messageController:willShowMenuInCell:)]){
        isFirstResponder = [_delegate messageController:self willShowMenuInCell:cell];
    }
    if(isFirstResponder){
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(menuDidHide:) name:UIMenuControllerDidHideMenuNotification object:nil];
    }
    else{
        [self becomeFirstResponder];
    }
    UIMenuController *controller = [UIMenuController sharedMenuController];
    controller.menuItems = items;
    _menuUIMsg = data;
    [controller setTargetRect:cell.container.bounds inView:cell.container];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [controller setMenuVisible:YES animated:YES];
    });
}

- (void)onRetryMessage:(TUIMessageCell *)cell
{
    _reSendUIMsg = cell.messageData;
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"确定重发此消息吗？" message:nil preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"重发" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [self sendMessage:self.reSendUIMsg];
    }]];
    [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {

    }]];
    [self.navigationController presentViewController:alert animated:YES completion:nil];
}

- (void)onSelectMessageAvatar:(TUIMessageCell *)cell
{
    if ([self.delegate respondsToSelector:@selector(messageController:onSelectMessageAvatar:)]) {
        [self.delegate messageController:self onSelectMessageAvatar:cell];
    }
}

-(BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
    if (action == @selector(onDelete:) ||
        action == @selector(onRevoke:) ||
        action == @selector(onReSend:) ||
        action == @selector(onCopyMsg:)){
        return YES;
    }
    return NO;
}

- (BOOL)canBecomeFirstResponder
{
    return YES;
}

- (void)onDelete:(id)sender
{
    TIMMessage *imMsg = _menuUIMsg.innerMessage;
    if(imMsg == nil){
        return;
    }
    if([imMsg remove]){
        [self.tableView beginUpdates];
        NSInteger index = [_uiMsgs indexOfObject:_menuUIMsg];
        [_uiMsgs removeObjectAtIndex:index];
        [_heightCache removeObjectAtIndex:index];
        [self.tableView deleteRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]] withRowAnimation:UITableViewRowAnimationFade];

        [self.tableView endUpdates];
    }
}

- (void)menuDidHide:(NSNotification*)notification
{
    if(_delegate && [_delegate respondsToSelector:@selector(didHideMenuInMessageController:)]){
        [_delegate didHideMenuInMessageController:self];
    }
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIMenuControllerDidHideMenuNotification object:nil];
}

- (void)onCopyMsg:(id)sender
{
    if ([_menuUIMsg isKindOfClass:[TUITextMessageCellData class]]) {
        TUITextMessageCellData *txtMsg = (TUITextMessageCellData *)_menuUIMsg;
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
        pasteboard.string = txtMsg.content;
    }
}

- (void)onRevoke:(id)sender
{
    __weak typeof(self) ws = self;
    [self.conv revokeMessage:_menuUIMsg.innerMessage succ:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [ws revokeMsg:ws.menuUIMsg];
        });
    } fail:^(int code, NSString *msg) {
        NSLog(@"");
    }];
}

- (void)onReSend:(id)sender
{
    [self sendMessage:_menuUIMsg];
}

- (void)revokeMsg:(TUIMessageCellData *)msg
{
    TIMMessage *imMsg = msg.innerMessage;
    if(imMsg == nil){
        return;
    }
    NSInteger index = [_uiMsgs indexOfObject:msg];
    if (index == NSNotFound)
        return;
    [_uiMsgs removeObject:msg];

    [self.tableView beginUpdates];
    [self.tableView deleteRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]] withRowAnimation:UITableViewRowAnimationFade];
    TUISystemMessageCellData *data = [imMsg revokeCellData];
    [_uiMsgs insertObject:data atIndex:index];
    [self.tableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]] withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
    [self scrollToBottom:YES];
}

- (void)playVoiceMessage:(TUIVoiceMessageCell *)cell
{
    for (NSInteger index = 0; index < _uiMsgs.count; ++index) {
        if(![_uiMsgs[index] isKindOfClass:[TUIVoiceMessageCellData class]]){
            continue;
        }
        TUIVoiceMessageCellData *uiMsg = _uiMsgs[index];
        if(uiMsg == cell.voiceData){
            [uiMsg playVoiceMessage];
            cell.voiceReadPoint.hidden = YES;
        }
        else{
            [uiMsg stopVoiceMessage];
        }
    }
}

- (void)showImageMessage:(TUIImageMessageCell *)cell
{
    TUIImageViewController *image = [[TUIImageViewController alloc] init];
    image.data = [cell imageData];
    [self.navigationController pushViewController:image animated:YES];
}

- (void)showVideoMessage:(TUIVideoMessageCell *)cell
{
    TUIVideoViewController *video = [[TUIVideoViewController alloc] init];
    video.data = [cell videoData];
    [self.navigationController pushViewController:video animated:YES];
}

- (void)showFileMessage:(TUIFileMessageCell *)cell
{
    TUIFileViewController *file = [[TUIFileViewController alloc] init];
    file.data = [cell fileData];
    [self.navigationController pushViewController:file animated:YES];
}


- (void)didTapOnRestNameLabel:(TUIJoinGroupMessageCell *)cell withIndex:(NSInteger)index{
    [self jumpToProfileController:cell.joinData.userID[index]];
}
- (void)jumpToProfileController:(NSString *)memberId{
    //此处实现点击入群的姓名 Label 后，跳转到对应的消息界面。此处的跳转逻辑和点击头像的跳转逻辑相同。
    @weakify(self)
    TIMFriend *friend = [[TIMFriendshipManager sharedInstance] queryFriend:memberId];
    if (friend) {
        id<TUIFriendProfileControllerServiceProtocol> vc = [[TCServiceManager shareInstance] createService:@protocol(TUIFriendProfileControllerServiceProtocol)];
        if ([vc isKindOfClass:[UIViewController class]]) {
            vc.friendProfile = friend;
            [self.navigationController pushViewController:(UIViewController *)vc animated:YES];
            return;
        }
    }

    [[TIMFriendshipManager sharedInstance] getUsersProfile:@[memberId] forceUpdate:YES succ:^(NSArray<TIMUserProfile *> *profiles) {
        @strongify(self)
        if (profiles.count > 0) {
            id<TUIUserProfileControllerServiceProtocol> vc = [[TCServiceManager shareInstance] createService:@protocol(TUIUserProfileControllerServiceProtocol)];
            if ([vc isKindOfClass:[UIViewController class]]) {
                vc.userProfile = profiles[0];
                vc.actionType = PCA_ADD_FRIEND;
                [self.navigationController pushViewController:(UIViewController *)vc animated:YES];
                return;
            }
        }
    } fail:^(int code, NSString *msg) {
        [THelper makeToastError:code msg:msg];
    }];
}

//已读回执
- (void) didRecvMessageReceipts:(NSNotification *)noti{
    NSArray *receiptsArray = noti.object;
    if(!receiptsArray.count){
        NSLog(@"Receipt Data Error");
        return;
    }
    TIMMessageReceipt *receipt = receiptsArray[0];
    TIMConversation *receiptConv = receipt.conversation;
    time_t receiptTime = receipt.timestamp;
    if(receiptConv.getType == TIM_C2C && [receiptConv.getReceiver isEqualToString:self.conv.getReceiver]){
        //性能优化
        for(int i = 0;i < _uiMsgs.count;i++){
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:_uiMsgs.count - 1 - i inSection:0];
            TUIMessageCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
            //通过回调时间戳判定当前的未读是否需要改为已读
            if([cell.messageData.innerMessage.timestamp timeIntervalSince1970] <= receiptTime && ![cell.readReceiptLabel.text isEqualToString:@"已读"]) {
                cell.readReceiptLabel.text = @"已读";
            }
        }
    }
}

@end
