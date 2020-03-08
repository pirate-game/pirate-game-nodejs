var root = document.getElementById('root');
var socket = io();
var key = '';
socket.on('key', function(msg){
  key = msg;
});
socket.emit('request_key', '');

var element = <h1> Key: {key} </h1>;
ReactDOM.render(element, root);
