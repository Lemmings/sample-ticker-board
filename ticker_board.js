var redis = require('redis');

var CHANNEL = 'current_tick';

var initialize = exports.initialize = function(ev){
    var obj = {};
    var rcl = redis.createClient();
    rcl.hgetall(CHANNEL, function(err, data){
        obj.mtgox = JSON.parse(data.mtgox);
        obj.btce = JSON.parse(data.btce);
        obj.monatr = JSON.parse(data.monatr);

        ev.emit('mtgox', obj.mtgox);
        ev.emit('btce', obj.btce);
        ev.emit('monatr', obj.monatr);
        rcl.subscribe(CHANNEL);
        rcl.on('message', function(channel, message){
            var w = JSON.parse(message);
            obj[w.key] = w.data;
            ev.emit(w.key, w.data);
        });
    });
    return function(){
        return obj;
    }
}


