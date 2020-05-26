//
//  TUIGroupConversationListController.m
//  TXIMSDK_TUIKit_iOS
//
//  Created by annidyfeng on 2019/6/10.
//

#import "TUIGroupConversationListController.h"
#import "TUIConversationListController.h"
#import "THeader.h"
#import "TUIKit.h"
#import "TUILocalStorage.h"
#import "TIMUserProfile+DataProvider.h"
#import "ReactiveObjC.h"
#import "UIView+MMLayout.h"
@import ImSDK;

static NSString *kConversationCell_ReuseId = @"TConversationCell";

@interface TUIGroupConversationListController ()<UIGestureRecognizerDelegate, UITableViewDelegate, UITableViewDataSource, UIPopoverPresentationControllerDelegate>

@end

@implementation TUIGroupConversationListController

- (void)viewDidLoad {
    [super viewDidLoad];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onRefreshConversations:) name:TUIKitNotification_TIMRefreshListener object:nil];


    _tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    [self.view addSubview:_tableView];
    _tableView.delegate = self;
    _tableView.dataSource = self;
    [_tableView setSectionIndexBackgroundColor:[UIColor clearColor]];
    [_tableView setSectionIndexColor:[UIColor darkGrayColor]];
    [_tableView setBackgroundColor:[UIColor colorWithRed:240.0/255 green:240.0/255 blue:240.0/255 alpha:1]];
    //cell无数据时，不显示间隔线
    UIView *v = [[UIView alloc] initWithFrame:CGRectZero];
    [_tableView setTableFooterView:v];

    _tableView.separatorInset = UIEdgeInsetsMake(0, 58, 0, 0);

    [_tableView registerClass:[TCommonContactCell class] forCellReuseIdentifier:kConversationCell_ReuseId];


    self.viewModel = [TUIGroupConversationListViewModel new];
    [self updateConversations];

    @weakify(self)
    [RACObserve(self.viewModel, isLoadFinished) subscribeNext:^(id  _Nullable x) {
        @strongify(self)
        [self.tableView reloadData];
    }];
}


- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated
{
    [self updateConversations];
}

- (void)updateConversations
{
    [self.viewModel loadConversation];
}

- (void)onRefreshConversations:(NSNotification *)notification
{
    [self updateConversations];
}


#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView;
{
    return self.viewModel.groupList.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.viewModel.dataDict[self.viewModel.groupList[section]].count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    TCommonContactCellData *data = self.viewModel.dataDict[self.viewModel.groupList[indexPath.section]][indexPath.row];
    return [data heightOfWidth:Screen_Width];
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    return YES;
}

- (UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return UITableViewCellEditingStyleDelete;
}

- (NSString *)tableView:(UITableView *)tableView titleForDeleteConfirmationButtonForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return @"删除";
}

- (BOOL)tableView:(UITableView *)tableView shouldIndentWhileEditingRowAtIndexPath:(NSIndexPath *)indexPath
{
    return NO;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        [tableView beginUpdates];
        TCommonContactCellData *data = self.viewModel.dataDict[self.viewModel.groupList[indexPath.section]][indexPath.row];
        [self.viewModel removeData:data];
        [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObjects:indexPath, nil] withRowAnimation:UITableViewRowAnimationNone];
        [tableView endUpdates];
    }
}


- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{

#define TEXT_TAG 1
    static NSString *headerViewId = @"ContactDrawerView";
    UITableViewHeaderFooterView *headerView = [tableView dequeueReusableHeaderFooterViewWithIdentifier:headerViewId];
    if (!headerView)
    {
        headerView = [[UITableViewHeaderFooterView alloc] initWithReuseIdentifier:headerViewId];
        UILabel *textLabel = [[UILabel alloc] initWithFrame:CGRectZero];
        textLabel.tag = TEXT_TAG;
        textLabel.textColor = RGB(0x80, 0x80, 0x80);
        [headerView addSubview:textLabel];
        textLabel.mm_fill().mm_left(12);
        textLabel.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    }
    UILabel *label = [headerView viewWithTag:TEXT_TAG];
    label.text = self.viewModel.groupList[section];

    return headerView;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 33;
}

- (void)didSelectConversation:(TCommonContactCell *)cell
{

    TIMConversation *conv = [[TIMManager sharedInstance] getConversation:TIM_GROUP receiver:cell.contactData.identifier];

    TUIChatController *chat = [[TUIChatController alloc] initWithConversation:conv];
    chat.title = cell.contactData.title;
    [self.navigationController pushViewController:chat animated:YES];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    TCommonContactCell *cell = [tableView dequeueReusableCellWithIdentifier:kConversationCell_ReuseId forIndexPath:indexPath];
    TCommonContactCellData *data = self.viewModel.dataDict[self.viewModel.groupList[indexPath.section]][indexPath.row];
    if (!data.cselector) {
        data.cselector = @selector(didSelectConversation:);
    }
    [cell fillWithData:data];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{

}

- (UIModalPresentationStyle)adaptivePresentationStyleForPresentationController:(UIPresentationController *)controller {
    return UIModalPresentationNone;
}

@end
