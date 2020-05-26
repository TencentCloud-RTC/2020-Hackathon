package com.chinasoft.edu.live.course;

import android.Manifest;
import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.constraintlayout.widget.Group;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.base.BaseActivity;
import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.custom.ActivityToFragmentListener;
import com.chinasoft.edu.live.custom.CustomDialog;
import com.chinasoft.edu.live.custom.FragmentToActivityListener;
import com.chinasoft.edu.live.custom.NiceImageView;
import com.chinasoft.edu.live.custom.WaterMarkBg;
import com.chinasoft.edu.live.utils.FileUtils;
import com.chinasoft.edu.live.utils.JsonUtils;
import com.chinasoft.edu.live.utils.LogUtils;
import com.chinasoft.edu.live.utils.SPUtils;
import com.tencent.imsdk.TIMManager;
import com.tencent.liteav.demo.trtc.customcapture.TestRenderVideoFrame;
import com.tencent.liteav.demo.trtc.customcapture.TestSendCustomData;
import com.tencent.liteav.demo.trtc.debug.GenerateTestUserSig;
import com.tencent.liteav.demo.trtc.sdkadapter.ConfigHelper;
import com.tencent.liteav.demo.trtc.sdkadapter.TRTCCloudManager;
import com.tencent.liteav.demo.trtc.sdkadapter.TRTCCloudManagerListener;
import com.tencent.liteav.demo.trtc.sdkadapter.bgm.TRTCBgmManager;
import com.tencent.liteav.demo.trtc.sdkadapter.cdn.CdnPlayManager;
import com.tencent.liteav.demo.trtc.sdkadapter.feature.AudioConfig;
import com.tencent.liteav.demo.trtc.sdkadapter.feature.VideoConfig;
import com.tencent.liteav.demo.trtc.sdkadapter.remoteuser.TRTCRemoteUserManager;
import com.tencent.liteav.demo.trtc.widget.videolayout.TRTCVideoLayoutManager;
import com.tencent.liteav.demo.trtc.widget.videolayout.Utils;
import com.tencent.qcloud.tim.uikit.component.picture.imageEngine.impl.GlideEngine;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;
import com.tencent.rtmp.ITXLivePlayListener;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCStatistics;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * @描述 课程直播页面
 * @作者 young
 * @时间 2020/4/28  09:46
 */
public class CourseLiveRoomActivity extends BaseActivity implements FragmentToActivityListener, TRTCCloudManagerListener, TRTCCloudManager.IView, TRTCRemoteUserManager.IView, ITXLivePlayListener, CourseLiveRoomView {

    @BindView(R.id.mtrtc_manager_layout)
    TRTCVideoLayoutManager mTRTCVideoLayout;
    @BindView(R.id.iv_back)
    ImageView ivBack;
    @BindView(R.id.iv_loading)
    ImageView ivLoading;
    @BindView(R.id.tv_course_title)
    TextView tvCourseTitle;
    @BindView(R.id.iv_teacher_head)
    NiceImageView ivTeacherHead;
    @BindView(R.id.tv_teacher_name)
    TextView tvTeacherName;
    @BindView(R.id.rl_voice)
    RelativeLayout rlVoice;
    @BindView(R.id.iv_head_1)
    NiceImageView ivHead1;
    @BindView(R.id.iv_head_2)
    NiceImageView ivHead2;
    @BindView(R.id.iv_head_3)
    NiceImageView ivHead3;
    @BindView(R.id.rl_discuss)
    RelativeLayout rlDiscuss;
    @BindView(R.id.rl_student)
    RelativeLayout rlStudent;
    @BindView(R.id.fragment_content)
    FrameLayout fragmentContent;
    @BindView(R.id.tv_discuss)
    TextView tvDiscuss;
    @BindView(R.id.view_discuss)
    View viewDiscuss;
    @BindView(R.id.tv_student)
    TextView tvStudent;
    @BindView(R.id.view_student)
    View viewStudent;
    @BindView(R.id.ll_calling)
    LinearLayout llCalling;
    @BindView(R.id.ll_tab)
    LinearLayout llTab;
    @BindView(R.id.view_line)
    View viewLine;
    @BindView(R.id.tv_loading)
    TextView tvLoading;
    @BindView(R.id.ll_loading)
    LinearLayout llLoading;
    @BindView(R.id.iv_voice)
    ImageView ivVoice;
    @BindView(R.id.iv_max_min_screen)
    ImageView ivMaxMinScreen;
    @BindView(R.id.rl_live)
    RelativeLayout rlLive;
    @BindView(R.id.ll_des)
    LinearLayout llDes;
    @BindView(R.id.rl_anchor)
    RelativeLayout rlAnchor;
    @BindView(R.id.view_margin)
    View viewMargin;
    @BindView(R.id.tv_watermark_bg)
    TextView tvWatermarkBg;
    private Fragment[] fragments;
    private int currentTabIndex = -1;
    CourseChatRoomFragment chatRoomFragment;
    CourseStudentFragment studentFragment;
    ActivityToFragmentListener listener;
    CourseBean courseBean;
    String teacherAccount;


