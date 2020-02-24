var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('pirate game', function(msg){
    io.emit('pirate game', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/404.html');
});
