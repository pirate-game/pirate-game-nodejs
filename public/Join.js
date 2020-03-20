var root = document.getElementById('root');
var socket = io();

const namePattern = /^[\w\'\-\". ]*$/;
const exclPattern = /^\s*$/;
const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;

function hidePopUps(){
  for (var t = 0; t < popUps.length; t++){
    popUps[t].style.display = "none";
  };
};

socket.on('no_such_game', function(){
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.display = "block";  
});

socket.on('name_taken', function(){
  document.getElementById("pirateName").value = "";
  hidePopUps();
  document.getElementById("nameTaken").style.display = "block";  
});

socket.on('game_unavailable', function(){
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("gameUnavailable").style.display = "block";  
});

function attemptJoin(){
  var name = document.getElementById("pirateName").value;
  var key = document.getElementById("gameKey").value;
  if (namePattern.test(name) && !exclPattern.test(name)) {
    if (keyPattern.test(key)) {
      hidePopUps();
      document.getElementById("waiting").style.display = "block";
      socket.emit('attempt_join', name, key);
    } else {
      hidePopUps();
      document.getElementById("invalidKey").style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidName").style.display = "block";
  };
};

var toRender = <div>
<link rel="stylesheet" type="text/css" href="css/PopUp.css" />
<div>
  <link rel="stylesheet" type="text/css" href="css/Join.css" />
  <div className="inputsDiv">
    <h2 id="nameH2">What be your name?</h2>
    <input type="text" id="pirateName" maxLength="172" />
    <h2>What game be ye joinin&apos;?</h2>
    <input type="text" id="gameKey" maxLength="6" />
  </div>
  <button id="join" onClick={attemptJoin}>Join</button>
</div>
<div id="popUps">
      
  <div id="invalidName" className="popUp"><div>
      <h3>Invalid Name</h3>
      <hr />
      <p>Please choose a name consisting of alphanumeric characters and spaces but which is not entirely whitespace and especially isn&apos;t the empty name.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
  </div></div>
      
  <div id="invalidKey" className="popUp"><div>
      <h3>Invalid Key</h3>
      <hr />
      <p>Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. &quot;beef54&quot;.
        <br />Please use all lower-case letters.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
  </div></div>
      
  <div id="waiting" className="popUp"><div>
      <h3>Waiting</h3>
      <hr />
      <p>This usually means that the game is about to start. :) 
        <br />However, sometimes it means that something has gone wrong and you may need to try to join again. :(</p>
  </div></div>
  
  <div id="noSuchGame" className="popUp"><div>
      <h3>No Such Game</h3>
      <hr />                                                                                                       
      <p>You&apos;ve probably mistyped your key. Try again.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>                                                                     
  </div></div>
                                                                                                                 
  <div id="nameTaken" className="popUp"><div>
      <h3>Name Taken</h3>
      <hr />                                                                                                                 
      <p>Great minds think alike! (and fools&apos; seldom differ)
        <br /> Someone&apos;s taken your name already. Choose another one.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
  </div></div>
    
  <div id="gameUnavailable" className="popUp"><div>
      <h3>Game Unavailable</h3>
      <hr />
      <p>Unfortunately for you, this probably means they&apos;ve started without you. :(</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
  </div></div>
</div>
</div>;

ReactDOM.render(toRender, root);
var popUps = document.getElementsByClassName("popUp");  
