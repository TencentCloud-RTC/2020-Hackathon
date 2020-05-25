//
//  TECourseListViewController.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TECourseListViewController.h"
#import "TECourseListCell.h"

#import "TECourseDetailViewController.h"

#import "TEDataServices.h"
#import "TECourseInfoModel.h"
#import "UIImageView+WebCache.h"

#import "MJRefresh.h"
#import "TRTCCloudManager.h"
#import "TELoginAuthModel.h"
#import "TETencentCloudServices.h"

#import <ImSDK/ImSDK.h>

@interface TECourseListViewController()<UITableViewDataSource,UITableViewDelegate>
@property (nonatomic,strong) UITableView *tableView;

@property (nonatomic,strong) NSArray *courseList;

@end


static NSString *kCourseListCellReuseId = @"courseListCell";
@implementation TECourseListViewController



- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = RGB(247, 247, 247);
    self.navigationItem.title = @"课程列表";
    [self setupView];
    
    [self loadData];
    
    [self setupRefresh];
}



- (void)setupView
{
    self.tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, VIEW_NORMAL_HEIGHT) style:UITableViewStylePlain];
    self.tableView.backgroundColor = [UIColor whiteColor];
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.tableView registerNib:[UINib nibWithNibName:NSStringFromClass([TECourseListCell class]) bundle:nil] forCellReuseIdentifier:kCourseListCellReuseId];
    [self.view addSubview:_tableView];
}


- (void)loadData
{
    [MBProgressHUD showLoadingWithMessage:@"正在加载..." toView:self.view];
    [[TEDataServices sharedInstance] queryCourseList:^(BOOL isSuccess, NSArray * _Nonnull courseList, NSString * _Nonnull message) {
        [MBProgressHUD hideHUDForView:self.view];
        [self.tableView.mj_header endRefreshing];
        if (isSuccess) {
            self.courseList = courseList;
            [self.tableView reloadData];
        }else{
            [MBProgressHUD showError:message];
        }
    }];
}
#pragma mark ---- MJRefresh 上下拉刷新
- (void)setupRefresh
{
    MJRefreshNormalHeader *header = [MJRefreshNormalHeader headerWithRefreshingTarget:self refreshingAction:@selector(loadNewData)];
    header.lastUpdatedTimeLabel.hidden = YES;
    header.stateLabel.hidden = YES;
    self.tableView.mj_header = header;
}

- (void)loadNewData
{
    self.courseList = nil;
    [self.tableView reloadData];
    [self loadData];
}
#pragma mark ---- UITableViewDelegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.courseList.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    TECourseListCell *cell = [tableView dequeueReusableCellWithIdentifier:kCourseListCellReuseId forIndexPath:indexPath];
    TECourseInfoModel *courseInfo = self.courseList[indexPath.row];
    [cell.coverImageView sd_setImageWithURL:[NSURL URLWithString:courseInfo.coverFileUrl] placeholderImage:[UIImage imageNamed:@"course_cover_green"]];
    cell.nameLabel.text = courseInfo.courseName;
    cell.descLabel.text = courseInfo.courseDes;
    if ([courseInfo.isNoshowing isEqualToString:@"N"]) {
        cell.liveView.hidden = YES;
    }else{
        cell.liveView.hidden = NO;
    }
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 110;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
   
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    TECourseInfoModel *courseInfo = self.courseList[indexPath.row];
    
    //加入群组
    [[TIMGroupManager sharedInstance] joinGroup:courseInfo.avchatRoomId msg:@"" succ:^{
    } fail:^(int code, NSString *msg) {}];
    
    TIMConversation *conv = [[TIMManager sharedInstance] getConversation:TIM_GROUP receiver:courseInfo.avchatRoomId];
    [conv deleteLocalMessage:nil fail:nil];
    
    
    NSString *roomId = courseInfo.liveRoomId;
    [[TELoginAuthModel sharedInstance] fetch];
    NSString *userId = [TELoginAuthModel sharedInstance].userName;
    
    TRTCParams *param = [[TRTCParams alloc] init];
    param.sdkAppId = [TENCENT_APPID intValue];
    param.userId = userId;
    param.roomId = [roomId intValue];
    param.userSig = [TETencentCloudServices genTestUserSig:userId];
    param.role = TRTCRoleAnchor;
    
    
    TRTCRemoteUserManager *remoteManager = [[TRTCRemoteUserManager alloc] initWithTrtc:[TRTCCloud sharedInstance]];
    [remoteManager enableAutoReceiveAudio:YES
                         autoReceiveVideo:YES];
    
    TRTCCloudManager *manager = [[TRTCCloudManager alloc] initWithTrtc:[TRTCCloud sharedInstance] params:param scene:TRTCAppSceneLIVE appId:0 bizId:0];
    [manager setVideoEnabled:NO];
    [manager setAudioEnabled:NO];
    TECourseDetailViewController *vc = [[TECourseDetailViewController alloc] init];
    vc.param = param;
    vc.settingsManager = manager;
    vc.remoteUserManager = remoteManager;
    vc.appScene = TRTCAppSceneLIVE;
    
    vc.courseInfo = courseInfo;
    
    
    
    [self.navigationController pushViewController:vc animated:YES];
}


@end
