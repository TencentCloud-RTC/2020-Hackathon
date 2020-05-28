import Model from "../Model";

export default class ProfileModel extends Model {
    constructor() {
        super('user_modal');
    }

    onOpen(model) {
        let conference = window.conference, user = conference.user;
        let avatar = model.querySelector('.synopsis .avatar');
        avatar.style.backgroundColor = Helper.getUserAvatar(user.id);
        avatar.textContent = user.name.substr(0, 1);
        model.querySelector('.synopsis .nickname').textContent = user.name;
        model.querySelector('.synopsis .role').textContent = conference.getRoleLabel(user.id);
    }
}