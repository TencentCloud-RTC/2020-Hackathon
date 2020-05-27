using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace IM.UI
{
    /// <summary>
    /// <para>功能：IM代理类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.10.29</para>
    /// </summary>
    public class IMProxy
    {
        //原型： TIM_DECL int TIMInit(uint64_t sdk_app_id, const char* json_sdk_config);
        /// <summary>
        /// 初始化接口方法
        /// </summary>
        /// <param name="sdk_app_id"></param>
        /// <param name="json_sdk_config"></param>
        /// <returns></returns>
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMInit", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMInit(Int64 sdk_app_id, string json_sdk_config);

        //原型： TIM_DECL int TIMLogin(const char* user_id, const char* user_sig, TIMCommCallback cb, const void* user_data);
        /// <summary>
        /// 登录接口方法
        /// </summary>
        /// <param name="user_id"></param>
        /// <param name="user_sig"></param>
        /// <param name="cb"></param>
        /// <param name="user_data"></param>
        /// <returns></returns>
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMLogin", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMLogin(string user_id, string user_sig, TIMCommCallback cb, IntPtr user_data);

        /***************  登出
        * 原型：TIM_DECL int TIMLogout(TIMCommCallback cb, const void* user_data);
        * cb： 登出成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMLogout", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMLogout(TIMCommCallback cb, IntPtr user_data);

        //原型： TIM_DECL int TIMConvCreate(const char* conv_id, enum TIMConvType conv_type, TIMCommCallback cb, const void* user_data);
        /// <summary>
        /// 创建会话接口
        /// </summary>
        /// <param name="conv_id"></param>
        /// <param name="conv_type"></param>
        /// <param name="cb"></param>
        /// <param name="user_data"></param>
        /// <returns></returns>
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMConvCreate", CallingConvention = CallingConvention.StdCall)]

        public static extern int TIMConvCreate(string conv_id, TIMConvType conv_type, TIMCommCallback cb, IntPtr user_data);

        /***************  发送新消息，单聊消息和群消息的发送均采用此接口
        * 原型：TIM_DECL int TIMMsgSendNewMsg(const char* conv_id, enum TIMConvType conv_type, const char* json_msg_param, TIMCommCallback cb, const void* user_data);
        * conv_id： 会话的 ID（发送单聊消息时conv_id为对方的 identifier，conv_type为kTIMConv_C2C）
        * conv_type： 会话类型（发送群聊消息时conv_id为群 ID，conv_type为kTIMConv_Group）
        * json_msg_param： 消息 JSON 字符串
        * cb： 发送新消息成功与否的回调。回调函数定义请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        * */
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMMsgSendNewMsg", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMMsgSendNewMsg(string conv_id, TIMConvType conv_type, [MarshalAs(UnmanagedType.LPArray, SizeConst = 8010)]byte[] json_msg_param, TIMCommCallback cb, IntPtr user_data);
        //public delegate void TIMCommCallback(int code, string desc, [MarshalAs(UnmanagedType.LPArray, SizeConst = 8010)]byte[] json_params, IntPtr user_data);

        /***************  增加接收新消息回调
        * 原型：TIM_DECL void TIMAddRecvNewMsgCallback(TIMRecvNewMsgCallback cb, const void* user_data);
        * cb： 新消息回调函数，请参考 TIMRecvNewMsgCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMAddRecvNewMsgCallback", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMAddRecvNewMsgCallback(TIMRecvNewMsgCallback cb, IntPtr user_data);

        /***************  创建群组
        * 原型：TIM_DECL int TIMGroupCreate(const char* json_group_create_param, TIMCommCallback cb, const void* user_data);
        * json_group_create_param: 创建群组的参数 JSON 字符串
        * cb： 创建群组成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupCreate", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMGroupCreate(string json_group_create_param, TIMCommCallback cb, IntPtr user_data);

        /***************  获取已加入群组列表
        * 原型：TIM_DECL int TIMGroupGetJoinedGroupList(TIMCommCallback cb, const void* user_data);
        * cb：获取已加入群组列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupGetJoinedGroupList", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMGroupGetJoinedGroupList(TIMCommCallback cb, IntPtr user_data);

        /***************  获取群组信息列表
         * 说明：此接口用于获取指定群 ID 列表的群详细信息。具体返回的群组详细信息字段参考
        * 原型：TIM_DECL int TIMGroupGetGroupInfoList(const char* json_group_getinfo_param, TIMCommCallback cb, const void* user_data);
        * json_group_getinfo_param: 获取群组信息列表参数的 JSON 字符串
        * cb：获取群组信息列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupGetGroupInfoList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMGroupGetGroupInfoList(string json_group_getinfo_param, TIMCommCallback cb, IntPtr user_data);

        /***************  获取群成员信息列表
        * 原型：TIM_DECL int TIMGroupGetMemberInfoList(const char* json_group_getmeminfos_param, TIMCommCallback cb, const void* user_data);
        * json_group_getmeminfos_param: 获取群成员信息列表参数的 JSON 字符串
        * cb：获取群组信息列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupGetMemberInfoList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMGroupGetMemberInfoList(string json_group_getmeminfos_param, TIMCommCallback cb, IntPtr user_data);

        /***************  获取最近联系人的会话列表
        * 原型：TIM_DECL int TIMConvGetConvList(TIMCommCallback cb, const void* user_data);
        * cb：获取最近联系人会话列表的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMConvGetConvList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMConvGetConvList(TIMCommCallback cb, IntPtr user_data);

        /***************  获取好友列表
        * 原型：TIM_DECL int TIMFriendshipGetFriendProfileList(TIMCommCallback cb, const void* user_data);
        * cb：获取好友列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipGetFriendProfileList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipGetFriendProfileList(TIMCommCallback cb, IntPtr user_data);

        /***************  获取黑名单列表
        * 原型：TIM_DECL int TIMFriendshipGetBlackList(TIMCommCallback cb, const void* user_data);
        * cb：获取黑名单列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipGetBlackList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipGetBlackList(TIMCommCallback cb, IntPtr user_data);

        /***************  删除黑名单
        * 原型：TIMFriendshipDeleteFromBlackList(const char* json_delete_from_blacklist_param, TIMCommCallback cb, const void* user_data);
        * json_delete_from_blacklist_param	const char*	从黑名单中删除指定用户接口参数的 JSON 字符串
        * cb：从黑名单中删除指定用户成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipDeleteFromBlackList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipDeleteFromBlackList(string json_delete_from_blacklist_param, TIMCommCallback cb, IntPtr user_data);

        /***************  获取指定用户列表的个人资料
        * 原型：TIM_DECL int TIMProfileGetUserProfileList(const char* json_get_user_profile_list_param, TIMCommCallback cb, const void* user_data);
        * json_get_user_profile_list_param: 获取指定用户列表的用户资料接口参数的 JSON 字符串
        * cb：获取好友列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMProfileGetUserProfileList", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMProfileGetUserProfileList(string json_get_user_profile_list_param, TIMCommCallback cb, IntPtr user_data);

        /***************  修改自己的个人资料
        * 原型：TIM_DECL int TIMProfileModifySelfUserProfile(const char* json_modify_self_user_profile_param, TIMCommCallback cb, const void* user_data);
        * json_modify_self_user_profile_param: 修改自己的资料接口参数的 JSON 字符串
        * cb：修改自己的资料成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMProfileModifySelfUserProfile", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMProfileModifySelfUserProfile([MarshalAs(UnmanagedType.LPArray, SizeConst = 8010)]byte[] json_modify_self_user_profile_param, TIMCommCallback cb, IntPtr user_data);

        /***************  添加好友
        * 原型：TIM_DECL int TIMFriendshipAddFriend(const char* json_add_friend_param, TIMCommCallback cb, const void* user_data);
        * json_add_friend_param: 添加好友接口参数的 JSON 字符串
        * cb：获取好友列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipAddFriend", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipAddFriend(string json_add_friend_param, TIMCommCallback cb, IntPtr user_data);

        /***************  删除好友
        * 原型：TIM_DECL int TIMFriendshipDeleteFriend(const char* json_delete_friend_param, TIMCommCallback cb, const void* user_data);
        * json_delete_friend_param: 删除好友接口参数的 JSON 字符串
        * cb：删除好友成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipDeleteFriend", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipDeleteFriend(string json_delete_friend_param, TIMCommCallback cb, IntPtr user_data);

        /***************  处理好友请求
        * 原型：TIM_DECL int TIMFriendshipHandleFriendAddRequest(const char* json_handle_friend_add_param, TIMCommCallback cb, const void* user_data);
        * json_handle_friend_add_param: 处理好友请求接口参数的 JSON 字符串
        * cb：获取好友列表成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipHandleFriendAddRequest", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipHandleFriendAddRequest(string json_handle_friend_add_param, TIMCommCallback cb, IntPtr user_data);

        /***************  检测好友类型（单向或双向）
        * TIM_DECL int TIMFriendshipCheckFriendType(const char* json_check_friend_list_param, TIMCommCallback cb, const void* user_data);
        * json_check_friend_list_param: 检测好友接口参数的 JSON 字符串
        * cb：检测好友成功与否的回调。回调函数定义和参数解析请参考 TIMCommCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMFriendshipCheckFriendType", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMFriendshipCheckFriendType(string json_check_friend_list_param, TIMCommCallback cb, IntPtr user_data);

        /***************  设置添加好友的回调
        * 原型：TIM_DECL void TIMSetOnAddFriendCallback(TIMOnAddFriendCallback cb, const void* user_data);
        * cb：添加好友回调，请参考 TIMOnAddFriendCallback
        * user_data： 用户自定义数据，IM SDK 只负责传回给回调函数 cb，不做任何处理
        **/
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMSetOnAddFriendCallback", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMSetOnAddFriendCallback(TIMOnAddFriendCallback cb, IntPtr user_data);


         /**
        * @brief 邀请加入群组
        *
        * @param json_group_invite_param 邀请加入群组的Json字符串
        * @param cb 邀请加入群组成功与否的回调。回调函数定义和参数解析请参考 [TIMCommCallback](TIMCloudCallback.h)
        * @param user_data 用户自定义数据，ImSDK只负责传回给回调函数cb，不做任何处理
        * @return int 返回TIM_SUCC表示接口调用成功（接口只有返回TIM_SUCC，回调cb才会被调用），其他值表示接口调用失败。每个返回值的定义请参考 [TIMResult](TIMCloudDef.h)
        *

        * @note
        * > 权限说明:
        * >>   只有私有群可以拉用户入群
        * >>   公开群、聊天室邀请用户入群
        * >>   需要用户同意；直播大群不能邀请用户入群。
        * > 此接口支持批量邀请成员加入群组,Json Key详情请参考[GroupInviteMemberParam](TIMCloudDef.h)
        */
        //TIM_DECL int TIMGroupInviteMember(const char* json_group_invite_param, TIMCommCallback cb, const void* user_data);
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupInviteMember", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMGroupInviteMember(string json_group_invite_param, TIMCommCallback cb, IntPtr user_data);

        //获取指定会话的消息列表。
        //TIM_DECL int TIMMsgGetMsgList(const char* conv_id, enum TIMConvType conv_type, const char* json_get_msg_param, TIMCommCallback cb, const void* user_data);
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMMsgGetMsgList", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMMsgGetMsgList(string conv_id, TIMConvType conv_type, string json_get_msg_param, TIMCommCallback cb, IntPtr user_data);

        //TIM_DECL int TIMGroupModifyGroupInfo(const char* json_group_modifyinfo_param, TIMCommCallback cb, const void* user_data);
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupModifyGroupInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMGroupModifyGroupInfo(string json_group_modifyinfo_param, TIMCommCallback cb, IntPtr user_data);

        //TIM_DECL int TIMGroupModifyMemberInfo(const char* json_group_modifymeminfo_param, TIMCommCallback cb, const void* user_data);
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupModifyMemberInfo", CallingConvention = CallingConvention.StdCall)]
        public static extern void TIMGroupModifyMemberInfo(string json_group_modifymeminfo_param, TIMCommCallback cb, IntPtr user_data);

        //TIM_DECL int TIMGroupJoin(const char* group_id, const char* hello_msg, TIMCommCallback cb, const void* user_data);
        [DllImport(@".\imsdk.dll", EntryPoint = "TIMGroupJoin", CallingConvention = CallingConvention.StdCall)]
        public static extern int TIMGroupJoin(string group_id, string hello_msg, TIMCommCallback cb, IntPtr user_data);
    }

    /// <summary>
    /// 回调委托(共通)
    /// </summary>
    /// <param name="code"></param>
    /// <param name="desc"></param>
    /// <param name="json_params"></param>
    /// <param name="user_data"></param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void TIMCommCallback(int code, string desc, [MarshalAs(UnmanagedType.LPArray, SizeConst = 80100)]byte[] json_params, IntPtr user_data);

    /// <summary>
    /// 回调委托(共通)
    /// </summary>
    /// <param name="code"></param>
    /// <param name="desc"></param>
    /// <param name="json_params"></param>
    /// <param name="user_data"></param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void TIMCommCallback2(int code, string desc, string json_params, IntPtr user_data);

    /// <summary>
    /// 新消息回调
    /// </summary>
    /// <param name="json_msg_array"></param>
    /// <param name="user_data"></param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void TIMRecvNewMsgCallback([MarshalAs(UnmanagedType.LPArray, SizeConst = 80100)]byte[] json_msg_array, IntPtr user_data);

    /// <summary>
    /// 添加好友回调
    /// </summary>
    /// <param name="json_msg_array"></param>
    /// <param name="user_data"></param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void TIMOnAddFriendCallback([MarshalAs(UnmanagedType.LPArray, SizeConst = 80100)]byte[] json_msg_array, IntPtr user_data);


}
