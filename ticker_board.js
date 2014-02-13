var redis = require('redis');
var rcl = redis.createClient();

rcl.hgetall('current_tick', function(err, data){
    var obj = {
        mtgox : JSON.parse(data.mtgox),
        btce : JSON.parse(data.btce),
        monatr : JSON.parse(data.monatr),
    };
    rcl.subscribe('current_tick');
    rcl.on('message', function(channel, message){
        var w = JSON.parse(message);
        obj[w.key] = w.data;
        console.log(obj[w.key]);
    });
    console.log(obj);
});
