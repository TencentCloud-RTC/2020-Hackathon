import UI from "./UI";

const ViewLayout = {
    LECTURE: 'lecture',
    FLUID: 'fluid'
};

// 打开直播
function openLive() {
    // 开启直播
    getLiveStream(roomId, (error, live) => {
        if (error) {
            UI.showToast('网络错误，请稍后重试');
        } else if (!live) {
            createLiveStream(roomId, (error, live) => {
                if (error) {
                    UI.showToast('开启直播失败');
                }
            });
        }
    });
}

export default class ViewManager {
    constructor() {
        this.layout = ViewLayout.LECTURE;

        this.$speaker = $.get('master');
        this.$watcher = $.get('members');
        this.$fluid = $.get('mcu_view');
    }

    init(interacted, enableLive) {
        if (interacted) {
            window.conference.publish(() => {
                if (enableLive && window.conference.isPresenter()) {
                    openLive();
                }
            });
            this.load();
        } else if (IsPC()) {
            this.showLiveView();
        }
    }

    load() {
        // 初始化默认布局
        $('main').className = this.layout;
        if (this.layout === ViewLayout.LECTURE) {
            let {participants} = window.conference;
            participants.forEach((participant) => {
                this.add(participant);
            });
        } else {
            this.render(window.conference.mixedParticipant);
        }
    }

    add(participant) {
        // 如果是演讲模式才添加，否则不添加
        if (this.layout === ViewLayout.LECTURE && window.conference.interacted) {
            if (participant.role !== 'viewer') {
                participant.onMute = (kind) => {
                    let el = $.get(participant.id);
                    if (el) el.classList.add('mute-' + kind);
                };
                participant.onUnmute = (kind) => {
                    let el = $.get(participant.id);
                    if (el) el.classList.remove('mute-' + kind);
                };

                this.render(participant);
            }
        }
    }

    del(participant) {
        let dom = document.getElementById(participant.id);
        if (dom) dom.remove();
        if (this.$watcher.childElementCount <= 1) {
            this.$watcher.classList.add('empty');
        }
        if (this.$speaker.childElementCount <= 1) {
            this.$speaker.classList.add('empty');
        }
    }

    setLayout(layout) {
        if (this.layout === layout) return;

        this.layout = layout;
        // 变更布局按钮样式
        this.changeLayoutMenu(layout);
        // 删除所有视频元素
        $.remove('main .viewer');

        if (layout === ViewLayout.LECTURE) {
            // 取消混码流订阅
            window.conference.mixedParticipant.unsubscribe();

            // 加载本地视频
            this.render(window.conference.user);
        } else {
            // 取消所有成员的流订阅
            window.conference.participants.forEach(part => part.unsubscribe());
        }

        // 更改布局样式
        $('main').className = layout;
        // 重新加载画面
        this.load();
    }

    render(participant) {
        let dom = document.createElement('div');
        dom.id = participant.id;
        dom.className = 'viewer' + (participant.banker ? ' local' : '') + ' ' + participant.source + (participant.videoMuted ? ' mute-video' : '');

        let video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;

        // 订阅流
        participant.subscribe(dom);

        // 如果是混码则添加到混码的容器中
        if (participant.id === 'mixed') {
            this.$fluid.appendChild(dom);
        } else {
            let isSpeaker = participant.id === window.conference.speaker;
            let nickname = participant.banker ? (isSpeaker ? '你' : '我') : participant.name;

            let panel = UI.node('div', 'panel');

            let substance = UI.node('div', 'substance');
            substance.appendChild(UI.node('div', 'nickname', nickname));
            substance.appendChild(UI.node('div', 'message', ''));

            let info = UI.node('div', 'info');
            info.appendChild(UI.node('div', 'nickname', nickname));

            let operate = UI.node('div', 'operate');
            let more = UI.node('div', 'more');
            operate.appendChild(more);

            more.onclick = (e) => {
                let el = document.getElementById('user_control_panel');
                el.dataset.uid = participant.id;
                UI.showPanel('user_control_panel', more);
            };

            panel.appendChild(substance);
            panel.appendChild(info);
            panel.appendChild(operate);
            dom.appendChild(panel);

            if (isSpeaker) {
                this.$speaker.classList.remove('empty');
                this.$speaker.appendChild(dom);
            } else {
                this.$watcher.classList.remove('empty');
                this.$watcher.appendChild(dom);
            }
        }
    }

