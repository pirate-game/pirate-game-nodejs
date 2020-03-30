var root = document.getElementById('root');
var socket = io();

var theBoard;

function test(){
  hideStage("stage0");
  showStage("stage1");
};

const namePattern = /^[\w\'\-\". ]*$/;
const exclPattern = /^\s*$/;
const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;

const things = {
  "rob":<img src="imgs/rob.png" />,
  "kill":<img src="imgs/kill.svg" />,
  "present":<img src="imgs/present.png" />,
  "parrot":<img src="imgs/parrot.png" />,
  "swap":<img src="imgs/swap.png" />,
  "choose":<img src="imgs/c.png" />,
  "shield":<img src="imgs/shield.svg" />,
  "mirror":<img src="imgs/mirror.png" />,
  "bomb":<img src="imgs/bomb.svg" />,
  "double":<div style={{fontWeight: 'lighter', display: 'contents'}}>&times; 2</div>,
  "bank":"B",
  "200":<div style={{fontWeight: 'lighter', display: 'contents'}}>200</div>,
  "1000":<div style={{fontWeight: 'lighter', display: 'contents'}}>1000</div>,
  "3000":<div style={{fontWeight: 'lighter', display: 'contents'}}>3000</div>,
  "5000":<div style={{fontWeight: 'lighter', display: 'contents'}}>5000</div>
};

function showStage(stage){
  var stageElements = document.getElementsByClassName(stage);
  for (var i = 0; i < stageElements.length; i++){
    stageElements[i].style.display = "block";
  };
};

function hideStage(stage){
  var stageElements = document.getElementsByClassName(stage);
  for (var i = 0; i < stageElements.length; i++){
    stageElements[i].style.display = "none";
  };
};

function hidePopUps(){
  var popUps = document.getElementsByClassName("popUp");
  for (var i = 0; i < popUps.length; i++){
    popUps[i].style.display = "none";
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

socket.on('join_rejected', function(){
  document.getElementById("pirateName").value = "";
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("joinRejected").style.display = "block";  
});

socket.on('start_game', function(){
  hidePopUps();
  hideStage("stage0");
  showStage("stage1");
});

socket.on('too_slow', function(){
  hidePopUps();
  document.getElementById("tooSlow").style.display = "block";
  //document.removeEventListener("beforeunload",unloadFn);//Doesn't work
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

function ordThing(i){
  switch(i){
    case 0:
      return <img src="imgs/rob.png" />;
      break;
    case 1:
      return <img src="imgs/kill.svg" />;
      break;
    case 2:
      return <img src="imgs/present.png" />;
      break;
    case 3:
      return <img src="imgs/parrot.png" />;
      break;
    case 4:
      return <img src="imgs/swap.png" />;
      break;
    case 5:
      return <img src="imgs/c.png" />;
      break;
    case 6:
      return <img src="imgs/shield.svg" />;
      break;
    case 7:
      return <img src="imgs/mirror.png" />;
      break;
    case 8:
      return <img src="imgs/bomb.svg" />;
      break;
    case 9:
      return <div style={{fontWeight: 'lighter', display: 'contents'}}>&times; 2</div>;
      break;
    case 10:
      return "B";
      break;
    case 11:
      return <div style={{fontWeight: 'lighter', display: 'contents'}}>5000</div>;
      break;
    default:
      if (i < 14){return <div style={{fontWeight: 'lighter', display: 'contents'}}>3000</div>;}
      else if (i < 24){return <div style={{fontWeight: 'lighter', display: 'contents'}}>1000</div>}
      else {return <div style={{fontWeight: 'lighter', display: 'contents'}}>200</div>};
  };
};

class Board extends React.Component {
  constructor(){
    super();
    var board = [];
    for (var i = 0; i < 7; i++){
      for (var j = 0; j < 7; j++){
        board[["A","B","C","D","E","F","G"][i]+["1","2","3","4","5","6","7"][j]] = null;
      };
    };
    this.state = {board:{}, done:[]};
    
    theBoard=this;
  }
  fillRandom(){
    var possibleSquares = ["A1","A2","A3","A4","A5","A6","A7",
                           "B1","B2","B3","B4","B5","B6","B7",
                           "C1","C2","C3","C4","C5","C6","C7",
                           "D1","D2","D3","D4","D5","D6","D7",
                           "E1","E2","E3","E4","E5","E6","E7",
                           "F1","F2","F3","F4","F5","F6","F7",
                           "G1","G2","G3","G4","G5","G6","G7"];
    var randBoard = {};
    for (var i = 0; i < 49; i++){
      var current = possibleSquares[Math.floor(Math.random()*possibleSquares.length)];
      possibleSquares = possibleSquares.filter((e)=>(e!=current));
      randBoard[current] = ordThing(i);
    };
    this.setState({board:randBoard});
  }
  updateBoard(square, thing){
    var temp = Object.assign({}, this.state.board);
    temp[square] = things[thing];
    this.setState({board:temp});
  }
  squareDone(square){
    this.setState({done:this.state.done.concat([square])});
  }
  render(){
    return <table id="board">
      <tr className="edge">
        <th className="edge"></th>
        <th className="edge">A</th>
        <th className="edge">B</th>
        <th className="edge">C</th>
        <th className="edge">D</th>
        <th className="edge">E</th>
        <th className="edge">F</th>
        <th className="edge">G</th>
      </tr>
      {["1","2","3","4","5","6","7"].map(col => (
        <tr className="edge">
          <th className="edge">{col}</th>
          {["A","B","C","D","E","F","G"].map(row => (
            <td id={row+col} className="square">
              {this.state.board[row+col]}
              {this.state.done.includes(row+col) ? <div className="crossout" /> : null}
            </td>
          ))}
        </tr>
      ))}
      </table>;
  }
};

function fillRandomly(){
  theBoard.fillRandom();
  socket.emit('board_ready');
  hideStage("stage1");
  showStage("stage2");
};

function fillItMyself(){
  document.getElementById("fillInBoard").display = "none";
  //document.getElementById("").display = "block";
};

var toRender = <div>
  <div className="stage0">
    <div>
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
    </div>
  </div>
  <div className="stage1 stage2">
    <Board />
    <div className="stage1">
      <div id="fillInBoard">
        <h3>Fill in the Board</h3>
        <hr />
        <p>Would you like to fill in your Board yourself, or have it done for you, randomly?</p>
        <button className="close" onClick={fillItMyself}>Fill&nbsp;it<br />Myself</button>
        <button className="close" onClick={fillRandomly}>Randomly</button>
      </div>
    </div>
  </div>
  <div id="popUps">

    <div id="invalidName" className="popUp"><div>
        <h3>Invalid Name</h3>
        <hr />
        <p>Please choose a name consisting of alphanumeric characters and spaces but which is not entirely whitespace and especially isn&apos;t the empty name.
          <br />We be sorry if ye&apos;s name be &apos;aving accented characters in it etc.</p>
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

    <div id="joinRejected" className="popUp"><div>
        <h3>Join Rejected</h3>
        <hr />
        <p>You have not been allowed to join that game (yet). Maybe they don&apos;t like your Pirate Name. Or, maybe they can&apos;t stand how you always beat them.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>   
      
    <div id="tooSlow" className="popUp"><div>
        <h3>Too Slow</h3>
        <hr />
        <p>Oh, No! You were too slow to respond and they&apos;ve carried on without you.</p>
        <button className="close" onClick={() => {window.location='index.html';}}>Okay!</button>
    </div></div>
  </div>
</div>;

ReactDOM.render(toRender, root);

//test();
