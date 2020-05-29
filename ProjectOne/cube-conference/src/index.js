import Helper from "./Helper";
import UI from "./UI";
import ChatModel from "./models/ChatModel";
import ProfileModel from "./models/ProfileModel";
import SettingModel from "./models/SettingModel";
import MembersModel from "./models/MembersModel";
import ScanModal from "./models/ScanModal";
import Conference from "./Conference";
import ViewManager from "./ViewManager";

window.Helper = Helper;
window.UI = UI;
window.ChatModel = ChatModel;
window.ProfileModel = ProfileModel;
window.SettingModel = SettingModel;
window.MembersModel = MembersModel;
window.ScanModal = ScanModal;

// 监听按钮事件
function bindControl(action, callback, switchable = true) {
    document.querySelector('footer .menu.' + action + ' .bar').onclick = switchable ? function (e) {
        let el = e.currentTarget.parentElement;
        let cl = el.classList;
        if (cl.contains('active')) {
            cl.remove('active');
            callback(false, el);
        } else {
            cl.add('active');
            callback(true, el);
        }
    } : callback;
}

function requestConnect(user, password, callback) {
    $post(Action.Connect, {id: roomId, nickname: user.name, password}, function (error, license) {
        if (error) {
            if (error.code === 1003) {
                UI.alert('会议密码输入错误，请重试', () => {
                    UI.prompt('请输入会议密码', (confirm, pwd) => {
                        requestConnect(user, pwd, callback);
                    });
                });
            } else {
                UI.alert('进入会议失败，' + error.msg);
            }
        } else {
            callback(user, license);
        }
    });
}

function connect(role, callback) {
    if (Helper.conferenceInfo.password) {
        UI.prompt('请输入会议密码', (confirm, password) => {
            Helper.getUserInfo(role, (user) => {
                requestConnect(user, password, callback);
            });
        });
    } else {
        Helper.getUserInfo(role, (user) => {
            requestConnect(user, null, callback);
        });
    }
}

