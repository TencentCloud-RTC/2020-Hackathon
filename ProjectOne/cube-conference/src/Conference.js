import Participant from "./Participant";

const ConferenceCommand = {
    SET_SPEAKER: 'SET_SPEAKER',
    SET_MUTE: 'SET_MUTE',
    BEGIN_INTERACT: 'BEGIN_INTERACT',
    END_INTERACT: 'END_INTERACT',
    RAISE_HAND: 'RAISE_HAND',
    WB_DATA: 'WB_DATA',
    BEGIN_WB: 'BEGIN_WB',
    END_WB: 'END_WB',
};

export default class Conference {
    constructor(user, audioElement, interacted) {
        // 当前会议ID
        this.id = null;
        // 当前用户的参会信息
        this.user = user;
        // 当前用户推流对象
        this.publication = null;
        // 用于保存其他参会人的信息
        this.participants = new Map();
        // 当前语音混码流信息
        this.official = {
            id: null,
            subscription: null
        };
        // 用于保存当前混码流信息
        this.mixedParticipant = new Participant({userId: 'mixed@混码流'});
        // 用于加载全员语音流的元素
        this.audioElement = audioElement;

        // 说话人
        this.speaker = null;
        // 主持人
        this.presenter = null;
        // 主题
        this.subject = null;
        // 当前是否正在互动
        this.interacted = interacted;

        // 当前配置
        this.options = {
            // 当前是否在屏幕分享
            screencast: false,
            video: true,
            videoId: null,
            audioId: null,
            speakerId: null
        };

        // 当前会议信息
        this.info = null;
        // 用于处理私有信令逻辑
        this.dataChannel = null;
    }

    join(license, callback) {
        let data = Helper.conferenceInfo;
        this.speaker = data.speaker.id;
        this.presenter = data.founder.id;
        this.subject = data.subject;
        this.info = data;

        document.title = data.subject;

        this.client = TRTC.createClient(Object.assign({mode: 'rtc'}, license));
        this._startListener();
        this.client.join({roomId: data.rid}).then(() => {
            this.id = data.id;
            this.official.id = data.id + '-common';

            callback(false);

            // 加入数据通道
            this.dataChannel = io.connect(API_URL);
            this.dataChannel.emit('join', {roomId: data.id, userId: this.user.id});
            this._startDataChannelListener();
        }).catch((error) => {
            callback({code: 1003, message: '加入会议失败，请稍后重试！'});
        });
    }

    _addParticipant(entity, noticeJoin) {
        let participant = new Participant(entity, 'viewer'), id = participant.id;
        if (id !== this.user.id) {
            this.participants.set(id, participant);

            if (noticeJoin) this.onJoin(participant);
        }
    }

    _addStream(stream, noticeJoin) {
        let userKey = stream.getUserId();
        let {id} = Participant.parse(userKey);
        if (id === this.official.id) {
            this.mixedParticipant.update(stream);
            if (this.interacted) this.subscribeAudio();
        } else if (id !== this.user.id) {
            let participant = this.participants.get(id);
            if (participant) {
                participant.update(stream);
                if (noticeJoin) this.onBeginInteract(participant);
            } else {
                participant = new Participant(userKey, 'presenter', false);
                this.participants.set(id, participant);
                if (noticeJoin) this.onJoin(participant);
            }
        }
    }

    _getParticipant(origin) {
        let participants = this.participants.values();
        for (let participant of participants) {
            if (origin === participant.origin) return participant;
        }

        return {
            id: origin,
            origin: origin,
            name: origin
        };
    }

    getRoleLabel(id) {
        if (this.presenter === id) return '主持人';
        if (this.speaker === id) return '讲话人';
        return '普通成员';
    }

    subscribeAudio(callback = () => {}) {
        let stream = this.mixedParticipant.stream;
        // 直接订阅全员语音流
        this.client.subscribe(stream, { video: false }).then((subscription) => {
            this.official.subscription = subscription;
            this.audioElement.srcObject = stream.mediaStream;

            callback();
        }, function (error) {
            console.log('[Conference#addParticipant] load all audio failed', error);
        });
    }

    unsubscribeAudio() {
        this.official.subscription.stop();
    }

    _safeParticipant(userKey) {
        let id = userKey.split('@').shift();

        if (id === this.user.id) return this.user;
        return this.participants.get(id) || new Participant({
            userId: userKey
        });
    }

