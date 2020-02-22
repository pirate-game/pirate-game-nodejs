var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  console.log(req.url);
  if (req.url == "/") {
    res.sendFile(__dirname + '/index.html');
  } else {
    res.sendFile(__dirname + '/css/MainPage.css');
  };
                      
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