function startup(role) {
    if (typeof roomId !== 'string') {
        location.replace('./index.html');
        return;
    }

    // 关闭选择入会模式的弹窗
    $.get('enter_modal').style.display = 'none';
    if (role === 'viewer') {
        $.get('main').classList.add('live');
        $.get('header').classList.add('live');
        $.get('footer').classList.add('live');
    }

    let enableLive = Helper.conferenceInfo.live;
    connect(role, (user, license) => {
        // 用于管理会议
        let conference = new Conference(user, document.getElementById('conference_audio'), role !== 'viewer');
        // 用于管理视图
        let viewer = new ViewManager();
        if (!IsPC()) {
            viewer.showLiveView();
        }

        // 将用户昵称显示到页面上
        UI.setUsername(user.name);

        conference.onJoin = (participant) => {
            UI.noticeMessage(participant.name + '进入了会议');
            viewer.add(participant);

            MembersModel.join(participant);
        };

        conference.onLeft = (participant) => {
            UI.noticeMessage(participant.name + '退出了会议');
            viewer.del(participant);

            MembersModel.leave(participant);
        };

        conference.onMessage = (message) => {
            ChatModel.appendMessage(message);
        };

        conference.onUserMediaReady = (participant) => {
            viewer.del(participant);
            viewer.render(participant);
        };

        conference.onSpeakerChange = (lastSpeaker, newSpeaker) => {
            viewer.changeSpeaker(lastSpeaker, newSpeaker);
        };

        conference.onBeginInteract = (participant) => {
            if (participant.id === conference.user.id) {
                viewer.openInteract();
            } else {
                viewer.add(participant);
            }

            MembersModel.update(participant);
        };

        conference.onEndInteract = (participant) => {
            viewer.del(participant);
            if (participant.id === conference.user.id) {
                viewer.closeInteract();
            }

            MembersModel.update(participant);
        };

        conference.onBeginWhiteboard = () => {
            $.get('wb_view').style.display = 'block';
            $.get('graphic_tools').style.display = conference.isSpeaker() ? 'flex' : '';
        };

        conference.onEndWhiteBoard = () => {
            $.get('wb_view').style.display = '';
            $.get('enable_wb_btn').classList.remove('active');
        };

        conference.onRaiseHand = (participant) => {
            UI.noticeMessage(participant.name + '开始举手');
        };

        conference.onMute = (participant, kind) => {
            let label = kind === 'audio' ? 'voice' : 'camera';
            if (participant.id === conference.user.id) {
                $('#footer .console .' + label).classList.add('active');
            } else {
                MembersModel.updateMuteState(participant, kind, true);
            }
        };

        conference.onUnMute = (participant, kind) => {
            let label = kind === 'audio' ? 'voice' : 'camera';
            if (participant.id === conference.user.id) {
                $('#footer .console .' + label).classList.remove('active');
            } else {
                MembersModel.updateMuteState(participant, kind, false);
            }
        };

        conference.join(license, (error) => {
            if (error) {
                UI.alert(error.message, () => {
                    location.replace('./index.html');
                });
            } else {
                viewer.init(role !== 'viewer', enableLive);
            }
        });

        // 绑定关闭语音菜单点击事件
        bindControl('voice', (active) => {
            if (active) {
                conference.mute('audio');
            } else {
                conference.unmute('audio');
            }
        });
        // 绑定关闭摄像头菜单点击事件
        bindControl('camera', (active, menu) => {
            let el = document.getElementById(conference.user.id);

            this.disableVideo = active;
            if (active) {
                conference.mute('video');
                menu.querySelector('.label').textContent = '打开摄像头';
                if (el) el.classList.add('mute-video');
            } else {
                conference.unmute('video');
                menu.querySelector('.label').textContent = '关闭摄像头';
                if (el) el.classList.remove('mute-video');
            }
        });
        // 绑定屏幕分享按钮事件
        let lock = false;
        bindControl('screen', (e) => {
            if (!lock) {
                lock = true;

                let el = e.currentTarget.parentElement;
                let cl = el.classList;
                if (cl.contains('active')) {
                    cl.remove('active');

                    el.querySelector('.label').textContent = '共享窗口';
                    conference.disableScreencast(() => {
                        lock = false;
                    });
                } else {
                    cl.add('active');

                    el.querySelector('.label').textContent = '关闭共享';
                    conference.enableScreencast((error) => {
                        lock = false;
                        if (error) {
                            el.classList.remove('active');
                            el.querySelector('.label').textContent = '共享窗口';
                        }
                    })
                }
            }
        }, false);

        // 绑定要求好友按钮事件
        bindControl('invite', (active, el) => {
            UI.showPanel('invite_panel', el);
        });

        // 绑定全员静音按钮事件
        bindControl('mute-all', (active, el) => {
            if (active) {
                el.querySelector('.label').textContent = '打开声音';
                conference.muteAll();
            } else {
                el.querySelector('.label').textContent = '全员静音';
                conference.unMuteAll();
            }
        });

        // 绑定白板分享按钮事件
        bindControl('wb', (e) => {
            if (conference.isSpeaker()) {
                let el = e.currentTarget.parentElement;
                let cl = el.classList;
                if (cl.contains('active')) {
                    cl.remove('active');
                    el.querySelector('.label').textContent = '白板演示';
                    $.get('wb_view').style.display = '';

                    conference.setWhiteboard(false);
                } else {
                    cl.add('active');
                    el.querySelector('.label').textContent = '关闭白板';
                    $.get('wb_view').style.display = 'block';

                    conference.setWhiteboard(true);
                }
            } else {
                UI.alert('您当前不是主讲人，无法进行白板演示');
            }

        }, false);

        // 绑定全员静音按钮事件
        bindControl('sound', (active, el) => {
            if (active) {
                el.querySelector('.label').textContent = '打开扬声器';
                if (IsPC()) {
                    viewer.livePlayer.setVolume(0);
                } else {
                    viewer.livePlayer.volume(0);
                }
            } else {
                el.querySelector('.label').textContent = '关闭扬声器';
                if (IsPC()) {
                    viewer.livePlayer.setVolume(1);
                } else {
                    viewer.livePlayer.volume(1);
                }
            }
        });

        // 绑定布局切换按钮事件
        bindControl('lecture', () => {
            viewer.setLayout('lecture');
        }, false);
        bindControl('fluid', () => {
            UI.showToast('当前会议模式不支持自由切换布局');
            // viewer.setLayout('fluid');
        }, false);


        // 绑定分享到好友按钮事件
        $('#invite_panel .link').onclick = () => {
            navigator.clipboard.writeText(location.href);
            UI.showToast('会议链接已复制，赶快分享给好友吧');
        };
        $('#invite_panel .keychain').onclick = () => {
            navigator.clipboard.writeText(roomId);
            UI.showToast('会议号码已复制，赶快分享给好友吧');
        };
        $('#invite_panel .scan').onclick = () => {
            ScanModal.open();
        };

        // 绑定设置为主讲人按钮事件
        $('#user_control_panel .upper').onclick = (e) => {
            let uid = $.get('user_control_panel').dataset.uid;
            if (!conference.setSpeaker(uid)) {
                UI.showToast('您不是主持人，无法进行此操作');
            }
        };

        // 全员禁麦按钮事件
        $('#all_member_mute').onclick = (e) => {
            conference.muteAllMember('audio');
        };

        // 开放所有控制菜单
        $.removeClass('.console .menu, .configure .layout', 'disabled');

        window.conference = conference;
    });
}

window.startup = startup;

