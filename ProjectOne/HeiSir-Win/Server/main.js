var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    morgan = require('morgan'),
    fs = require('fs'),
    log4js = require('log4js'),
    server = require('https').createServer({ passphrase: "********", pfx: fs.readFileSync("cert/djdeveloper.pfx") }, app),
    io = require('socket.io')(server);
var port = 3005;
var clients = {};
var socket2client = {};

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        server: {
            type: 'file',
            filename: __dirname + '/logs/server.log',
            "maxLogSize": 4096760,
            "numBackups": 5
        },
        errors: {
            type: 'file',
            filename: __dirname + '/logs/errors.log',
            "maxLogSize": 4096760,
            "numBackups": 5
        },
        'just-errors': {
            type: 'logLevelFilter',
            appender: 'errors',
            level: 'error'
        }
    },
    categories: {
        default: {
            appenders: ['console', 'server', 'just-errors'],
            level: 'debug'
        }
    }
});
const logger = log4js.getLogger();

server.listen(port, () => {
    logger.info('Server listening at port %d', port);
});

// app.configure ya no existe
app.use(errorhandler());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
io.on('connection', (socket) => {
    
    logger.debug('new connection %s', socket.id);

    socket.on('reg client', (data) => {
        logger.debug('reg client %s', JSON.stringify(data) );
        
        clients[data.id] = {id:data.id,password:data.password,socket:socket};
        socket2client[socket.id] = data.id;
    });

    socket.on('control_connect', (data) => {
        logger.debug('control_connect %s', JSON.stringify(data));
        if(data.dest_id == null)
            return;
        let c = clients[data.dest_id];
        if(c != null && c.socket != null)
        {
            c.socket.emit("control_connect",data);
        }
        else
        {
            socket.emit('control_connect_result', {
                src_id:'',
                dest_id:data.src_id,
                code:-2,
                message:"对方终端没有在线，请稍后再试！"
            });
        }
    });
    
    socket.on('control_connect_result', (data) => {
        logger.debug('control_connect_result %s', JSON.stringify(data));
        if(data.dest_id == null)
            return;
        let c = clients[data.dest_id];
        if( c != null && c.socket != null)
        {
            c.socket.emit("control_connect_result",data);
        }
    });

    socket.on('control_connect_result_ack', (data) => {
        if(data.dest_id == null)
            return;
        let c = clients[data.dest_id];
        if( c != null && c.socket != null)
        {
            c.socket.emit("control_connect_result_ack",data);
        }
    });

    socket.on('disconnect', () => {
        logger.debug('client disconnect %s', socket.id);
        if(socket2client[socket.id] != null)
        {
            cid = socket2client[socket.id];
            clients[cid].socket = null;
            delete socket2client[socket.id];
        }
    });
});