    _removeStream(participant) {
        let id = participant.id;
        if (this.interacted) {
            // 如果当前成员为主持人，则重新设置主持人
            if (this.speaker === id && this.speaker !== this.presenter) {
                this.setSpeaker(this.presenter, false);
                this._changeSpeaker(id, this.presenter);
            }

            if (participant) this.onEndInteract(participant);
        }
    }

    _startListener() {
        this.client.on('error', err => {
            console.error(err);
        });
        this.client.on('client-banned', err => {
            console.error('client has been banned for ' + err);
        });
        this.client.on('peer-join', evt => {
            const userId = evt.userId;
            console.log('peer-join ' + userId);
            this._addParticipant({userId}, true);
        });
        this.client.on('peer-leave', evt => {
            const participant = this._safeParticipant(evt.userId);
            console.log('peer-leave ' + participant.id);

            this.participants.delete(participant.id);
            this.onLeft(participant);
        });
        this.client.on('stream-added', evt => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            const userId = remoteStream.getUserId();
            console.log(`remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`);

            this._addStream(remoteStream, true);
        });
        this.client.on('stream-subscribed', evt => {
            const uid = evt.userId;
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            console.log('stream-subscribed ID: ', id);
        });
        this.client.on('stream-removed', evt => {
            const stream = evt.stream;
            stream.stop();
            let participant = this._safeParticipant(stream.getUserId());
            this._removeStream(participant);
        });

        this.client.on('stream-updated', evt => {
            const remoteStream = evt.stream;
        });

