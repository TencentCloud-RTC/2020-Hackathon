import Participant from "./Participant";

export default (function () {
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
    let avatars = new Map(), colors = AvatarColors.concat();

    return {
        conferenceInfo: null,

        init(info) {
            this.conferenceInfo = info;
        },

        randomUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
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
                let id = this.conferenceInfo.uid, name = localStorage.getItem(STORAGE_NAME);

                user = new Participant({
                    userId: id + '@' + name
                }, role, true);

                if (name == null) {
                    user.name = null;
                    UI.prompt("请输入参会昵称：",  (confirm, text) => {
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
    }
})();