    /**
     * 自定义采集和渲染相关
     */
    private boolean mIsCustomCaptureAndRender = false;
    private String mVideoFilePath;             // 视频文件路径
    private TestSendCustomData mCustomCapture;             // 外部采集
    private TestRenderVideoFrame mCustomRender;              // 外部渲染
    private Group mRoleAudienceGroup;
    private ImageView mIvMoreTrtc;
    private boolean mReceivedVideo = true;
    private boolean mReceivedAudio = true;
    private int mVolumeType = 0;
    private boolean mIsAudioHandFreeMode = true;
    WaterMarkBg waterMarkBg;

    CourseLiveRoomPresenter presenter;

    /**
     * 【关键】TRTC SDK 组件
     */
    private TRTCCloud mTRTCCloud;                 // SDK 核心类
    private TRTCCloudDef.TRTCParams mTRTCParams;                // 进房参数
    private int mAppScene;                  // 推流模式，文件头第一点注释
    private TRTCCloudManager mTRTCCloudManager;          // 提供核心的trtc
    private TRTCRemoteUserManager mTRTCRemoteUserManager;
    private TRTCBgmManager mBgmManager;
    private CdnPlayManager mCdnPlayManager;

    String userId;

    boolean isFullScreen;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        courseBean = (CourseBean) getIntent().getSerializableExtra(Constants.PASS_KEY_COURSE_INFO_BEAN);
        userId = (String) SPUtils.get(this, Constants.SP_KEY_USER_PHONE, "");

        mIsCustomCaptureAndRender = false;
        mReceivedVideo = true;
        mReceivedAudio = true;
        mVolumeType = TRTCCloudDef.TRTCSystemVolumeTypeAuto;
        mIsAudioHandFreeMode = true;

