var root = document.getElementById('root');
var socket = io();
var key = '';

function hidePopUps(){
  for (var t in popUps.length()){
    popUps[t].style.visibility = "hidden";
  };
};

socket.on('no_such_game', function(){
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.visibility = "visible";  
});

function attemptJoin(){
  hidePopUps();
  document.getElementById("waiting").style.visibility = "visible";
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
<div id="waiting" style={{visibility: "hidden"}}><p>waiting</p></div>
<div id="noSuchGame" style={{visibility: "hidden"}}><p>noSuchGame</p></div>
<div id="nameTaken" style={{visibility: "hidden"}}><p>nameTaken</p></div>
</div>;

ReactDOM.render(toRender, root);
var popUps = [document.getElementById("waiting"), document.getElementById("nameTaken"), document.getElementById("noSuchGame")];