    changeLayoutMenu(layout) {
        $('.configure .layout .active').classList.remove('active');
        $('.configure .layout .' + layout).classList.add('active');
    }

    changeSpeaker(lastSpeaker, newSpeaker) {
        if (this.layout === ViewLayout.LECTURE) {
            this.$watcher.appendChild(document.getElementById(lastSpeaker.id));
            this.$speaker.appendChild(document.getElementById(newSpeaker.id));
        }

        let conference = window.conference, user = conference.user;
        if (!conference.isPresenter()) {
            let nickname = newSpeaker.id === user.id ? '你' : newSpeaker.name;
            UI.noticeMessage(nickname + '被设置成了发言人');
        }
    }

    openInteract() {
        $.get('live_view').style.display = 'none';
        $.get('live_interact').style.display = 'flex';
        if (this.livePlayer) {
            if (IsPC()) {
                this.livePlayer.dispose();
            } else {
                this.livePlayer.destroy();
            }
            this.livePlayer = null;
        }

        this.layout = ViewLayout.LECTURE;
        // 变更布局按钮样式
        this.changeLayoutMenu(ViewLayout.LECTURE);
        // 删除所有视频元素
        $.remove('main .viewer');
        // 更改布局样式
        $('main').className = ViewLayout.LECTURE;
        // 更新画面模式
        this.showMeetView();
        // 重新加载画面
        this.load();
    }

    closeInteract() {
        $.get('live_view').style.display = '';
        $.get('live_interact').style.display = '';

        // 取消所有订阅
        if (this.layout === ViewLayout.LECTURE) {
            // 取消混码流订阅
            window.conference.mixedParticipant.unsubscribe();
        } else {
            // 取消所有成员的流订阅
            window.conference.participants.forEach(part => part.unsubscribe());
        }
        // 删除所有视频元素
        $.remove('main .viewer');
        this.showLiveView();
    }

    showMeetView() {
        $.get('main').classList.remove('live');
        $.get('header').classList.remove('live');
        $.get('footer').classList.remove('live');
        $.get('watch_live_bar').style.display = '';
    }

    showLiveView() {
        $.get('main').classList.add('live');
        $.get('header').classList.add('live');
        $.get('footer').classList.add('live');
        $.get('watch_live_bar').style.display = 'flex';

        if (IsPC()) {
            let source = location.protocol + "//pull.shixincube.cn/live/" + roomId + ".flv";
            // 播放直播画面
            let player = new Aliplayer({
                    "id": "live_view",
                    "source": source,
                    "width": "100%",
                    "height": "100%",
                    "autoplay": true,
                    "isLive": true,
                    "rePlay": false,
                    "playsinline": true,
                    "preload": true,
                    "enableStashBufferForFlv": true,
                    "stashInitialSizeForFlv": 32,
                    "controlBarVisibility": "hover",
                    "useH5Prism": true,
                    "skinLayout": [
                        {
                            "name": "bigPlayButton",
                            "align": "blabs",
                            "x": 30,
                            "y": 80
                        },
                        {
                            "name": "errorDisplay",
                            "align": "tlabs",
                            "x": 0,
                            "y": 0
                        },
                        {
                            "name": "infoDisplay"
                        },
                        {
                            "name": "controlBar",
                            "align": "blabs",
                            "x": 0,
                            "y": 0,
                            "children": []
                        }
                    ]
                }, function (player) {
                    console.log("The player is created");
                }
            );

            function handelCanplay() {
                player.off('canplay', handelCanplay);
                let el = $('#live_view .tips');
                if (el) el.remove();
            }
            player.on('canplay', handelCanplay);
            this.livePlayer = player;
        } else {
            let source = location.protocol + "//pull.shixincube.cn/live/" + roomId + ".m3u8";
            let player = new TcPlayer('live_view', {
                "flv":  location.protocol + "//pull.shixincube.cn/live/" + roomId + ".flv",
                "m3u8": source,
                "autoplay" : true,
                "width" :  '100%',
                "height" : '100%',
                "live": true,
                "x5_player": true,
                listener: function (msg) {
                    // console.log('listener',msg);
                    if(msg.type === 'error'){
                        window.setTimeout(function(){
                            player.load();
                        },2000);
                    } else if (msg.type === 'play') {
                        let el = $('#live_view .tips');
                        if (el) el.remove();
                    }
                }
            });

            this.livePlayer = player;
        }
    }
}
