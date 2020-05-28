
export default class Participant {
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
        return {id: keys.shift(), name: keys.join('')};
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
            let {speaker, client} = window.conference, stream = this.stream;
            let options = {audio: true, video: true, screen: true};

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

    onMute(kind) { }

    onUnmute(kind) { }
}