        String userSig = GenerateTestUserSig.genTestUserSig(userId);
        String roomId = courseBean.getLiveRoomId();
        VideoConfig videoConfig = ConfigHelper.getInstance().getVideoConfig();
        videoConfig.setCurIsMix(false);
        mAppScene = TRTCCloudDef.TRTC_APP_SCENE_LIVE;
        mTRTCParams = new TRTCCloudDef.TRTCParams(Constants.APPID, userId, userSig, Integer.parseInt(roomId), "", "");
//        mTRTCParams.role = TRTCCloudDef.TRTCRoleAudience;
        mTRTCParams.role = TRTCCloudDef.TRTCRoleAnchor;
        LogUtils.e("APPID", "" + Constants.APPID);
        LogUtils.e("userId", "" + userId);
        LogUtils.e("userSig", "" + userSig);
        LogUtils.e("roomId", "" + roomId);
        // 应用运行时，保持不锁屏、全屏化
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_course_live_room);
        ButterKnife.bind(this);
        checkPermission();
        initView();
        // 初始化
        initTRTCSDK();
        // 初始化 View
        // 初始化外部采集和渲染
        if (mIsCustomCaptureAndRender) {
            initCustomCapture();
        }
        presenter = new CourseLiveRoomPresenter(this);
        enterRoom();
    }

    /**
     * 初始化 SDK
     */
    private void initTRTCSDK() {
        LogUtils.e("enter initTRTCSDK ");
        mTRTCCloud = TRTCCloud.sharedInstance(this);
        //设置日志级别
        mTRTCCloud.setLogLevel(TRTCCloudDef.TRTC_LOG_LEVEL_DEBUG);
        //修改日志路径
        mTRTCCloud.setLogDirPath(FileUtils.getLogcatPath());
        mTRTCCloudManager = new TRTCCloudManager(this, mTRTCCloud, mTRTCParams, mAppScene);
        mTRTCCloudManager.setViewListener(this);
        mTRTCCloudManager.setTRTCListener(this);
        mTRTCCloudManager.initTRTCManager(mIsCustomCaptureAndRender, mReceivedAudio, mReceivedVideo);
        mTRTCCloudManager.setSystemVolumeType(mVolumeType);
        mTRTCCloudManager.enableAudioHandFree(mIsAudioHandFreeMode);

        mTRTCRemoteUserManager = new TRTCRemoteUserManager(mTRTCCloud, this, mIsCustomCaptureAndRender);
        mTRTCRemoteUserManager.setMixUserId(mTRTCParams.userId);
        mBgmManager = new TRTCBgmManager(mTRTCCloud, mTRTCParams);
        LogUtils.e("exit initTRTCSDK ");
    }

    private void initCustomCapture() {
        mVideoFilePath = getIntent().getStringExtra(FileUtils.getDownLoadPath());
        mCustomCapture = new TestSendCustomData(this, mVideoFilePath, true);
        mCustomRender = new TestRenderVideoFrame(mTRTCParams.userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
    }

    private void initView() {
        teacherAccount = courseBean.getTeacherInfo().getUserAccount();
        tvCourseTitle.setText(courseBean.getCourseName());
        GlideEngine.loadImage(ivTeacherHead, courseBean.getTeacherInfo().getFaceImgPath());
        tvTeacherName.setText(courseBean.getTeacherInfo().getNickName());

        chatRoomFragment = new CourseChatRoomFragment();
        studentFragment = new CourseStudentFragment();
        chatRoomFragment.setListener(this);
        fragments = new Fragment[2];
        fragments[0] = chatRoomFragment;
        fragments[1] = studentFragment;
        Bundle bundle = new Bundle();
        bundle.putString(Constants.PASS_KEY_COURSE_ID, courseBean.getLiveRoomId());
        bundle.putString(Constants.KEY_CHAT_ROOMID, courseBean.getAvchatRoomId());
        fragments[0].setArguments(bundle);
        fragments[1].setArguments(bundle);
        showIndex(0);
        listener = chatRoomFragment;
        String isShowing = courseBean.getIsNoshowing();
        if (TextUtils.equals("N", isShowing)) {
            ivLoading.setImageResource(R.mipmap.icon_not_loading);
            tvLoading.setText("暂无直播");
        } else {
            setAnimation();
        }
        setWaterMark();

    }

    private void setWaterMark() {
        waterMarkBg = new WaterMarkBg(CourseLiveRoomActivity.this, TIMManager.getInstance().getLoginUser(), 0, 14);
        waterMarkTimer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                Message message = new Message();
                message.what = 1;
                handler.sendMessage(message);
            }
        };
        waterMarkTimer.schedule(timerTask, 0, 3 * 1000);//延时1s，每隔1秒执行一次run方法
        if (tvWatermarkBg != null && waterMarkBg != null) {
            tvWatermarkBg.setBackground(waterMarkBg);
        }
    }

    final Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if (msg.what == 1) {
                if (waterMarkBg != null) {
                    waterMarkBg.invalidateSelf();
                }
            }
            super.handleMessage(msg);
        }
    };
    Timer waterMarkTimer;

    private void showIndex(int index) {

        if (currentTabIndex != index) {
            FragmentTransaction trx = getSupportFragmentManager()
                    .beginTransaction();
            if (currentTabIndex >= 0) {
                trx.hide(fragments[currentTabIndex]);
            }
            if (!fragments[index].isAdded()) {
                trx.add(R.id.fragment_content, fragments[index]);
            }
            trx.show(fragments[index]).commit();
        }
        currentTabIndex = index;
    }

    @OnClick({R.id.iv_back, R.id.rl_discuss, R.id.rl_student, R.id.iv_max_min_screen})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.iv_max_min_screen:
                onScreenChange();
                break;
            case R.id.iv_back:
                if (isFullScreen) {
                    onScreenChange();
                } else {
                    finish();
                }
                break;
            case R.id.rl_discuss:
                tvDiscuss.setSelected(true);
                viewDiscuss.setVisibility(View.VISIBLE);
                tvStudent.setSelected(false);
                viewStudent.setVisibility(View.GONE);
                showIndex(0);
                break;
            case R.id.rl_student:
                tvDiscuss.setSelected(false);
                viewDiscuss.setVisibility(View.GONE);
                tvStudent.setSelected(true);
                viewStudent.setVisibility(View.VISIBLE);
                showIndex(1);
                break;
        }
    }

    private void onScreenChange() {
        isFullScreen = !isFullScreen;
        ivMaxMinScreen.setImageResource(isFullScreen ? R.mipmap.player_icon_maxcreen : R.mipmap.player_icon_mincreen);
        CourseLiveRoomActivity.this.setRequestedOrientation(isFullScreen ? ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        int visiable = getVisiable();
        llDes.setVisibility(visiable);
        rlAnchor.setVisibility(visiable);
        viewMargin.setVisibility(visiable);
        llTab.setVisibility(visiable);
        viewLine.setVisibility(visiable);
        fragmentContent.setVisibility(visiable);
        int height = Utils.dip2px(CourseLiveRoomActivity.this, 232);
        ViewGroup.LayoutParams params = rlLive.getLayoutParams();
        params.height = isFullScreen ? ViewGroup.LayoutParams.MATCH_PARENT : height;
        rlLive.setLayoutParams(params);
    }

    private int getVisiable() {
        return isFullScreen ? View.GONE : View.VISIBLE;
    }

    /**
     * 切换角色
     */
    private void switchRole(boolean audioSwith) {
        // 开启声音
        if (audioSwith) {
            mTRTCCloud.startLocalAudio();
        } else {
            // 关闭音频采集
            mTRTCCloud.stopLocalAudio();
        }
    }

    /**
     * 点击发起语音
     */
    @Override
    public void applyToVoice() {
        LogUtils.e("applyToVoice");
//        mTRTCCloud.switchRole(TRTCCloudDef.TRTCRoleAnchor);
        CustomDialog dialog = new CustomDialog(CourseLiveRoomActivity.this, R.style.mdialog,
                new CustomDialog.OncloseListener() {
                    @Override
                    public void onClick(boolean confirm) {
                        if (confirm) {
                            // TODO:

                            String nickName = (String) SPUtils.get(CourseLiveRoomActivity.this, Constants.SP_KEY_USER_NAME, "");
                            CustomMsgBean customMsgBean = new CustomMsgBean();
                            customMsgBean.setUserId(userId);
                            customMsgBean.setUserName(nickName);
                            String data = JsonUtils.serialize(customMsgBean);
                            sendCustomMsg(data, CustomMsgBean.STUDENT_APPLY);

                        }
                    }
                }).setContent("是否发起连麦申请?")
                .setPositiveButton("发起申请");
        dialog.show();
    }

    //发送自定义消息的示例代码
    public void sendCustomMsg(String dataStr, int cmdID) {
        try {
            byte[] data = dataStr.getBytes("UTF-8");
            // reliable 和 ordered 目前需要一致，这里以需要保证消息按发送顺序到达为例
            boolean isSend = mTRTCCloud.sendCustomCmdMsg(cmdID, data, true, true);

            LogUtils.e("isSend  " + isSend);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } finally {
//            mTRTCCloud.switchRole(TRTCCloudDef.TRTCRoleAudience);
        }
    }

    Timer timer;

    /**
     * 点击通话中
     */
    @Override
    public void disconVoice() {
        LogUtils.e("disconVoice");
        CustomDialog dialog = new CustomDialog(CourseLiveRoomActivity.this, R.style.mdialog,
                new CustomDialog.OncloseListener() {
                    @Override
                    public void onClick(boolean confirm) {
                        timer.cancel();
                        if (confirm) {
                            presenter.disconnectVoice();
                        }
                    }
                });
        dialog.show();
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        setTime(dialog);
                    }
                });

            }
        }, 1000, 1000);
    }

    private void setTime(CustomDialog dialog) {
        long currentTime = System.currentTimeMillis();
        long conTime = currentTime - startTime;
        dialog.setTime("正在连麦，连接时长   " + timeParse(conTime));
    }

    public static String timeParse(long duration) {
        String time = "";
        long minute = duration / 60000;
        long seconds = duration % 60000;
        long second = Math.round((float) seconds / 1000);
        if (minute < 10) {
            time += "0";
        }
        time += minute + ":";
        if (second < 10) {
            time += "0";
        }
        time += second;
        return time;
    }

    //////////////////////////////////    动态权限申请   ////////////////////////////////////////
    private final static int REQ_PERMISSION_CODE = 0x1000;

    private boolean checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            List<String> permissions = new ArrayList<>();
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA)) {
                permissions.add(Manifest.permission.CAMERA);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)) {
                permissions.add(Manifest.permission.RECORD_AUDIO);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)) {
                permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            if (permissions.size() != 0) {
                ActivityCompat.requestPermissions(CourseLiveRoomActivity.this,
                        (String[]) permissions.toArray(new String[0]),
                        REQ_PERMISSION_CODE);
                return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQ_PERMISSION_CODE:
                for (int ret : grantResults) {
                    if (PackageManager.PERMISSION_GRANTED != ret) {
                        Toast.makeText(this, "用户没有允许需要的权限，使用可能会受到限制！", Toast.LENGTH_SHORT).show();
                    }
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onAudioVolumeEvaluationChange(boolean enable) {
        if (enable) {
            mTRTCVideoLayout.showAllAudioVolumeProgressBar();
        } else {
            mTRTCVideoLayout.hideAllAudioVolumeProgressBar();
        }
    }

    @Override
    public void onStartLinkMic() {

    }

    @Override
    public void onMuteLocalVideo(boolean isMute) {
        mTRTCVideoLayout.updateVideoStatus(mTRTCParams.userId, !isMute);
    }

    @Override
    public void onMuteLocalAudio(boolean isMute) {

    }

    @Override
    public void onSnapshotLocalView(Bitmap bmp) {

    }

    @Override
    public void onEnterRoom(long elapsed) {
        if (elapsed >= 0) {
            LogUtils.e("onEnterRoom");
            // 发起云端混流
            mTRTCRemoteUserManager.updateCloudMixtureParams();
            presenter.enterRoom();
        } else {
            exitRoom();
        }
    }

    @Override
    public void onExitRoom(int reason) {
        LogUtils.e("退出房间");
        finish();
    }

    @Override
    public void onError(int errCode, String errMsg, Bundle extraInfo) {
        LogUtils.e("onError: " + errMsg + "[" + errCode + "]");
        ToastUtil.toastShortMessage("onError: " + errMsg + "[" + errCode + "]");
        // 执行退房
        exitRoom();
        finish();
    }

    /**
     * 有新的主播{@link TRTCCloudDef#TRTCRoleAnchor}加入了当前视频房间
     * 该方法会在主播加入房间的时候进行回调，此时音频数据会自动拉取下来，但是视频需要有 View 承载才会开始渲染。
     * 为了更好的交互体验，Demo 选择在 onUserVideoAvailable 中，申请 View 并且开始渲染。
     * 您可以根据实际需求，选择在 onUserEnter 还是 onUserVideoAvailable 中发起渲染。
     *
     * @param userId 用户标识
     */
    @Override
    public void onUserEnter(String userId) {
        LogUtils.e(userId + "____onUserEnter");
        String teacherId = courseBean.getTeacherInfo().getUserAccount();
        //教师jinru
        if (TextUtils.equals(userId, teacherId)) {
            if (isRotation) {
                ivLoading.setVisibility(View.GONE);
                tvLoading.setVisibility(View.GONE);
                stopAnimation();
            }
        }
    }

    /**
     * 主播{@link TRTCCloudDef#TRTCRoleAnchor}离开了当前视频房间
     * 主播离开房间，要释放相关资源。
     * 1. 释放主画面、辅路画面
     * 2. 如果您有混流的需求，还需要重新发起混流，保证混流的布局是您所期待的。
     *
     * @param userId 用户标识
     * @param reason 离开原因代码，区分用户是正常离开，还是由于网络断线等原因离开。
     */
    @Override
    public void onUserExit(String userId, int reason) {
        LogUtils.e(userId + "_____onUserExit");
        String teacherId = courseBean.getTeacherInfo().getUserAccount();
        //教师离开
        if (TextUtils.equals(userId, teacherId)) {
            ivLoading.setVisibility(View.VISIBLE);
            tvLoading.setVisibility(View.VISIBLE);
            ivLoading.setImageResource(R.mipmap.icon_not_loading);
            tvLoading.setText("暂无直播");

            if (isConnected) {
                presenter.disconnectVoice();
                switchRole(false);
                listener.outOfVoice();
            }
        }
        mTRTCRemoteUserManager.removeRemoteUser(userId);
        // 回收分配的渲染的View
        mTRTCVideoLayout.recyclerCloudViewView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
        mTRTCVideoLayout.recyclerCloudViewView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
        // 更新混流参数
        mTRTCRemoteUserManager.updateCloudMixtureParams();
    }

    @Override
    public void onUserVideoAvailable(String userId, boolean available) {
        onVideoChange(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, available);
        String teacherId = courseBean.getTeacherInfo().getUserAccount();
        if (TextUtils.equals(userId, teacherId)) {
            ivLoading.setVisibility(View.GONE);
            tvLoading.setVisibility(View.GONE);
            if (isRotation) {
                stopAnimation();
            }
        }
    }

    @Override
    public void onUserSubStreamAvailable(String userId, boolean available) {
        onVideoChange(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB, available);
        String teacherId = courseBean.getTeacherInfo().getUserAccount();
        if (TextUtils.equals(userId, teacherId)) {
            ivLoading.setVisibility(View.GONE);
            tvLoading.setVisibility(View.GONE);
            if (isRotation) {
                stopAnimation();
            }
        }
    }

    @Override
    public void onUserAudioAvailable(String userId, boolean available) {

    }

    @Override
    public void onFirstVideoFrame(String userId, int streamType, int width, int height) {

    }

    @Override
    public void onUserVoiceVolume(ArrayList<TRTCCloudDef.TRTCVolumeInfo> userVolumes, int totalVolume) {
        for (int i = 0; i < userVolumes.size(); ++i) {
            mTRTCVideoLayout.updateAudioVolume(userVolumes.get(i).userId, userVolumes.get(i).volume);
        }
    }

    @Override
    public void onStatistics(TRTCStatistics statics) {

    }

    @Override
    public void onConnectOtherRoom(String userID, int err, String errMsg) {

    }

    @Override
    public void onDisConnectOtherRoom(int err, String errMsg) {

    }

    /**
     * 网络行质量回调
     * 您可以用来在 UI 上显示当前用户的网络质量，提高用户体验
     *
     * @param localQuality  上行网络质量
     * @param remoteQuality 下行网络质量
     */
    @Override
    public void onNetworkQuality(TRTCCloudDef.TRTCQuality localQuality, ArrayList<TRTCCloudDef.TRTCQuality> remoteQuality) {
        mTRTCVideoLayout.updateNetworkQuality(localQuality.userId, localQuality.quality);
        for (TRTCCloudDef.TRTCQuality qualityInfo : remoteQuality) {
            mTRTCVideoLayout.updateNetworkQuality(qualityInfo.userId, qualityInfo.quality);
        }
    }

    @Override
    public void onAudioEffectFinished(int effectId, int code) {

    }

    long startTime;
    long endTime;
    boolean isConnected;

    @Override
    public void onRecvCustomCmdMsg(String userId, int cmdID, int seq, byte[] message) {

        String msg = "";
        if (message != null && message.length > 0) {
            try {
                msg = new String(message, "UTF-8");

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            LogUtils.e("收到" + userId + "的消息：" + msg);
        }
        LogUtils.e("cmdID   " + cmdID);
        CustomMsgBean customMsgBean = JsonUtils.deserialize(msg, CustomMsgBean.class);
        String userNumber = customMsgBean.getUserId();
        switch (cmdID) {
            //有人退出连麦
            case CustomMsgBean.STUDENT_OUT:
                // 更新上麦人员列表
                presenter.getOnVoiceStudentList();
                break;
            //老师同意连麦
            case CustomMsgBean.TEACHER_ACCEPT:
                if (TextUtils.equals(userNumber, TIMManager.getInstance().getLoginUser())) {
                    presenter.getOnVoiceStudentList();
                    listener.acceptVoice();
                    switchRole(true);
                    startTime = System.currentTimeMillis();
                    isConnected = true;
                }
                break;
            //老师拒绝连麦
            case CustomMsgBean.TEACHER_REFUSE:
                if (TextUtils.equals(userNumber, TIMManager.getInstance().getLoginUser())) {
                    listener.refuseVoice();
                    ToastUtil.toastShortMessage(courseBean.getTeacherInfo().getNickName() + "老师拒绝了你的连麦！");
                }
                break;
        }

    }

    @Override
    public void onRecvSEIMsg(String userId, byte[] data) {
        String msg = "";
        if (data != null && data.length > 0) {
            try {
                msg = new String(data, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
//            ToastUtil.toastShortMessage("收到" + userId + "的消息：" + msg);
            LogUtils.e("收到" + userId + "的消息：" + msg);
        }
    }

    @Override
    public TXCloudVideoView getRemoteUserViewById(String userId, int steamType) {
        TXCloudVideoView view = mTRTCVideoLayout.findCloudViewView(userId, steamType);
        if (view == null) {
            view = mTRTCVideoLayout.allocCloudVideoView(userId, steamType);
        }
        return view;
    }

    @Override
    public void onRemoteViewStatusUpdate(String userId, boolean enable) {
        mTRTCVideoLayout.updateVideoStatus(userId, enable);
    }

    @Override
    public void onSnapshotRemoteView(Bitmap bm) {

    }

    @Override
    public void onPlayEvent(int i, Bundle bundle) {

    }

    @Override
    public void onNetStatus(Bundle bundle) {

    }

    private void onVideoChange(String userId, int streamType, boolean available) {
        if (available) {
            // 首先需要在界面中分配对应的TXCloudVideoView
            TXCloudVideoView renderView = mTRTCVideoLayout.findCloudViewView(userId, streamType);
            if (renderView == null) {
                renderView = mTRTCVideoLayout.allocCloudVideoView(userId, streamType);
            }
            // 启动远程画面的解码和显示逻辑
            if (renderView != null) {
                mTRTCRemoteUserManager.remoteUserVideoAvailable(userId, streamType, renderView);
            }
//            if (!userId.equals(mMainUserId)) {
//                mMainUserId = userId;
//            }
        } else {
            mTRTCRemoteUserManager.remoteUserVideoUnavailable(userId, streamType);
            mTRTCVideoLayout.recyclerCloudViewView(userId, streamType);
//            if (streamType == TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB) {
//                // 辅路直接移除画面，不会更新状态。主流需要更新状态，所以保留
//                mTRTCVideoLayout.recyclerCloudViewView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
//            }
        }
        if (streamType == TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG) {
            // 根据当前视频流的状态，展示相关的 UI 逻辑。
            mTRTCVideoLayout.updateVideoStatus(userId, available);
        }
        mTRTCRemoteUserManager.updateCloudMixtureParams();
    }

    /**
     * 进房间
     */
    private void enterRoom() {
        VideoConfig videoConfig = ConfigHelper.getInstance().getVideoConfig();
        AudioConfig audioConfig = ConfigHelper.getInstance().getAudioConfig();
        mTRTCCloudManager.setSystemVolumeType(mVolumeType);
        videoConfig.setEnableVideo(false);
        audioConfig.setEnableAudio(false);
        videoConfig.setPublishVideo(false);
        // 耳返
        mTRTCCloudManager.enableEarMonitoring(audioConfig.isEnableEarMonitoring());
        mTRTCCloudManager.enterRoom();

    }

    /**
     * 退房
     */
    private void exitRoom() {
        // 退房设置为非录制状态
        ConfigHelper.getInstance().getAudioConfig().setRecording(false);
        mTRTCCloudManager.exitRoom();
        presenter.exitRoom();
        if (isConnected) {
            presenter.disconnectVoice();
        }
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        exitRoom();
        mTRTCCloudManager.destroy();
        mTRTCRemoteUserManager.destroy();
        if (mCdnPlayManager != null) {
            mCdnPlayManager.destroy();
        }
        mBgmManager.destroy();
        if (mAppScene == TRTCCloudDef.TRTC_APP_SCENE_LIVE) {
            TRTCCloud.destroySharedInstance();
        }
        if (timer != null) {
            timer.cancel();
        }
        if (waterMarkTimer != null) {
            waterMarkTimer.cancel();
        }
//        mMainHandler.removeCallbacks(mLoadingTimeoutRunnable);
    }

    @Override
    public String getLiveRoomId() {
        return courseBean.getLiveRoomId();
    }

    //退出直播间接口返回成功
    @Override
    public void onOutSuccessed() {

    }

    // 退出直播间接口返回失败
    @Override
    public void onOutFailed() {

    }

    // 获取课程编号
    @Override
    public String getCourseNumber() {
        return courseBean.getCourseNumber();
    }

    // 获取当前用户userid
    @Override
    public String getSelfUserId() {
        return TIMManager.getInstance().getLoginUser();
    }

    //断开语音完成
    @Override
    public void disconnectVoice() {
        if (listener != null) {
            listener.outOfVoice();
        }
        switchRole(false);
//        mTRTCCloud.switchRole(TRTCCloudDef.TRTCRoleAnchor);
        isConnected = false;
        endTime = System.currentTimeMillis();
        String nickName = (String) SPUtils.get(CourseLiveRoomActivity.this, Constants.SP_KEY_USER_NAME, "");
        CustomMsgBean customMsgBean = new CustomMsgBean();
        customMsgBean.setUserId(userId);
        customMsgBean.setUserName(nickName);
        String data = JsonUtils.serialize(customMsgBean);
        //强烈建议不同类型的消息使用不同的 cmdID，
        sendCustomMsg(data, CustomMsgBean.STUDENT_OUT);
        presenter.getOnVoiceStudentList();
    }

    //查询上麦学生列表 最多显示三个
    @Override
    public void onVoiceStudentList(List<CourseOnVoiceStudentBean> onVoiceStudents) {
        List<NiceImageView> students = new ArrayList<>();
        students.add(ivHead1);
        students.add(ivHead2);
        students.add(ivHead3);
        llCalling.setVisibility(View.GONE);
        for (int i = 0; i < students.size(); i++) {
            students.get(i).setVisibility(View.GONE);
        }

        if (onVoiceStudents != null && onVoiceStudents.size() > 0) {
            //TODO
            llCalling.setVisibility(View.VISIBLE);

            for (int i = 0; i < onVoiceStudents.size(); i++) {
                CourseOnVoiceStudentBean studentBean = onVoiceStudents.get(i);
                GlideEngine.loadImage(students.get(i), studentBean.getHeadFileUrl());
                students.get(i).setVisibility(View.VISIBLE);
            }
        } else {
            llCalling.setVisibility(View.GONE);
        }
    }

    // 获取上下文 context
    @Override
    public Activity getAtyContext() {
        return CourseLiveRoomActivity.this;
    }

    //进入直播间接口返回成功
    @Override
    public void onSuccess(BaseBean baseBean) {
        presenter.getOnVoiceStudentList();
    }

    // 进入直播间接口返回失败
    @Override
    public void onFailed() {
        //TODO
    }

    //横竖屏切换
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            //如果需要可以更改布局
            LogUtils.e("onConfigurationChanged____ORIENTATION_LANDSCAPE");
        } else {
            LogUtils.e("onConfigurationChanged____ORIENTATION_PORTRAIT");
        }
    }


    private ObjectAnimator mObjectAnimator;
    private long mCurrentPlayTime;
    private boolean isRotation = false;
    public static int rotationTime = 2000;

    /**
     * 设置旋转的动画
     */
    public void setAnimation() {
        if (mObjectAnimator == null) {
            mObjectAnimator = ObjectAnimator.ofFloat(ivLoading, "rotation", 0, 360);
            mObjectAnimator.setDuration(rotationTime);
            mObjectAnimator.setInterpolator(new LinearInterpolator());
            mObjectAnimator.setRepeatCount(ObjectAnimator.INFINITE);
        }
        startAnimation();
    }

    /**
     * 暂停旋转
     */
    private void stopAnimation() {
        mCurrentPlayTime = mObjectAnimator.getCurrentPlayTime();
        mObjectAnimator.cancel();
        isRotation = false;
        ivLoading.animate().rotation(0).setDuration(60).start();
//        ivLoading.clearAnimation();
    }

    /**
     * 开始旋转
     */
    private void startAnimation() {
        isRotation = true;
        mObjectAnimator.start();
        mObjectAnimator.setCurrentPlayTime(mCurrentPlayTime);
        mObjectAnimator.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {

            }

            @Override
            public void onAnimationCancel(Animator animator) {

            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
    }
    //附：开启暂停


}
