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

function gameAndPlayerToName(someGame, somePlayer){
  var theCrew = someGame.crew;
  for (var i = 0; i < theCrew.length; i++){
    if (theCrew[i].pirate.id == somePlayer.id){
      return theCrew[i].pirateName;
    };
  };
  return "";
};

function crewmemberToGame(someCrewmember){
  var someCrewmemberId = someCrewmember.id;
  for (var i = 0; i < games.length; i++){
    if (games[i].crew.map(x=>x.pirate.id).includes(someCrewmemberId)){
      return i;
    };
  };
  return -1;
};

io.on('connection', function(socket){
  
  socket.on('request_key', function(){
    var key = new_key();
    socket.emit('key', key);
    var game = {leader: socket, game_key: key, crew: [], available: true, watchable:false, watching:[], scores:[]};
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
      games[pos].watchable = true;
      var theCrew = games[pos].crew;
      for (var i = 0; i < theCrew.length; i++){
        theCrew[i].pirate.emit('start_game');
      };
      var thoseWatching = games[pos].watching;
      for (var j = 0; j < thoseWatching.length; j++){
        thoseWatching[j].emit('start_game');
      };
    };
  });
  
  socket.on('too_slow', function(who){
    var pos = leaderToGame(socket);
    if (pos != -1){
      for (var i = 0; i < who.length; i++){
        var player = gameAndNameToPlayer(games[pos], who[i]);
        if (player != {}){
          player.emit('too_slow');
          games[pos].crew = games[pos].crew.filter((x)=>(x!=player));
        };
      };
      var thoseWatching = games[pos].watching;
      for (var j = 0; j < thoseWatching.length; j++){
        thoseWatching[j].emit('too_slow', who);
      };
    };
  });
  
  socket.on('board_ready', function(){
    var thisGame = crewmemberToGame(socket);
    if (thisGame != -1){
      var thisName = gameAndPlayerToName(games[thisGame], socket);
      if (thisName != ""){
        games[thisGame].leader.emit('board_ready', thisName);
      };
    };
  });
  
  socket.on('attempt_watch', function(key){
    var pos = keyToGame(key);
    if (pos == -1){
      socket.emit('no_such_game');
    } else {
      games[pos].watching.push(socket);
      if (games[pos].watchable){
        socket.emit('start_game');
        games[pos].leader.emit('request_state');
      };
    };
  });
  
  socket.on('state', function(state){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var thoseWatching = games[pos].watching;
      for (var i = 0; i < thoseWatching.length; i++){
        thoseWatching[i].emit('state', state);
      };
    };
  });
  
  socket.on('current_square', function(square){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var theCrew = games[pos].crew;
      for (var i = 0; i < theCrew.length; i++){
        theCrew[i].pirate.emit('current_square', square);
      };
      var thoseWatching = games[pos].watching;
      for (var j = 0; j < thoseWatching.length; j++){
        thoseWatching[j].emit('current_square', square);
      };
    };
  });
  
  socket.on('choose_next_square', function(player){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var thoseWatching = games[pos].watching;
      for (var i = 0; i < thoseWatching.length; i++){
        thoseWatching[i].emit('choose_next_square', player);
      };
    };
  });
  
  socket.on('choose', function(toChoose){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var thoseWatching = games[pos].watching;
      for (var i = 0; i < thoseWatching.length; i++){
        thoseWatching[i].emit('choose', toChoose);
      };
      var playerToChoose = gameAndNameToPlayer(games[pos], toChoose);
      if (playerToChoose != {}){
        playerToChoose.emit('choose');
      } else {
        socket.emit('player_gone', toChoose);
      };  
    };
  });
  
  socket.on('chose', function(square){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      games[pos].leader.emit('chose', square);
    };
  });
  
  socket.on('ready', function(){
    var thisGame = crewmemberToGame(socket);
    if (thisGame != -1){
      var thisName = gameAndPlayerToName(games[thisGame], socket);
      if (thisName != ""){
        games[thisGame].leader.emit('ready', thisName);
      };
    };
  });
  
  socket.on('got_choose', function(){
    var thisGame = crewmemberToGame(socket);
    if (thisGame != -1){
      var thisName = gameAndPlayerToName(games[thisGame], socket);
      if (thisName != ""){
        games[thisGame].leader.emit('got_choose', thisName);
      };
    };
  });
  
  socket.on('gobby_parrot', function(score){
    var thisGame = crewmemberToGame(socket);
    if (thisGame != -1){
      var thisName = gameAndPlayerToName(games[thisGame], socket);
      if (thisName != ""){
        games[thisGame].leader.emit('some_event', ["parrot", thisName, score]);
      };
      var thoseWatching = games[thisGame].watching;
      for (var i = 0; i < thoseWatching.length; i++){
        thoseWatching[i].emit('some_event', ["parrot", thisName, score]);
      };
    };
  });
  
  socket.on('get_scores', function(){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var theCrew = games[pos].crew;
      for (var i = 0; i < theCrew.length; i++){
        theCrew[i].pirate.emit('get_score');
      };
    };
  });
  
  socket.on('got_score', function(someScore){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      games[pos].scores.push({name: gameAndPlayerToName(games[pos], socket), score: someScore});
    };
    games[pos].leader.emit('got_scores', games[pos].scores);
  });
  
  socket.on('game_over', function(leaderboard){
    var pos = leaderToGame(socket);
    if (pos != -1){
      var theCrew = games[pos].crew;
      for (var i = 0; i < theCrew.length; i++){
        theCrew[i].pirate.emit('game_over', leaderboard);
      };
      var thoseWatching = games[pos].watching;
      for (var j = 0; j < thoseWatching.length; j++){
        thoseWatching[j].emit('game_over', leaderboard);
      };
    };
  });
  
  socket.on('request_crew', function(){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      socket.emit('crew', games[pos].crew.map(e=>e.pirateName));
    };
  });
  
  socket.on('rob', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var victim = gameAndNameToPlayer(games[pos], name);
      if (victim != {}){
        var perpetrator = gameAndPlayerToName(games[pos], socket);
        victim.emit('rob', perpetrator);
      };
    };
  });
  
  socket.on('kill', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var victim = gameAndNameToPlayer(games[pos], name);
      if (victim != {}){
        var perpetrator = gameAndPlayerToName(games[pos], socket);
        victim.emit('kill', perpetrator);
      };
    };
  });
  
  socket.on('present', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var victim = gameAndNameToPlayer(games[pos], name);
      if (victim != {}){
        var perpetrator = gameAndPlayerToName(games[pos], socket);
        victim.emit('present');
        games[pos].leader.emit('some_event', ['present', perpetrator, name]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['present', perpetrator, name]);
        };
      };
    };
  });
  
  socket.on('swap', function(name, amount){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var victim = gameAndNameToPlayer(games[pos], name);
      if (victim != {}){
        var perpetrator = gameAndPlayerToName(games[pos], socket);
        victim.emit('swap', perpetrator, amount);
      };
    };
  });
  
  socket.on('robbed', function(name, amount){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var robber = gameAndNameToPlayer(games[pos], name);
      if (robber != {}){
        robber.emit('robbed', amount);
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['rob', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['rob', name, victim]);
        };
      };
    };
  });
  
  socket.on('swapped', function(name, amount){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var robber = gameAndNameToPlayer(games[pos], name);
      if (robber != {}){
        robber.emit('swapped', amount);
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['swap', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['swap', name, victim]);
        };
      };
    };
  });
  
  socket.on('killed', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var robber = gameAndNameToPlayer(games[pos], name);
      if (robber != {}){
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['kill', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['kill', name, victim]);
        };
      };
    };
  });
  
  socket.on('shielded_rob', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var perpetrator = gameAndNameToPlayer(games[pos], name);
      if (perpetrator != {}){
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['shielded_rob', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['shielded_rob', name, victim]);
        };
      };
    };
  });
  
  socket.on('shielded_kill', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var perpetrator = gameAndNameToPlayer(games[pos], name);
      if (perpetrator != {}){
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['shielded_kill', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['shielded_kill', name, victim]);
        };
      };
    };
  });
  
  socket.on('shielded_swap', function(name){
    var pos = crewmemberToGame(socket);
    if (pos != -1){
      var perpetrator = gameAndNameToPlayer(games[pos], name);
      if (perpetrator != {}){
        var victim = gameAndPlayerToName(games[pos], socket);
        games[pos].leader.emit('some_event', ['shielded_swap', name, victim]);
        var thoseWatching = games[pos].watching;
        for (var i = 0; i < thoseWatching.length; i++){
          thoseWatching[i].emit('some_event', ['shielded_swap', name, victim]);
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
