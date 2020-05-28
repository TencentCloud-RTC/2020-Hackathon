import Model from "../Model";

export default class SettingModel extends Model {
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

        navigator.mediaDevices.enumerateDevices().then((devices) => {
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
            }
        });


    }

    onClose(model) {
        let preview = model.querySelector('.preview video');
        this.closeVideoStream(preview);
    }

    onInit(model) {
        let conference = window.conference, options = conference.options;

        model.querySelector('.cancel').onclick = () => {
            this.close();
        };

        model.querySelector('.save').onclick = () => {
            let video = document.getElementById('video_input_select').value;
            let audio = document.getElementById('audio_input_select').value;
            let speaker = document.getElementById('audio_output_select').value;

            let videoChanged = false, audioChanged = false, speakerChanged = false;
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
        navigator.mediaDevices.getUserMedia({audio: false, video: {deviceId: id, width: 288, height: 180}}).then((stream) => {
            video.srcObject = stream;
        });
    }

    closeVideoStream(video) {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
            video.srcObject = null;
        }
    }
}