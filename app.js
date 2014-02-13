var ticker_board = require('./ticker_board');

var connect = require('connect');
var httpServer = connect()
    .use(connect.compress())
    .use(connect.static(__dirname + '/webroot'))
    .listen(9999);
var io = require('socket.io').listen(httpServer);

var events = require('events');
var ev = new events.EventEmitter();
ev.on('mtgox', function(data){
    broadcast('mtgox', data);
});
ev.on('btce', function(data){
    broadcast('btce', data);
});
ev.on('monatr', function(data){
    broadcast('monatr', data);
});
var getCurrentTick = ticker_board.initialize(ev);

var sockets = {};
var uniqid = 0;

var broadcast = function(key, data){

    for(var id in sockets){
        sockets[id].emit('message', JSON.stringify({key:key, data:data}));
    }

};

io.sockets.on('connection', function (client) {
    var id = ++uniqid;
    sockets[id] = client;

    var obj = getCurrentTick();
    for(var key in obj){
        sockets[id].emit('message', JSON.stringify({key:key, data:obj[key]}));
    }

    client.on('message', function(message){
    });
    client.on('disconnect', function(err) {
        delete sockets[id];
    });
});

