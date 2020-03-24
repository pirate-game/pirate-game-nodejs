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
  var theCrew = someGame.crew;
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
    var pos = leaderToGame(socket);
    if (pos != -1){
      games[pos].available = false;
      socket.emit('show_provisional_crew');
    };
  });
  
  socket.on('remove_player', function(who){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var player = gameAndNameToPlayer(games[pos], who);
      if (player != {}){
        player.emit('join_rejected');
        games[pos].crew = games[pos].crew.filter((x)=>(x!=player));
      };
    };
  });
  
  socket.on('change_crew', function(){
    var pos = leaderToGame(socket);
    if (pos != -1){
      games[pos].available = true;
    };
  });
  
  socket.on('start_game', function(){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var theCrew = games[pos].crew;
      for (var i = 0; i < theCrew.length; i++){
        theCrew[i].pirate.emit('start_game');
      };
    };
  });
  
  socket.on('too_slow', function(who){
    var pos = leaderToGame(socket);
    if (pos != -1){
      for (var i = 0; i < game[pos].length; i++){
        var player = gameAndNameToPlayer(games[pos], who[i]);
        if (player != {}){
          player.emit('too_slow');
          games[pos].crew = games[pos].crew.filter((x)=>(x!=player));
        };
      }; 
    };
  });
  
});

//End of Game Section

http.listen(port, function(){});

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/404.html');
});
