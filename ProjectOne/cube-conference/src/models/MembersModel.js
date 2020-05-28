import Model from "../Model";

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
            cell.parentElement.querySelectorAll('.all').forEach((menu) => {
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

export default class MembersModel extends Model {
    constructor() {
        super('members_modal');
    }

    onOpen(model) {
        // 加载成员
        let conference = window.conference;
        let fragment = document.createDocumentFragment();
        let appendCell = (participant) => {
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

    onInit(model) {

    }
}
