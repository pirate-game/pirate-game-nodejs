var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

//Game Section

var chars = "0123456789abcdef";
var keys_in_use = [""];
var games = [];

function new_key(){
  var out = "";
  while (keys_in_use.includes(out)){
    for (var i = 0; i < 6; i++){
      out += chars[Math.floor(Math.random() * 16)];
    };
  };
  keys_in_use.push(out);
  return out;
};

io.on('connection', function(socket){
  socket.on('request_key', function(msg){
    var key = new_key();
    socket.emit('key', key);
    var game = {leader: socket, game_room: key, crew: []};
    games.push(game);
  });
  
  socket.on('attempt_join', function(name, key){
    var not_there = true;
    for (game in games) {
      if (game.game_room == key) {
        not_there = false;
        if (game.crew.includes(name)) {
          socket.emit('name_taken');
        } else {
          game.leader.emit('request_join', name);
        };
        break;
      };
    };
    if (not_there) {
      socket.emit('no_such_game');
    };
  });
  
});

/*io.on('connection', function(socket){
  socket.on('pirate game', function(msg){
    io.emit('pirate game', msg);
  });
});*///old

//End of Game Section

http.listen(port, function(){});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/404.html');
});
