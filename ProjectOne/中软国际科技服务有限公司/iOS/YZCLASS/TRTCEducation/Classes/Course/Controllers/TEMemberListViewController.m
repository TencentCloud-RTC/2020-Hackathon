//
//  TEMemberListViewController.m
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#import "TEMemberListViewController.h"
#import "TEMemberListCell.h"

#import "TEDataServices.h"
#import "UIImageView+WebCache.h"
#import "MJRefresh.h"
#import "TEMemberModel.h"

typedef NS_ENUM(NSInteger,TEMemberLoadMode) {
    TEMemberFirstLoadMode,
    TEMemberHeaderRefreshLoadMode,
    TEMemberFooterRefreshLoadMode
};

@interface TEMemberListViewController ()<UITableViewDataSource,UITableViewDelegate>

@property (nonatomic,strong) UITableView *tableView;
/** 成员列表 */
@property (nonatomic,strong) NSMutableArray *memberList;
/** 页码 */
@property (nonatomic,assign) NSInteger pageNumber;
/**  */
@property (nonatomic,assign) TEMemberLoadMode loadMode;
@end

static NSString *kMemberListCellReuseId = @"memberListCell";

@implementation TEMemberListViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = RGB(247, 247, 247);
    self.pageNumber = 1;
    self.memberList = [NSMutableArray array];
    [self setupView];
    
    [self startLoadData];
    [self setupRefresh];
}

- (void)setupView
{
    self.tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, self.view.height) style:UITableViewStylePlain];
    self.tableView.backgroundColor = [UIColor whiteColor];
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.allowsSelection = NO;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.tableView registerNib:[UINib nibWithNibName:NSStringFromClass([TEMemberListCell class]) bundle:nil] forCellReuseIdentifier:kMemberListCellReuseId];
    [self.view addSubview:_tableView];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    self.tableView.frame = CGRectMake(0, 0, SCREEN_WIDTH, self.view.height);
}


- (void)startLoadData
{
    self.loadMode = TEMemberFirstLoadMode;
    self.pageNumber = 1;
    [self.tableView.mj_footer resetNoMoreData];
    self.tableView.mj_footer.hidden = YES;
    [self.memberList removeAllObjects];
    [self.tableView reloadData];
    
    [MBProgressHUD showLoadingToView:self.view];
    [self loadData];
}

- (void)loadData
{
    TEDataServices *service = [TEDataServices sharedInstance];
    [service queryMemberListLiveRoomId:self.courseInfo.liveRoomId currentPage:self.pageNumber result:^(BOOL isSuccess, NSArray * _Nonnull memberList,NSInteger totalNumbers, NSString * _Nonnull message) {
        [MBProgressHUD hideHUDForView:self.view];
                if (!isSuccess) {
                    switch (self.loadMode) {
                        case TEMemberFirstLoadMode:
                            [MBProgressHUD showError:message];
                            break;
                        case TEMemberHeaderRefreshLoadMode:
                            [self.tableView.mj_header endRefreshing];
                            [MBProgressHUD showError:message];
                            break;
                        case TEMemberFooterRefreshLoadMode:
                            [self.tableView.mj_footer endRefreshing];
                            [MBProgressHUD showError:message];
                            break;
                    }
                }else{
                    switch (self.loadMode) {
                        case TEMemberFirstLoadMode:
                            if (memberList.count == 0) {
                                self.tableView.mj_footer.hidden = YES;
                            }else{
                                self.memberList = [memberList mutableCopy];
                                self.tableView.mj_footer.hidden = NO;
                            }
                            break;
                        case TEMemberHeaderRefreshLoadMode:
                            [self.tableView.mj_header endRefreshing];
                            if (memberList.count == 0) {
                            }else{
                               self.memberList = [memberList mutableCopy];
                               self.tableView.mj_footer.hidden = NO;
                            }
                           
                            break;
                        case TEMemberFooterRefreshLoadMode:
                            if (self.memberList.count == totalNumbers) {
                                [self.tableView.mj_footer endRefreshingWithNoMoreData];
                                return;
                            }
                            [self.memberList addObjectsFromArray:memberList];
                            if (self.memberList.count == totalNumbers) {
                                [self.tableView.mj_footer endRefreshingWithNoMoreData];
                            }else{
                                [self.tableView.mj_footer endRefreshing];
                            }
                            break;
                    }
                    [self.tableView reloadData];
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
    
    MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(loadMoreData)];
    footer.refreshingTitleHidden = YES;
    self.tableView.mj_footer = footer;
}

- (void)loadNewData
{
    self.loadMode = TEMemberHeaderRefreshLoadMode;
    self.pageNumber = 1;
    [self.tableView.mj_footer resetNoMoreData];
    self.tableView.mj_footer.hidden = YES;
    [self.memberList removeAllObjects];
    [self.tableView reloadData];
    [self loadData];
}

- (void)loadMoreData
{
    self.loadMode = TEMemberFooterRefreshLoadMode;
    self.pageNumber += 1;
    [self loadData];
    
}
#pragma mark ---- UITableViewDelegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.memberList.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    TEMemberListCell *cell = [tableView dequeueReusableCellWithIdentifier:kMemberListCellReuseId forIndexPath:indexPath];
    TEMemberModel *model = self.memberList[indexPath.row];
    cell.numberLabel.text = [NSString stringWithFormat:@"%ld",indexPath.row + 1];
    cell.nameLabel.text = model.nickname;
    [cell.headImageView sd_setImageWithURL:[NSURL URLWithString:model.headFileUrl] placeholderImage:[UIImage imageNamed:@"placeholder_icon"]];
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 60;
}
@end
