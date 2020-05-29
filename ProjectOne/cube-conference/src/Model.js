export default class Model {
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

    onInit() { }

    onOpen() { }

    onClose() { }

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
}