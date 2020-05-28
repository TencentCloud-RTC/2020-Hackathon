function $(selector) {
    return document.querySelector(selector);
}

$.get = function (id) {
    return document.getElementById(id);
};

$.remove = function (selector) {
    let nodes = document.querySelectorAll(selector);
    if (nodes) {
        nodes.forEach((node) => node.remove());
    }
};

$.removeClass = function (selector, className) {
    let nodes = document.querySelectorAll(selector);
    if (nodes) {
        nodes.forEach((node) => node.classList.remove(className));
    }
};

window.$ = $;

export default {
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
        let x = 0, y = 0, parent = node;
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
        }
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
            let offsetX = Number(panel.dataset.x || 0), offsetY = Number(panel.dataset.y || 20);
            let point = this.offset(btn);
            panel.classList.add('on');
            panel.style.visibility = 'hidden';
            switch (horizontal) {
                case 'center':
                    panel.style.left = (Math.floor(point.x + btn.clientWidth / 2 - panel.offsetWidth / 2) + offsetX) + 'px';
                    break;
                case 'left':
                    panel.style.left = (point.x + offsetX) + 'px';
                    break;
                case 'right':
                    panel.style.right = (point.right + offsetX) + 'px';
                    break;
            }

            switch (vertical) {
                case 'top':
                    panel.style.bottom = (point.bottom + btn.offsetHeight + offsetY) + 'px';
                    break;
                case 'bottom':
                    panel.style.top = (point.y + btn.offsetHeight + offsetY) + 'px';
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
            panel.style.left = (e.pageX) + 'px';
            panel.style.top = (e.pageY) + 'px';

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
