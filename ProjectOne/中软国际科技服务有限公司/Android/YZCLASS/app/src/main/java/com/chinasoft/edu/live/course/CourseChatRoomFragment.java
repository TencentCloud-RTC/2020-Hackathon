package com.chinasoft.edu.live.course;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.base.BaseFragment;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.custom.ActivityToFragmentListener;
import com.chinasoft.edu.live.custom.FragmentToActivityListener;
import com.chinasoft.edu.live.utils.LogUtils;
import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMConversationType;
import com.tencent.imsdk.TIMGroupManager;
import com.tencent.imsdk.TIMValueCallBack;
import com.tencent.imsdk.ext.group.TIMGroupSelfInfo;
import com.tencent.qcloud.tim.uikit.modules.chat.ChatLayout;
import com.tencent.qcloud.tim.uikit.modules.chat.base.ChatInfo;
import com.tencent.qcloud.tim.uikit.modules.chat.layout.input.InputLayout;
import com.tencent.qcloud.tim.uikit.modules.chat.layout.message.MessageLayout;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * 作者：young on 2020/4/28 11:35
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：课程聊天室
 */
public class CourseChatRoomFragment extends BaseFragment implements ActivityToFragmentListener {

    @BindView(R.id.chat_layout)
    ChatLayout chatLayout;
    @BindView(R.id.iv_voice)
    ImageView ivVoice;
    @BindView(R.id.tv_voice)
    TextView tvVoice;
    @BindView(R.id.rl_voice)
    RelativeLayout rlVoice;

    String avChatRoomId;

    FragmentToActivityListener listener;

    boolean isConnected;

    public void setListener(FragmentToActivityListener listener) {
        this.listener = listener;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_chat_room, container,
                false);
        ButterKnife.bind(this, rootView);
        Bundle bundle = getArguments();
        avChatRoomId = bundle.getString(Constants.KEY_CHAT_ROOMID);
        initView();
        return rootView;
    }

    private void initView() {

        chatLayout.getTitleBar().setVisibility(View.GONE);
        InputLayout inputLayout = chatLayout.getInputLayout();
        inputLayout.disableAudioInput(true);
        MessageLayout messageLayout = chatLayout.getMessageLayout();
        messageLayout.setAvatarRadius(20);
        messageLayout.setLeftNameVisibility(View.VISIBLE);
        messageLayout.setRightNameVisibility(View.VISIBLE);
        LogUtils.e("avChatRoomId", "avChatRoomId:___" + avChatRoomId);
        if (!TextUtils.isEmpty(avChatRoomId)) {
            TIMGroupManager.getInstance().getSelfInfo(avChatRoomId, new TIMValueCallBack<TIMGroupSelfInfo>() {
                @Override
                public void onError(int i, String s) {
                    LogUtils.e("error", "error:____" + s);
                }

                @Override
                public void onSuccess(TIMGroupSelfInfo timGroupSelfInfo) {
                    LogUtils.e("success", "timGroupSelfInfo:____" + timGroupSelfInfo.toString());
                }
            });
            TIMGroupManager.getInstance().applyJoinGroup(avChatRoomId, "some reason", new TIMCallBack() {
                @java.lang.Override
                public void onError(int code, String desc) {
                    //接口返回了错误码 code 和错误描述 desc，可用于原因
                    //错误码 code 列表请参见错误码表
                    LogUtils.e("applyJoinGroup err code = " + code + ", desc = " + desc);
                }

                @java.lang.Override
                public void onSuccess() {
                    ChatInfo chatInfo = new ChatInfo();
                    LogUtils.e("applyJoinGroup success");
                    chatInfo.setId(avChatRoomId);
                    chatInfo.setType(TIMConversationType.Group);
                    chatLayout.setChatInfo(chatInfo);
                    chatLayout.initDefault();
                }
            });
        }
    }

    @OnClick(R.id.rl_voice)
    public void onClick() {

        if (listener != null) {
            if (isConnected) {
                listener.disconVoice();
            }else{
                listener.applyToVoice();
            }
        }
    }


    @Override
    public void acceptVoice() {
        isConnected = true;
        ivVoice.setImageResource(R.mipmap.icon_calling);
        tvVoice.setText("通话中");
    }

    @Override
    public void refuseVoice() {
        isConnected = false;
    }

    @Override
    public void outOfVoice() {
        isConnected = false;
        ivVoice.setImageResource(R.mipmap.icon_apply_voice);
        tvVoice.setText("发起语音");
    }
}
