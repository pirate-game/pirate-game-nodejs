var root = document.getElementById('root');
var socket = io();

const namePattern = /^[\w| ]*$/;
const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;

function hidePopUps(){
  for (var t = 0; t < popUps.length; t++){
    popUps[t].style.visibility = "hidden";
  };
};

socket.on('no_such_game', function(){
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.visibility = "visible";  
});

socket.on('name_taken', function(){
  document.getElementById("pirateName").value = "";
  hidePopUps();
  document.getElementById("nameTaken").style.visibility = "visible";  
});

function attemptJoin(){
  var name = document.getElementById("pirateName").value;
  var key = document.getElementById("gameKey").value;
  if (namePattern.test(name)) {
    if (keyPattern.test(key)) {
      hidePopUps();
      document.getElementById("waiting").style.visibility = "visible";
      socket.emit('attempt_join', name, key);
    } else {
      hidePopUps();
      document.getElementById("invalidKey").style.visibility = "visible";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidName").style.visibility = "visible";
  };
};

var toRender = <div>
<link rel="stylesheet" type="text/css" href="css/PopUp.css" />
<div>
  <link rel="stylesheet" type="text/css" href="css/Join.css" />
  <div className="inputsDiv">
    <div className="first">
      <h2>What be your name?</h2>
      <input type="text" id="pirateName" maxLength="172" />
    </div>
    <div className="last">
      <h2>What game be ye joinin&apos;?</h2>
      <input type="text" id="gameKey" maxLength="6" />
    </div>
  </div>
  <button id="join" onClick={attemptJoin}>Join</button>
</div>
<div id="invalidName" className="popUp"><p>invalidName</p></div>
<div id="invalidKey" className="popUp"><p>invalidKey</p></div>
<div id="waiting" className="popUp"><p>waiting</p></div>
<div id="noSuchGame" className="popUp"><p>noSuchGame</p></div>
<div id="nameTaken" className="popUp"><p>nameTaken</p></div>
</div>;

ReactDOM.render(toRender, root);
var popUps = document.getElementsByClassName("popUp");
