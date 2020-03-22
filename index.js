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

function keyToGame(someKey){
  for (var i = 0; i < games.length; i++){
    if (games[i].game_key == someKey){
      return i;
    };
  };
  return -1;
};

function leaderToGame(someLeader){
  var someLeaderId = someLeader.id;
  for (var i = 0; i < games.length; i++){
    if (games[i].leader.id == someLeaderId){
      return i;
    };
  };
  return -1;
};

function gameAndNameToPlayer(someGame, someName){
  var theCrew = games[someGame].crew;
  for (var i = 0; i < theCrew.length; i++){
    if (theCrew[i].pirateName == someName){
      return theCrew[i].pirate;
    };
  };
  return {};
};

io.on('connection', function(socket){
  socket.on('request_key', function(){
    var key = new_key();
    socket.emit('key', key);
    var game = {leader: socket, game_key: key, crew: [], available: true};
    games.push(game);
  }); 
    
  socket.on('attempt_join', function(name, key){
    var pos = keyToGame(key);
    if (pos == -1){
      socket.emit('no_such_game');
    } else {
      if (games[pos].available){
        if (games[pos].crew.map(x => x.pirateName).includes(name)){
          socket.emit('name_taken');
        } else {
          games[pos].crew.push({pirate: socket, pirateName: name});
          games[pos].leader.emit('request_join', name);
        };
      } else {
        socket.emit('game_unavailable');
      };
    };
  });
  
  socket.on('crew_assembled', function(){
    socket.emit('debugmsg', games);
    socket.emit('debugmsg', 'First');
    var pos = leaderToGame(socket);
    socket.emit('debugmsg', 'Second');
    if (pos != -1){
      socket.emit('debugmsg', 'Third');
      games[pos].available = false;
      socket.emit('debugmsg', 'Fourth');
      socket.emit('show_provisional_crew');
      socket.emit('debugmsg', 'Fifth');
    };
    socket.emit('debugmsg', games);
  });
  
  socket.on('remove_player', function(who){
    socket.emit('debugmsg', games);
    socket.emit('debugmsg', 'First');
    var pos = leaderToGame(socket);
    socket.emit('debugmsg', pos);
    if (pos != -1){
      socket.emit('debugmsg', games[pos]);
      var player = gameAndNameToPlayer(games[pos], who);
      if (player != {}){
        player.emit('join_rejected')
      };
    };
    socket.emit('debugmsg', games);
  });
  
});

//End of Game Section

http.listen(port, function(){});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/404.html');
});
