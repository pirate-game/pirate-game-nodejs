var root = document.getElementById('root');
var socket = io();
var key = '';

socket.on('no_such_game'){
  document.getElementById("gameKey").value = "";
  document.getElementById("waiting").visibility = "hidden";
  document.getElementById("noSuchGame").visibility = "visible";
};

function attemptJoin(){
  document.getElementById("waiting").visibility = "visible";
  socket.emit('attempt_join', document.getElementById("pirateName").value, document.getElementById("gameKey").value);
};

var toRender = <div>
<div>
  <link rel="stylesheet" type="text/css" href="css/Join.css" />
  <div className="first">
    <h2>What be your name?</h2>
    <input type="text" id="pirateName" maxLength="172" />
  </div>
  <div className="last">
    <h2>What game be ye joinin&apos;?</h2>
    <input type="text" id="gameKey" maxLength="6" />
  </div>
  <button id="join" onClick={attemptJoin}>Join</button>
</div>
<div id="waiting"><p>Waiting</p></div>
<div id="noSuchGame"><p>noSuchGame</p></div>
</div>;

ReactDOM.render(toRender, root);
