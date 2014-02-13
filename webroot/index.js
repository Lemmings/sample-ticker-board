var URL = window.URL || window.webkitURL;
var doc = document;
var socket = null;

function connect(){
//    socket = new WebSocket('ws://' + location.host);
    socket = new io.connect('http://' + location.host);
}
connect();

var update = function(key, value){
    var idlist = [];
    for(var p in value){
        idlist.push(p);
    }
    idlist.sort();
    var elem = doc.getElementById(key);
    var text = '<table class="ticker">';
    text = text + '<th colspan=3>' + key + '</th>';
    idlist.forEach(function(p){
        var date = new Date( value[p].time * 1000 );
        var updated = [date.getFullYear(), date.getMonth()+1, date.getDate()].join( '/' ) + ' ' + date.toLocaleTimeString();
        text = text + '<tr>';
        text = text + '<td>' + p + '</td>';
        text = text + '<td>' + value[p].tick + '</td>';
        text = text + '<td>' + updated + '</td>';
        text = text + '</tr>';
    });
    text = text + '</table>';
    elem.innerHTML = text;
}
// ----------------------------------------
// 初期化
// ----------------------------------------
var initialize = function(){
    socket.on('connect', function(){
        socket.on('disconnect', function() {
            alert('サーバーから切断されました');
        });
        socket.on('message', function(data){
            var obj = JSON.parse(data);
            update(obj.key, obj.data);
        });
    });
};
(function(){
    initialize();
})();

