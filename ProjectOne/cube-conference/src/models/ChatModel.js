import Model from "../Model";

export default class ChatModel extends Model {
    constructor() {
        super('chat_modal');
    }

    onOpen(model) {
        model.querySelector('.chat-body').scrollTop = model.querySelector('.chat-body').scrollHeight;
        document.querySelector('header nav a.chat').classList.remove('active');
    }

    sendMessage() {
        let el = document.getElementById('chat_input'), text = el.value;
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
        $.get('chat_input').onkeypress = (e) => {
            if (e.keyCode === 13) {
                this.sendMessage();
            }
        };
    }

    static appendMessage(message) {
        let container = document.querySelector('#chat_modal .chat-body');

        let date = new Date(message.time), banker = message.sender.id === window.conference.user.id;
        let hour = date.getHours(), minutes = date.getMinutes();
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
}
