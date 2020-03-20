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
  socket.on('request_key', function(){
    var key = new_key();
    socket.emit('key', key);
    var game = {leader: socket, game_key: key, crew: [], available: true};
    games.push(game);
  });
  
  socket.on('attempt_join', function(name, key){
    var not_there = true;
    for (var i = 0; i < games.length; i++) {
      if (games[i].game_key == key) {
        not_there = false;
        if (games[i].available) {
          if (games[i].crew.map(x => x.pirateName).includes(name)) {
            socket.emit('name_taken');
          } else {
            games[i].crew.push({pirate: socket, pirateName: name});
            games[i].leader.emit('request_join', name);
          };
        } else {
          socket.emit('game_unavailable');
        };
        break;
      };
    };
    if (not_there) {
      socket.emit('no_such_game');
    };
  });
  
});

//End of Game Section

http.listen(port, function(){});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/404.html');
});
