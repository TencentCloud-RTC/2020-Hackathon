import Model from "../Model";

export default class ScanModal extends Model {
    constructor() {
        super('scan_modal');
    }

    onOpen(model) {
    }

    onInit() {
        new QRCode($.get("scan_canvas"), location.href);
    }
}