var API_URL = 'http://jellycode.cn:3000/';
var Action = {
    Conference: 'conference',
    Connect: 'conference/connect'
};
var APP_TOKEN = localStorage.getItem('APP_TOKEN');

var request = function (method, path, body, callback) {
    var req = new XMLHttpRequest();
    if (APP_TOKEN) body.token = APP_TOKEN;
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            try {
                var data = JSON.parse(req.responseText);
                if (data.token) {
                    APP_TOKEN = data.token;
                    localStorage.setItem('APP_TOKEN', data.token);
                }
                if (data.code === 200) {
                    callback(false, data.data);
                } else {
                    callback(data);
                }
            } catch (e) {
                callback({code: 0, msg: '网络错误，请稍后重试'});
            }
        }
    };
    let url = API_URL + path;
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    if (body !== undefined) {
        req.send(JSON.stringify(body));
    } else {
        req.send();
    }
};

var $get = function (path, params, callback) {
    request('POST', path, params, callback);
};
var $post = function (path, params, callback) {
    request('POST', path, params, callback);
};
var $put = function (path, params, callback) {
    request('PUT', path, params, callback);
};
var $patch = function (path, params, callback) {
    request('PATCH', path, params, callback);
};


