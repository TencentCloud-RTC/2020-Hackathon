(function () {
    let cubepack_require = function (index) {
        return cubepack_modules[index]();
    };let cubepack_modules = [function () {
        let cubepack_exports = {};

        cubepack_exports = class Participant {
            constructor(entity, role = 'unknown', banker = false) {
                let keys = entity.userId.split('@');

                this.id = keys.shift();
                this.name = keys.join('');
                this.origin = this.id;
                this.role = role;
                this.banker = banker;

                this.stream = null;

                this.videoMuted = false;
                this.uninitialized = true;

                this.videoElement = null;
            }

            static parse(key) {
                let keys = key.split('@');
                return { id: keys.shift(), name: keys.join('') };
            }

            update(stream) {
                this.role = 'presenter';
                this.stream = stream;

                if (this.videoElement) {
                    let videoElement = this.videoElement;
                    this.unsubscribe();
                    this.subscribe(videoElement);
                }
            }

            advance() {
                if (!this.banker && this.role !== 'unknown') {
                    // applyOptions({
                    //     video: {
                    //         resolution: this._getResolution(true),
                    //         frameRate: 30
                    //     }
                    // });
                }
            }

            reduce() {
                if (!this.banker && this.role !== 'unknown') {
                    // applyOptions({
                    //     video: {
                    //         resolution: this._getResolution(false),
                    //         frameRate: 30
                    //     }
                    // });
                }
            }

            _getResolution(isSpeaker) {
                // return isSpeaker ? {
                //     width: 640,
                //     height: 360
                // } : {
                //     width: 320,
                //     height: 180
                // };
                return true;
            }

            subscribe(videoElement) {
                this.videoElement = videoElement;
                if (this.banker) {
                    this.stream.play(videoElement);
                } else {
                    let { speaker, client } = window.conference,
                        stream = this.stream;
                    let options = { audio: true, video: true, screen: true };

                    client.subscribe(stream, options).then(() => {
                        stream.play(videoElement);
                    }, function (error) {
                        console.log('Load stream failed', error);
                    });
                }
            }

            unsubscribe() {
                if (this.banker) {
                    if (this.stream) this.stream.stop();
                } else {
                    if (this.stream) conference.client.unsubscribe(this.stream);
                }
                this.videoElement = null;
            }

            get source() {
                return '';
            }

            onMute(kind) {}

            onUnmute(kind) {}
        };

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Participant = cubepack_require(0);

        cubepack_exports = function () {
            // 用于生成用户头像颜色
            const AvatarColors = ['darkslateblue', 'brown', 'steelblue', 'cadetblue', 'royalblue', 'seagreen', 'darkseagreen', 'orangered', 'coral'];
            // 用于存储用户ID
            const STORAGE_ID = 'CONFERENCE_USER_ID';
            // 用于存储用户昵称
            let STORAGE_NAME = 'CONFERENCE_NICKNAME_' + window.roomId;
            // 用于存储直播状态
            let ENABLE_LIVE = 'ENABLE_LIVE_' + window.roomId;
            // 用于存储用户信息
            let user = null;
            let avatars = new Map(),
                colors = AvatarColors.concat();

            return {
                conferenceInfo: null,

                init(info) {
                    this.conferenceInfo = info;
                },

                randomUUID() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        let r = Math.random() * 16 | 0,
                            v = c === 'x' ? r : r & 0x3 | 0x8;
                        return v.toString(16);
                    });
                },

                randomName() {
                    let start = ['快乐', '可爱', '自信', '任性', '聪明', '美好', '感性', '忧伤', '无聊', '空虚', '好奇', '多愁善感', '乐于助人', '无可救药', '迷人', '性感', '啥也不是', '沉默'];
                    let middle = ['小', '', ''];
                    let end = ['桔子', '葡萄', '菠萝', '橙子', '草莓', '哈密瓜', '西瓜', '冬瓜', '熊猫', '老虎', '狮子', '鳄鱼', '兔子', '哈士奇', '猫咪', '白菜', '萝卜', '番茄'];
                    return start[Math.floor(Math.random() * start.length)] + '的' + middle[Math.floor(Math.random() * middle.length)] + end[Math.floor(Math.random() * end.length)];
                },

                getUserInfo(role, callback) {
                    if (user === null) {
                        let id = this.conferenceInfo.uid,
                            name = localStorage.getItem(STORAGE_NAME);

                        user = new Participant({
                            userId: id + '@' + name
                        }, role, true);

                        if (name == null) {
                            user.name = null;
                            UI.prompt("请输入参会昵称：", (confirm, text) => {
                                if (confirm && text.length > 0) {
                                    localStorage.setItem(STORAGE_NAME, text);
                                    user.name = text;
                                } else {
                                    user.name = this.randomName();
                                }

                                callback(user);
                            });

                            return;
                        }
                    }

                    callback(user);
                },

                getConferenceInfo(user, callback) {
                    callback(false, this.conferenceInfo);
                },

                getUserAvatar(uid) {
                    if (!avatars.has(uid)) {
                        let color = colors.shift();
                        avatars.set(uid, color);
                        if (colors.length === 0) {
                            colors = AvatarColors.concat();
                        }
                    }
                    return avatars.get(uid);
                }
            };
        }();

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        function $(selector) {
            return document.querySelector(selector);
        }

        $.get = function (id) {
            return document.getElementById(id);
        };

        $.remove = function (selector) {
            let nodes = document.querySelectorAll(selector);
            if (nodes) {
                nodes.forEach(node => node.remove());
            }
        };

        $.removeClass = function (selector, className) {
            let nodes = document.querySelectorAll(selector);
            if (nodes) {
                nodes.forEach(node => node.classList.remove(className));
            }
        };

        window.$ = $;

        cubepack_exports = {
            noticeTimer: null,

            node(tagName, className, content) {
                let node = document.createElement(tagName);
                node.className = className;
                if (typeof content === 'string') {
                    node.textContent = content;
                } else if (content instanceof Node) {
                    node.appendChild(content);
                }
                return node;
            },

            empty(node) {
                while (node.firstChild) {
                    node.firstChild.remove();
                }
            },

            offset(node) {
                let x = 0,
                    y = 0,
                    parent = node;
                while (parent) {
                    x += parent.offsetLeft;
                    y += parent.offsetTop - parent.scrollTop;
                    parent = parent.offsetParent;
                }
                return {
                    x, y,
                    get bottom() {
                        return window.innerHeight - (y + node.offsetHeight);
                    },
                    get right() {
                        return window.innerWidth - (x + node.offsetWidth);
                    }
                };
            },

            showModal(content, type, callback) {
                let mask = document.createElement('div');
                mask.id = 'mask';

                let modal = document.createElement('div');
                modal.className = 'model';

                let body = document.createElement('div');
                body.className = 'content';

                if (type === 'prompt') {
                    let label = document.createElement('div');
                    label.className = 'label';
                    label.textContent = content;

                    let input = document.createElement('input');
                    input.type = 'text';
                    input.autofocus = true;

                    body.appendChild(label);
                    body.appendChild(input);
                } else {
                    body.textContent = content;
                }

                let menus = document.createElement('div');
                menus.className = 'menus';

                if (type !== 'alert') {
                    let cancel = document.createElement('div');
                    cancel.className = 'btn cancel';
                    cancel.textContent = '取消';
                    cancel.onclick = function () {
                        mask.remove();
                        if (typeof callback === 'function') callback(false);
                    };
                    menus.appendChild(cancel);
                }

                let confirm = document.createElement('div');
                confirm.className = 'btn confirm';
                confirm.textContent = '确定';
                confirm.onclick = function () {
                    mask.remove();
                    if (typeof callback === 'function') {
                        let input = body.querySelector('input');
                        if (input) {
                            callback(true, input.value);
                        } else {
                            callback(true);
                        }
                    }
                };

                menus.appendChild(confirm);
                modal.appendChild(body);
                modal.appendChild(menus);
                mask.appendChild(modal);
                document.body.appendChild(mask);
            },

            alert(message, callback = () => {}) {
                this.showModal(message, 'alert', callback);
            },

            confirm(message, callback) {
                this.showModal(message, 'confirm', callback);
            },

            prompt(message, callback) {
                this.showModal(message, 'prompt', callback);
            },

            showToast(message) {
                let node = this.node('div', 'ui-toast', this.node('div', 'text', message));
                document.body.appendChild(node);

                setTimeout(() => {
                    node.classList.add('disabled');
                    setTimeout(() => {
                        node.remove();
                    }, 500);
                }, 3000);
            },

            showPanel(id, btn) {
                let panel = document.getElementById(id);

                if (!panel.classList.contains('on')) {
                    let [horizontal, vertical] = (panel.dataset.align || 'center-top').split('-');
                    let offsetX = Number(panel.dataset.x || 0),
                        offsetY = Number(panel.dataset.y || 20);
                    let point = this.offset(btn);
                    panel.classList.add('on');
                    panel.style.visibility = 'hidden';
                    switch (horizontal) {
                        case 'center':
                            panel.style.left = Math.floor(point.x + btn.clientWidth / 2 - panel.offsetWidth / 2) + offsetX + 'px';
                            break;
                        case 'left':
                            panel.style.left = point.x + offsetX + 'px';
                            break;
                        case 'right':
                            panel.style.right = point.right + offsetX + 'px';
                            break;
                    }

                    switch (vertical) {
                        case 'top':
                            panel.style.bottom = point.bottom + btn.offsetHeight + offsetY + 'px';
                            break;
                        case 'bottom':
                            panel.style.top = point.y + btn.offsetHeight + offsetY + 'px';
                            break;
                    }

                    panel.style.visibility = '';
                    function listener() {
                        setTimeout(() => {
                            document.body.removeEventListener('mouseup', listener, true);
                            panel.classList.remove('on');
                            panel.style.top = '';
                            panel.style.bottom = '';
                        });
                    }
                    document.body.addEventListener('mouseup', listener, true);
                }
            },

            showContextMenu(id, e) {
                let panel = document.getElementById(id);

                if (!panel.classList.contains('on')) {
                    panel.classList.add('on');
                    panel.style.visibility = 'hidden';
                    panel.style.left = e.pageX + 'px';
                    panel.style.top = e.pageY + 'px';

                    panel.style.visibility = '';
                    function listener() {
                        setTimeout(() => {
                            document.body.removeEventListener('mouseup', listener, true);
                            panel.classList.remove('on');
                            panel.style.left = '';
                            panel.style.top = '';
                        });
                    }
                    document.body.addEventListener('mouseup', listener, true);
                }
            },

            setUsername(name) {
                if (typeof name === 'string') document.querySelector('header nav a.profile span').textContent = name;
            },

            setSubject(subject) {
                document.title = subject;
            },

            noticeMessage(message) {
                clearTimeout(this.noticeTimer);
                let node = document.querySelector('header .prompt');
                node.querySelector('.text').textContent = message;
                node.classList.add('active');

                this.noticeTimer = setTimeout(() => {
                    node.classList.remove('active');
                }, 3000);
            }
        };

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        cubepack_exports = class Model {
            constructor(id) {
                this.id = id;
            }

            open(model) {
                if (!model.classList.contains('on')) {
                    model.classList.add('on');

                    this.onOpen(model);
                }
            }

            close() {
                let model = $.get(this.id);
                model.classList.remove('on');
                this.onClose(model);
            }

            onInit() {}

            onOpen() {}

            onClose() {}

            static open() {
                let model = new this();
                let dom = $.get(model.id);

                if (!this.initialized) {
                    this.initialized = true;
                    dom.querySelector('.close').onclick = () => {
                        model.close();
                    };

                    model.onInit(dom);
                }
                model.open(dom);
            }
        };
        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Model = cubepack_require(3);

        cubepack_exports = class ChatModel extends Model {
            constructor() {
                super('chat_modal');
            }

            onOpen(model) {
                model.querySelector('.chat-body').scrollTop = model.querySelector('.chat-body').scrollHeight;
                document.querySelector('header nav a.chat').classList.remove('active');
            }

            sendMessage() {
                let el = document.getElementById('chat_input'),
                    text = el.value;
                let user = window.conference.user;
                el.value = '';
                if (text.length > 0) {
                    ChatModel.appendMessage({
                        sender: {
                            id: user.id,
                            name: user.name,
                            role: window.conference.getRoleLabel(user.id)
                        },
                        time: Date.now(),
                        content: text
                    });

                    // 发送到服务器
                    window.conference.sendMessage(text);
                }
            }

            onInit(model) {
                // 监听消息按钮
                model.querySelector('.confirm').onclick = () => {
                    this.sendMessage();
                };
                $.get('chat_input').onkeypress = e => {
                    if (e.keyCode === 13) {
                        this.sendMessage();
                    }
                };
            }

            static appendMessage(message) {
                let container = document.querySelector('#chat_modal .chat-body');

                let date = new Date(message.time),
                    banker = message.sender.id === window.conference.user.id;
                let hour = date.getHours(),
                    minutes = date.getMinutes();
                let canBottom = container.clientHeight - (container.scrollHeight - container.scrollTop) >= -10;

                let node = UI.node('div', 'text-message' + (banker ? ' banker' : ''));
                let avatar = UI.node('div', 'avatar', message.sender.name.substr(0, 1));
                avatar.style.backgroundColor = Helper.getUserAvatar(message.sender.id);
                let content = UI.node('div', 'content');
                let info = UI.node('div', 'info');
                let nickname = UI.node('div', 'nickname', message.sender.name);
                let role = UI.node('div', 'role', message.sender.role);
                let time = UI.node('div', 'time', (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes));
                let text = UI.node('div', 'text', message.content);

                info.appendChild(nickname);
                info.appendChild(role);
                info.appendChild(time);

                content.appendChild(info);
                content.appendChild(text);

                node.appendChild(avatar);
                node.appendChild(content);

                container.appendChild(node);
                if (banker || canBottom) {
                    container.scrollTop = container.scrollHeight;
                }
                container.classList.remove('empty');

                // 收到消息，判断消息面板是否打开
                if (!banker && !document.getElementById('chat_modal').classList.contains('on')) {
                    document.querySelector('header nav a.chat').classList.add('active');
                }
            }
        };

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Model = cubepack_require(3);

        cubepack_exports = class ProfileModel extends Model {
            constructor() {
                super('user_modal');
            }

            onOpen(model) {
                let conference = window.conference,
                    user = conference.user;
                let avatar = model.querySelector('.synopsis .avatar');
                avatar.style.backgroundColor = Helper.getUserAvatar(user.id);
                avatar.textContent = user.name.substr(0, 1);
                model.querySelector('.synopsis .nickname').textContent = user.name;
                model.querySelector('.synopsis .role').textContent = conference.getRoleLabel(user.id);
            }
        };
        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Model = cubepack_require(3);

        cubepack_exports = class SettingModel extends Model {
            constructor() {
                super('setting_modal');
            }

            onOpen(model) {
                let video = document.getElementById('video_input_select');
                let audio = document.getElementById('audio_input_select');
                let speaker = document.getElementById('audio_output_select');

                video.value = '';
                audio.value = '';
                speaker.value = '';

                // 重置下拉列表
                UI.empty(video);
                UI.empty(audio);
                UI.empty(speaker);

                let preview = model.querySelector('.preview video');
                let options = window.conference.options;

                navigator.mediaDevices.enumerateDevices().then(devices => {
                    for (let device of devices) {
                        let option = UI.node('option', '', device.label);
                        option.value = device.deviceId;
                        if (device.kind === 'videoinput') {
                            video.appendChild(option);
                            if (options.videoId === null) {
                                options.videoId = device.deviceId;
                                this.loadVideoByDeviceId(preview, device.deviceId);
                            } else if (options.videoId === device.deviceId) {
                                option.selected = true;
                                this.loadVideoByDeviceId(preview, device.deviceId);
                            }
                        } else if (device.kind === 'audioinput') {
                            audio.appendChild(option);
                            if (options.audioId === null) {
                                options.audioId = device.deviceId;
                            } else if (options.audioId === device.deviceId) {
                                option.selected = true;
                            }
                        } else if (device.kind === 'audiooutput') {
                            speaker.appendChild(option);
                            if (options.speakerId === null) {
                                options.speakerId = device.deviceId;
                            } else if (options.speakerId === device.deviceId) {
                                option.selected = true;
                            }
                        }
                    }

                    video.onchange = () => {
                        this.closeVideoStream(preview);
                        this.loadVideoByDeviceId(preview, video.value);
                    };
                });
            }

            onClose(model) {
                let preview = model.querySelector('.preview video');
                this.closeVideoStream(preview);
            }

            onInit(model) {
                let conference = window.conference,
                    options = conference.options;

                model.querySelector('.cancel').onclick = () => {
                    this.close();
                };

                model.querySelector('.save').onclick = () => {
                    let video = document.getElementById('video_input_select').value;
                    let audio = document.getElementById('audio_input_select').value;
                    let speaker = document.getElementById('audio_output_select').value;

                    let videoChanged = false,
                        audioChanged = false,
                        speakerChanged = false;
                    if (options.videoId !== video) {
                        options.videoId = video;
                        videoChanged = true;
                    }
                    if (options.audioId !== audio) {
                        options.audioId = audio;
                        audioChanged = true;
                    }
                    if (options.speakerId !== speaker) {
                        options.speakerId = speaker;
                        speakerChanged = true;
                    }

                    if (videoChanged || audioChanged) {
                        // 如果当前没有关闭摄像头和屏幕分享，直接更新流
                        if (!options.screencast && options.video && conference.interacted) {
                            conference.publish();
                        }
                    } else if (speakerChanged) {
                        document.getElementById('conference_audio').setSinkId(speaker);
                    }

                    model.classList.remove('on');
                };
            }

            loadVideoByDeviceId(video, id) {
                navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId: id, width: 288, height: 180 } }).then(stream => {
                    video.srcObject = stream;
                });
            }

            closeVideoStream(video) {
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => {
                        track.stop();
                    });
                    video.srcObject = null;
                }
            }
        };
        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Model = cubepack_require(3);

        function genCell(participant) {
            let cell = document.createElement('div');
            cell.id = 'member_' + participant.id;
            cell.className = 'cell';

            let avatar = UI.node('div', 'avatar');
            avatar.textContent = participant.name.substr(0, 1);
            avatar.style.backgroundColor = Helper.getUserAvatar(participant.id);
            let info = UI.node('div', 'info');
            let nickname = UI.node('div', 'nickname', participant.name);
            let role = UI.node('div', 'role', participant.role === 'viewer' ? '观看者' : conference.getRoleLabel(participant.id));
            info.appendChild(nickname);
            info.appendChild(role);

            cell.appendChild(avatar);
            cell.appendChild(info);

            if (window.conference.isPresenter()) {
                let mute = UI.node('div', 'menu mute');
                mute.title = '禁麦';
                if (participant.role === 'viewer') mute.style.display = 'none';
                mute.onclick = () => {
                    if (mute.classList.contains('active')) {
                        mute.classList.remove('active');
                        conference.unmuteMember('audio', participant);
                    } else {
                        mute.classList.add('active');
                        conference.muteMember('audio', participant);
                    }
                };

                let all = UI.node('div', 'menu all');
                if (participant.role === 'viewer') {
                    all.style.display = 'none';
                    all.classList.add('viewer');
                }
                if (participant.id === conference.speaker) {
                    all.style.display = 'none';
                }
                all.onclick = () => {
                    cell.parentElement.querySelectorAll('.all').forEach(menu => {
                        if (!menu.classList.contains('viewer')) menu.style.display = '';
                    });

                    all.style.display = 'none';
                    conference.setSpeaker(participant.id);
                };
                all.title = '全员看TA';

                let advance = UI.node('div', 'menu invite', participant.role === 'viewer' ? '上屏' : '下屏');
                let timer = null;
                advance.onclick = () => {
                    clearTimeout(timer);

                    let task = function () {
                        conference.toggleInteract(participant);
                    };

                    if (timer === null) {
                        task();
                    } else {
                        timer = setTimeout(() => {
                            task();
                            timer = setTimeout(() => {
                                timer = null;
                            }, 1000);
                        }, 1000);
                    }
                    advance.textContent = participant.role === 'viewer' ? '上屏' : '下屏';
                };

                let operate = UI.node('div', 'operate');
                operate.appendChild(mute);
                operate.appendChild(all);
                //operate.appendChild(advance);
                cell.appendChild(operate);
            }

            return cell;
        }

        cubepack_exports = class MembersModel extends Model {
            constructor() {
                super('members_modal');
            }

            onOpen(model) {
                // 加载成员
                let conference = window.conference;
                let fragment = document.createDocumentFragment();
                let appendCell = participant => {
                    fragment.appendChild(genCell(participant));
                };
                appendCell(conference.user);
                conference.participants.forEach(appendCell);

                model.querySelector('.main').appendChild(fragment);
                model.querySelector('.btn-container').style.display = conference.isPresenter() ? 'flex' : 'none';
                model.querySelector('.main').style.marginBottom = '0';
            }

            static join(participant) {
                if (!$.get('member_' + participant.id)) {
                    let model = $.get('members_modal');
                    if (model.classList.contains('on')) model.querySelector('.main').appendChild(genCell(participant));
                }
            }

            static leave(participant) {
                let cell = $.get('member_' + participant.id);
                if (cell) cell.remove();
            }

            static update(participant) {
                let cell = $.get('member_' + participant.id);
                if (cell) {
                    let mute = cell.querySelector('.mute');
                    if (mute) mute.style.display = participant.role === 'viewer' ? 'none' : 'block';
                    let all = cell.querySelector('.all');
                    if (all) all.style.display = participant.role === 'viewer' ? 'none' : '';

                    // let advance = cell.querySelector('.invite');
                    // advance.textContent = participant.role === 'viewer' ? '上屏' : '下屏';
                }
            }

            static updateMuteState(participant, kind, muted) {
                if (kind === 'audio') {
                    let cell = $.get('member_' + participant.id);
                    if (cell) {
                        let mute = cell.querySelector('.mute');
                        if (mute) {
                            if (muted) {
                                mute.classList.add('active');
                            } else {
                                mute.classList.remove('active');
                            }
                        }
                    }
                }
            }

            onClose(model) {
                UI.empty(model.querySelector('.main'));
            }

            onInit(model) {}
        };

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Model = cubepack_require(3);

        cubepack_exports = class ScanModal extends Model {
            constructor() {
                super('scan_modal');
            }

            onOpen(model) {}

            onInit() {
                new QRCode($.get("scan_canvas"), location.href);
            }
        };
        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let Participant = cubepack_require(0);

        const ConferenceCommand = {
            SET_SPEAKER: 'SET_SPEAKER',
            SET_MUTE: 'SET_MUTE',
            BEGIN_INTERACT: 'BEGIN_INTERACT',
            END_INTERACT: 'END_INTERACT',
            RAISE_HAND: 'RAISE_HAND',
            WB_DATA: 'WB_DATA',
            BEGIN_WB: 'BEGIN_WB',
            END_WB: 'END_WB'
        };

        cubepack_exports = class Conference {
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
                this.mixedParticipant = new Participant({ userId: 'mixed@混码流' });
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

                this.client = TRTC.createClient(Object.assign({ mode: 'rtc' }, license));
                this._startListener();
                this.client.join({ roomId: data.rid }).then(() => {
                    this.id = data.id;
                    this.official.id = data.id + '-common';

                    callback(false);

                    // 加入数据通道
                    this.dataChannel = io.connect(API_URL);
                    this.dataChannel.emit('join', { roomId: data.id, userId: this.user.id });
                    this._startDataChannelListener();
                }).catch(error => {
                    callback({ code: 1003, message: '加入会议失败，请稍后重试！' });
                });
            }

            _addParticipant(entity, noticeJoin) {
                let participant = new Participant(entity, 'viewer'),
                    id = participant.id;
                if (id !== this.user.id) {
                    this.participants.set(id, participant);

                    if (noticeJoin) this.onJoin(participant);
                }
            }

            _addStream(stream, noticeJoin) {
                let userKey = stream.getUserId();
                let { id } = Participant.parse(userKey);
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
                this.client.subscribe(stream, { video: false }).then(subscription => {
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
                    this._addParticipant({ userId }, true);
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
                this.dataChannel.on('chat', data => {
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

                this.dataChannel.on(ConferenceCommand.SET_SPEAKER, data => {
                    this._changeSpeaker(this.speaker, data.target);
                });

                this.dataChannel.on(ConferenceCommand.SET_MUTE, data => {
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

                this.dataChannel.on(ConferenceCommand.BEGIN_INTERACT, data => {
                    if (data.target === this.user.id && !this.interacted) {
                        this.interacted = true;
                        this.user.role = 'presenter';
                        this.subscribeAudio();
                        this.publish();
                        this.onBeginInteract(this.user);
                    }
                });

                this.dataChannel.on(ConferenceCommand.END_INTERACT, data => {
                    if (data.target === this.user.id && this.interacted) {
                        this.user.role = 'viewer';
                        this.closeInteract(this.user);
                    }
                });

                this.dataChannel.on(ConferenceCommand.RAISE_HAND, data => {
                    this.onRaiseHand(this._safeParticipant(data.target));
                });

                this.dataChannel.on(ConferenceCommand.WB_DATA, data => {
                    if (this.board) {
                        this.board.load([data]);
                    }
                });

                this.dataChannel.on(ConferenceCommand.BEGIN_WB, data => {
                    this.onBeginWhiteboard();
                    this._loadWhiteboard();
                });

                this.dataChannel.on(ConferenceCommand.END_WB, data => {
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

                let startPublish = videoConstraint => {
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
                    }).catch(error => {
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
                this.participants.forEach(participant => {
                    let stream = participant.stream;
                    if (stream) {
                        stream.muteAudio();
                    } else {
                        stream.muteVideo();
                    }
                });
            }

            unMuteAll() {
                this.participants.forEach(participant => {
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
                    this.publish(error => {
                        if (error) this.options.screencast = false;

                        callback(error);
                    });
                }
            }

            disableScreencast(callback) {
                if (this.options.screencast) {
                    this.options.screencast = false;
                    this.publish(error => {
                        callback(error);
                    });
                }
            }

            sendCommand(name, data, to) {
                let cmd = { name, data };
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
                let { create, Pen, Rect, Ellipse, Arrow, Mosaic, Text, Crop } = SPGraphic;

                let record = [];
                if (this.board) {
                    record = this.board.record;
                    this.board.dispose();
                }

                this.board = create(document.getElementById('wb_view'), { enableTouchScroll: true });
                this.board.load(record);
                this.board.onchange = data => {
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
                        reader.onload = evt => {
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

            onMute() {}

            onUnMute() {}

            onJoin() {}

            onLeft() {}

            onRaiseHand() {}

            onMessage() {}

            onSpeakerChange() {}

            onBeginInteract() {}

            onEndInteract() {}

            onBeginWhiteboard() {}

            onEndWhiteBoard() {}

            onUserMediaReady() {}
        };

        return cubepack_exports;
    }, function () {
        let cubepack_exports = {};
        let UI = cubepack_require(2);

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

        cubepack_exports = class ViewManager {
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
                    let { participants } = window.conference;
                    participants.forEach(participant => {
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
                        participant.onMute = kind => {
                            let el = $.get(participant.id);
                            if (el) el.classList.add('mute-' + kind);
                        };
                        participant.onUnmute = kind => {
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
                    let nickname = participant.banker ? isSpeaker ? '你' : '我' : participant.name;

                    let panel = UI.node('div', 'panel');

                    let substance = UI.node('div', 'substance');
                    substance.appendChild(UI.node('div', 'nickname', nickname));
                    substance.appendChild(UI.node('div', 'message', ''));

                    let info = UI.node('div', 'info');
                    info.appendChild(UI.node('div', 'nickname', nickname));

                    let operate = UI.node('div', 'operate');
                    let more = UI.node('div', 'more');
                    operate.appendChild(more);

                    more.onclick = e => {
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

                let conference = window.conference,
                    user = conference.user;
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
                        "skinLayout": [{
                            "name": "bigPlayButton",
                            "align": "blabs",
                            "x": 30,
                            "y": 80
                        }, {
                            "name": "errorDisplay",
                            "align": "tlabs",
                            "x": 0,
                            "y": 0
                        }, {
                            "name": "infoDisplay"
                        }, {
                            "name": "controlBar",
                            "align": "blabs",
                            "x": 0,
                            "y": 0,
                            "children": []
                        }]
                    }, function (player) {
                        console.log("The player is created");
                    });

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
                        "flv": location.protocol + "//pull.shixincube.cn/live/" + roomId + ".flv",
                        "m3u8": source,
                        "autoplay": true,
                        "width": '100%',
                        "height": '100%',
                        "live": true,
                        "x5_player": true,
                        listener: function (msg) {
                            // console.log('listener',msg);
                            if (msg.type === 'error') {
                                window.setTimeout(function () {
                                    player.load();
                                }, 2000);
                            } else if (msg.type === 'play') {
                                let el = $('#live_view .tips');
                                if (el) el.remove();
                            }
                        }
                    });

                    this.livePlayer = player;
                }
            }
        };

        return cubepack_exports;
    }];window.app = function () {
        let cubepack_exports = {};
        let Helper = cubepack_require(1);
        let UI = cubepack_require(2);
        let ChatModel = cubepack_require(4);
        let ProfileModel = cubepack_require(5);
        let SettingModel = cubepack_require(6);
        let MembersModel = cubepack_require(7);
        let ScanModal = cubepack_require(8);
        let Conference = cubepack_require(9);
        let ViewManager = cubepack_require(10);

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
            $post(Action.Connect, { id: roomId, nickname: user.name, password }, function (error, license) {
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
                    Helper.getUserInfo(role, user => {
                        requestConnect(user, password, callback);
                    });
                });
            } else {
                Helper.getUserInfo(role, user => {
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

                conference.onJoin = participant => {
                    UI.noticeMessage(participant.name + '进入了会议');
                    viewer.add(participant);

                    MembersModel.join(participant);
                };

                conference.onLeft = participant => {
                    UI.noticeMessage(participant.name + '退出了会议');
                    viewer.del(participant);

                    MembersModel.leave(participant);
                };

                conference.onMessage = message => {
                    ChatModel.appendMessage(message);
                };

                conference.onUserMediaReady = participant => {
                    viewer.del(participant);
                    viewer.render(participant);
                };

                conference.onSpeakerChange = (lastSpeaker, newSpeaker) => {
                    viewer.changeSpeaker(lastSpeaker, newSpeaker);
                };

                conference.onBeginInteract = participant => {
                    if (participant.id === conference.user.id) {
                        viewer.openInteract();
                    } else {
                        viewer.add(participant);
                    }

                    MembersModel.update(participant);
                };

                conference.onEndInteract = participant => {
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

                conference.onRaiseHand = participant => {
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

                conference.join(license, error => {
                    if (error) {
                        UI.alert(error.message, () => {
                            location.replace('./index.html');
                        });
                    } else {
                        viewer.init(role !== 'viewer', enableLive);
                    }
                });

                // 绑定关闭语音菜单点击事件
                bindControl('voice', active => {
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
                bindControl('screen', e => {
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
                            conference.enableScreencast(error => {
                                lock = false;
                                if (error) {
                                    el.classList.remove('active');
                                    el.querySelector('.label').textContent = '共享窗口';
                                }
                            });
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
                bindControl('wb', e => {
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
                $('#user_control_panel .upper').onclick = e => {
                    let uid = $.get('user_control_panel').dataset.uid;
                    if (!conference.setSpeaker(uid)) {
                        UI.showToast('您不是主持人，无法进行此操作');
                    }
                };

                // 全员禁麦按钮事件
                $('#all_member_mute').onclick = e => {
                    conference.muteAllMember('audio');
                };

                // 开放所有控制菜单
                $.removeClass('.console .menu, .configure .layout', 'disabled');

                window.conference = conference;
            });
        }

        window.startup = startup;

        return cubepack_exports;
    }();
})();