var root = document.getElementById('root');
var socket = io();
var key = '';
socket.on('key', function(msg){
  key = msg;
  var element = <h1> Key: {key} </h1>;
  ReactDOM.render(element, root);
});
socket.emit('request_key', '');