        this.client.on('mute-audio', evt => {
            console.log(evt.userId + ' mute audio');

            let participant = this._safeParticipant(evt.userId);
            participant.onMute('audio');
            this.onMute(participant, 'audio');
        });
        this.client.on('unmute-audio', evt => {
            console.log(evt.userId + ' unmute audio');

            let participant = this._safeParticipant(evt.userId);
            participant.onUnmute('audio');
            this.onUnMute(participant, 'audio');
        });
        this.client.on('mute-video', evt => {
            console.log(evt.userId + ' mute video');

            let participant = this._safeParticipant(evt.userId);
            participant.videoMuted = true;
            participant.onMute('video');
            this.onMute(participant, 'video');
        });
        this.client.on('unmute-video', evt => {
            console.log(evt.userId + ' unmute video');

            let participant = this._safeParticipant(evt.userId);
            participant.videoMuted = false;
            participant.onUnmute('video');
            this.onUnMute(participant, 'video');
        });

    }

    _startDataChannelListener() {
        this.dataChannel.on('chat', (data) => {
            console.log('[Conference#Event] message received -', data);

            let participant = this._safeParticipant(data.origin);
            this.onMessage({
                sender: {
                    id: participant.id,
                    name: participant.name,
                    role: this.getRoleLabel(participant.id)
                },

                time: Date.now(),
                content: data.content
            });
        });

        this.dataChannel.on(ConferenceCommand.SET_SPEAKER, (data) => {
            this._changeSpeaker(this.speaker, data.target);
        });

        this.dataChannel.on(ConferenceCommand.SET_MUTE, (data) => {
            if (data.type === 'mute') {
                UI.showToast('主持人将您设置为禁音');
                this.mute(data.kind);
                this.onMute(this.user, data.kind);
            } else {
                UI.showToast('主持人取消了您的禁音');
                this.unmute(data.kind);
                this.onUnMute(this.user, data.kind);
            }
        });

        this.dataChannel.on(ConferenceCommand.BEGIN_INTERACT, (data) => {
            if (data.target === this.user.id && !this.interacted) {
                this.interacted = true;
                this.user.role = 'presenter';
                this.subscribeAudio();
                this.publish();
                this.onBeginInteract(this.user);
            }
        });

        this.dataChannel.on(ConferenceCommand.END_INTERACT, (data) => {
            if (data.target === this.user.id && this.interacted) {
                this.user.role = 'viewer';
                this.closeInteract(this.user);
            }
        });

        this.dataChannel.on(ConferenceCommand.RAISE_HAND, (data) => {
            this.onRaiseHand(this._safeParticipant(data.target));
        });

        this.dataChannel.on(ConferenceCommand.WB_DATA, (data) => {
            if (this.board) {
                this.board.load([data]);
            }
        });

        this.dataChannel.on(ConferenceCommand.BEGIN_WB, (data) => {
            this.onBeginWhiteboard();
            this._loadWhiteboard();
        });

        this.dataChannel.on(ConferenceCommand.END_WB, (data) => {
            this.onEndWhiteBoard();
        });
    }

    publish(callback = () => {}) {
        let screencast = this.options.screencast;

        // if (this.options.audioId) {
        //     audio.deviceId = this.options.audioId;
        //     audioConstraints.deviceId = this.options.audioId;
        // }
        // if (!screencast && this.options.videoId) {
        //     video.deviceId = this.options.videoId;
        // }

        let startPublish = (videoConstraint) => {
            let options = {
                audio: true,
                userId: this.user.id,
                mirror: true
            };
            if (screencast) {
                options.screen = true;
            } else {
                options.video = videoConstraint;
            }
            let stream = TRTC.createStream(options);
            stream.initialize().then(() => {
                console.log('initialize local stream success');

                if (this.publication) {
                    this.publication.stop();
                }

                this.user.unsubscribe();

                this.user.stream = stream;
                this.onUserMediaReady(this.user);

                this.client.publish(stream).then(() => {
                    console.log('推流成功');

                    // this.publication = publication;
                    // mixStream(this.id, publication.id, 'common');
                    callback();
                });
            }).catch((error) => {
                console.error('[Conference#publish] Failed to create MediaStream -', error);

                if (!screencast) {
                    if (videoConstraint) {
                        startPublish(false, undefined);
                    } else {
                        UI.alert('没有检测到可用的麦克风设备，您可以继续观看会议但无法讲话');
                    }
                }
                callback(error);
            });
        };

        if (this.user.stream) {
            this.client.unpublish(this.user.stream).then(() => {
                startPublish(true);
            }).catch(() => {
                startPublish(true);
            });
        } else {
            startPublish(true);
        }
    }

    mute(kind) {
        if (kind === 'audio') {
            this.user.stream.muteAudio();
        } else {
            this.user.stream.muteVideo();
        }
    }

    unmute(kind) {
        if (kind === 'audio') {
            this.user.stream.unmuteAudio();
        } else {
            this.user.stream.unmuteVideo();
        }
    }

    muteAll() {
        this.participants.forEach((participant) => {
            let stream = participant.stream;
            if (stream) {
                stream.muteAudio();
            } else {
                stream.muteVideo();
            }
        });
    }

    unMuteAll() {
        this.participants.forEach((participant) => {
            let stream = participant.stream;
            if (stream) {
                stream.unmuteAudio();
            } else {
                stream.unmuteVideo();
            }
        });
    }

    leave() {
        this.client.leave();
    }

    isSpeaker() {
        return this.speaker === this.user.id;
    }

    isPresenter() {
        return this.presenter === this.user.id;
    }

    setSpeaker(speaker, notice = true) {
        if (this.presenter === this.user.id) {
            this.info.speaker = speaker;

            if (notice) {
                // 通知服务器进行演讲人变更
                this.sendCommand(ConferenceCommand.SET_SPEAKER, {
                    target: speaker,
                    nickname: this._safeParticipant(speaker).name
                });
            }

            this._changeSpeaker(this.speaker, speaker);
            return true;
        }
    }

    beginInteract(uid) {
        if (this.presenter === this.user.id) {
            this.sendCommand(ConferenceCommand.BEGIN_INTERACT, {
                target: uid
            });
        }
    }

    endInteract(uid) {
        if (this.presenter === this.user.id) {
            this.sendCommand(ConferenceCommand.END_INTERACT, {
                target: uid
            });
        }
    }

    raiseHand() {
        this.sendCommand(ConferenceCommand.RAISE_HAND, {
            target: this.user.id
        });
    }

    enableScreencast(callback) {
        if (!this.options.screencast) {
            this.options.screencast = true;
            this.publish((error) => {
                if (error) this.options.screencast = false;

                callback(error);
            });
        }

    }

    disableScreencast(callback) {
        if (this.options.screencast) {
            this.options.screencast = false;
            this.publish((error) => {
                callback(error);
            });
        }
    }

    sendCommand(name, data, to) {
        let cmd = {name, data};
        if (to != null) {
            cmd.to = to;
        }
        this.dataChannel.emit('COMMAND', cmd);
    }

    sendMessage(content) {
        this.dataChannel.emit('chat', content);
    }

    _changeSpeaker(lastSpeakerId, newSpeakerId) {
        this.speaker = newSpeakerId;


        // 取消旧主讲人的高清流订阅
        let lastSpeaker = this._safeParticipant(lastSpeakerId);
        // 让新主讲人订阅高清流
        let newSpeaker = this._safeParticipant(newSpeakerId);

        if (this.user.role !== 'viewer') {
            lastSpeaker.reduce();
            newSpeaker.advance();
        }

        this.onEndWhiteBoard();
        this.onSpeakerChange(lastSpeaker, newSpeaker);
    }

    toggleInteract(participant) {
        if (participant.role === 'viewer') {
            participant.role = 'presenter';
            this.beginInteract(participant.id);
        } else {
            participant.role = 'viewer';
            this.endInteract(participant.id);
        }
    }

    muteMember(kind, participant) {
        if (this.isPresenter()) {
            this.sendCommand(ConferenceCommand.SET_MUTE, {
                type: 'mute',
                kind: kind
            }, participant.origin);
        }
    }

    unmuteMember(kind, participant) {
        if (this.isPresenter()) {
            this.sendCommand(ConferenceCommand.SET_MUTE, {
                type: 'unmute',
                kind: kind
            }, participant.origin);
        }
    }

    muteAllMember(kind) {
        if (this.isPresenter()) {
            this.sendCommand(ConferenceCommand.SET_MUTE, {
                type: 'mute',
                kind: kind
            });
        }
    }

    setWhiteboard(enable) {
        if (enable) {
            this.sendCommand(ConferenceCommand.BEGIN_WB, {});
            this.onBeginWhiteboard();
            this._loadWhiteboard();
        } else {
            this.sendCommand(ConferenceCommand.END_WB, {});
            this.onEndWhiteBoard();
        }
    }

    closeInteract() {
        this.interacted = false;
        this.unsubscribeAudio();

        if (this.publication) {
            this.publication.stop();
        }
        this.user.unsubscribe();

        this.onEndInteract(this.user);
    }

    _loadWhiteboard() {
        let {create, Pen, Rect, Ellipse, Arrow, Mosaic, Text, Crop} = SPGraphic;

        let record = [];
        if (this.board) {
            record = this.board.record;
            this.board.dispose();
        }

        this.board = create(document.getElementById('wb_view'), {enableTouchScroll: true});
        this.board.load(record);
        this.board.onchange = (data) => {
            // 如果是主持人，则需要同步信息给其他人
            if (this.isPresenter()) {
                this.sendCommand(ConferenceCommand.WB_DATA, data);
            }
        };

        function active(id) {
            let node = $('#graphic_tools .wb-menu.active');
            if (node) node.classList.remove('active');
            $.get(id).classList.add('active');
        }
        $.get('clear_btn').onclick = () => {
            this.board.clear();
        };
        $.get('pen').onclick = () => {
            active('pen');
            this.board.select(new Pen());
        };
        $.get('rect').onclick = () => {
            active('rect');
            this.board.select(new Rect());
        };
        $.get('ellipse').onclick = () => {
            active('ellipse');
            this.board.select(new Ellipse());
        };
        $.get('arrow').onclick = () => {
            active('arrow');
            this.board.select(new Arrow());
        };
        $.get('image').onclick = () => {
            let node = document.createElement('input');
            node.type = 'file';
            node.accept = 'image/png,image/jpeg';
            node.onchange = () => {
                let reader = new FileReader();
                reader.onload =(evt) => {
                    let img = new Image();
                    img.src = evt.target.result;
                    this.board.setImage(img);
                };
                reader.readAsDataURL(node.files[0]);
            };
            node.click();
        };
        $.get('mosaic').onclick = () => {
            active('mosaic');
            this.board.select(new Mosaic());
        };
        $.get('text').onclick = () => {
            active('text');
            this.board.select(new Text());
        };
        $.get('undo').onclick = () => {
            this.board.undo();
        };
        $.get('save').onclick = () => {
            let link = document.createElement('a');
            link.download = this.subject + '_白板.png';
            link.href = this.board.save();
            link.click();
        };
        $.get('enlarge').onclick = () => {
            this.board.zoomIn(0.1);
        };
        $.get('reduction').onclick = () => {
            this.board.zoomOut(0.1);
        };
        $.get('deselect').onclick = () => {
            active('deselect');
            this.board.deselect();
        };
    }

    onMute() { }

    onUnMute() { }

    onJoin() { }

    onLeft() { }

    onRaiseHand() { }

    onMessage() { }

    onSpeakerChange() { }

    onBeginInteract() { }

    onEndInteract() { }

    onBeginWhiteboard() { }

    onEndWhiteBoard() { }

    onUserMediaReady() { }
}
