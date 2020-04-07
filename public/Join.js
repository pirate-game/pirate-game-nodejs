var root = document.getElementById('root');
var socket = io();

var theBoard;
var theThingsBox;
var theStage3;
var theChoosePlayer;
var myName;
var clickMod10 = 0;

function test(){
  hideStage("stage0");
  showStage("stage3");
};

const namePattern = /^[\w\'\-\". ]*$/;
const exclPattern = /^\s*$/;
const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;
const squarePattern = /^[ABCDEFG][1234567]$/;
const numPattern = /^[0-9]*$/;

function ordinal(someInt){
  var suffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
  switch(someInt % 100){
    case 11:
    case 12:
    case 13:
        return someInt.toString() + "th";
        break;
    default:
        return someInt.toString() + suffixes[someInt % 10];
  };
};

function range(someInt){
  var out = [];
  for (var i = 0; i < someInt; i++){
    out.push(i);
  };
  return out;
};

const thingsArray = ["rob","kill","present","parrot","swap","choose","shield","mirror","bomb","double","bank","200","1000","3000","5000"];

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
  "double":<img src="imgs/double.svg" />,
  "bank":<img src="imgs/bank.svg" />,
  "200":<img src="imgs/sym200.svg" />,
  "1000":<img src="imgs/sym1000.svg" />,
  "3000":<img src="imgs/sym3000.svg" />,
  "5000":<img src="imgs/sym5000.svg" />
};

function thingsInverse(thing){
  for (var i = 0; i < thingsArray.length; i++){
    if (things[thingsArray[i]].props.src == thing.props.src){
      return thingsArray[i];
    };
  };
  return "";
};

const nextPlace = {
  "rob":"placekill",
  "kill":"placepresent",
  "present":"placeparrot",
  "parrot":"placeswap",
  "swap":"placechoose",
  "choose":"placeshield",
  "shield":"placemirror",
  "mirror":"placebomb",
  "bomb":"placedouble",
  "double":"placebank",
  "bank":"place5000",
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
  socket.close();
});

function attemptJoin(){
  var name = document.getElementById("pirateName").value;
  var key = document.getElementById("gameKey").value;
  if (namePattern.test(name) && !exclPattern.test(name)) {
    if (keyPattern.test(key)) {
      hidePopUps();
      document.getElementById("waiting").style.display = "block";
      socket.emit('attempt_join', name, key);
      myName = name;
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
      return <img src="imgs/double.svg" />;
      break;
    case 10:
      return <img src="imgs/bank.svg" />;
      break;
    case 11:
      return <img src="imgs/sym5000.svg" />;
      break;
    default:
      if (i < 14){return <img src="imgs/sym3000.svg" />;}
      else if (i < 24){return <img src="imgs/sym1000.svg" />;}
      else {return <img src="imgs/sym200.svg" />;};
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
    this.state = {board:{}, done:[], taken:[]};
    
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
    this.setState({board:temp, taken:this.state.taken.concat([square])});
    clickMod10 = 0;
  }
  updateBoardM(squares, thing){
    var temp = Object.assign({}, this.state.board);
    for (var i = 0; i < squares.length; i++){
      temp[squares[i]] = things[thing];
    };
    this.setState({board:temp, taken:this.state.taken.concat(squares)});
    clickMod10 = 0;
  }
  squareDone(square){
    this.setState({done:this.state.done.concat([square])});
  }
  place200(){
    var possibleSquares = ["A1","A2","A3","A4","A5","A6","A7",
                           "B1","B2","B3","B4","B5","B6","B7",
                           "C1","C2","C3","C4","C5","C6","C7",
                           "D1","D2","D3","D4","D5","D6","D7",
                           "E1","E2","E3","E4","E5","E6","E7",
                           "F1","F2","F3","F4","F5","F6","F7",
                           "G1","G2","G3","G4","G5","G6","G7"];
    var temp = {};
    for (var i = 0; i < 49; i++){
      temp[possibleSquares[i]] = things["200"];
    };
    this.setState({board:Object.assign(temp, this.state.board)});
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
            <td id={row+col} className="square" onClick={() => squareClicked(row+col)}>
              {this.state.board[row+col]}
              {this.state.done.includes(row+col) ? <div className="crossout" /> : null}
            </td>
          ))}
        </tr>
      ))}
      </table>;
  }
};

function squareClicked(square){
  var placeInputs = document.getElementsByClassName("placeInput");
  for (var i = 0; i < placeInputs.length; i++){
    placeInputs[i].value = square;
  };
  document.getElementById("chooseSquareInput").value = square;
  if (square == ""){
    document.getElementById("placeInput3000First").value = "";
    document.getElementById("placeInput3000Second").value = "";
    var placeInput1000s = document.getElementsByClassName("placeInput1000");
    for (var j = 0; j < placeInput1000s.length; j++){
      placeInput1000s[j].value = "";
    };
    clickMod10 = 0;
  } else {
    if (clickMod10%2 == 0){
      document.getElementById("placeInput3000First").value = square;
    } else {
      document.getElementById("placeInput3000Second").value = square;
    };
    document.getElementById("placeInput1000N"+clickMod10.toString()).value = square;
    clickMod10 = (clickMod10+1) % 10;
  };
};

function Place(props){
  return (
    <div id={"place"+props.which} className="stage1PopUp place">
      <h3 style={{display: "inline-block",verticalAlign: "top"}}>Choose a Square For The &apos;{props.which[0].toUpperCase()+props.which.substr(1)}&apos; Symbol</h3>
      <div style={{display:"inline-block",position:"absolute",right:"10px",top:"15px"}} className="square">
      {things[props.which]}
      </div>
      <hr />
      <p>In what grid square would you like to place The &apos;{props.which[0].toUpperCase()+props.which.substr(1)}&apos; Symbol?<br />You can click on the square to select it.</p>
      <input type="text" className="placeInput" id={"placeInput"+props.which} maxLength="2" />
      <button className="choosePlace close" onClick={() => attemptPlace(props.which)} style={{height:"unset",display:"block",marginTop:"10px",fontSize:"inherit"}}>Okay!</button>
    </div>);
};
      
function attemptPlace(which){
  var proposedSquare = document.getElementById("placeInput"+which).value;
  squareClicked("");
  if (squarePattern.test(proposedSquare)){
    if (theBoard.state.taken.includes(proposedSquare)){
      hidePopUps();
      document.getElementById("squareTaken").style.display = "block";
    } else {
      theBoard.updateBoard(proposedSquare, which);
      document.getElementById("place"+which).style.display = "none";
      document.getElementById(nextPlace[which]).style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  };
};

function fillRandomly(){
  theBoard.fillRandom();
  socket.emit('board_ready');
  hideStage("stage1");
  showStage("stage2");
  document.getElementById("waitingForOthers").style.display = "block";
};

function fillItMyself(){
  squareClicked("");
  document.getElementById("fillInBoard").style.display = "none";
  document.getElementById("placerob").style.display = "block";
};

function attemptPlace5000(){
  var proposedSquare = document.getElementById("placeInput5000").value;
  squareClicked("");
  if (squarePattern.test(proposedSquare)){
    if (theBoard.state.taken.includes(proposedSquare)){
      hidePopUps();
      document.getElementById("squareTaken").style.display = "block";
    } else {
      theBoard.updateBoard(proposedSquare, "5000");
      document.getElementById("place5000").style.display = "none";
      document.getElementById("place3000").style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  };
};

function attemptPlace3000(){
  var proposedSquares = [document.getElementById("placeInput3000First").value, document.getElementById("placeInput3000Second").value];
  squareClicked("");
  if (squarePattern.test(proposedSquares[0]) && squarePattern.test(proposedSquares[1])){
    if (proposedSquares[0]!=proposedSquares[1]){
      if (theBoard.state.taken.includes(proposedSquares[0]) || theBoard.state.taken.includes(proposedSquares[1])){
        hidePopUps();
        document.getElementById("squareTaken").style.display = "block";
      } else {
        theBoard.updateBoardM(proposedSquares, "3000");
        document.getElementById("place3000").style.display = "none";
        document.getElementById("place1000").style.display = "block";
      };
    } else {
      hidePopUps();
      document.getElementById("squaresMatch").style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  };
};

function attemptPlace1000(){
  var proposedSquares_ = document.getElementsByClassName("placeInput1000");
  var proposedSquares = [0,1,2,3,4,5,6,7,8,9].map(e => proposedSquares_[e].value)
  if (proposedSquares.map(e => squarePattern.test(e)).sort()[0]){
    if (new Set(proposedSquares).size === proposedSquares.length){
      if (proposedSquares.map(e => theBoard.state.taken.includes(e)).sort().reverse()[0]){
        hidePopUps();
        document.getElementById("squareTaken").style.display = "block";
      } else {
        theBoard.updateBoardM(proposedSquares, "1000");
        document.getElementById("place1000").style.display = "none";
        document.getElementById("place200").style.display = "block";
      };
    } else {
      hidePopUps();
      document.getElementById("squaresMatch").style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  };
};

function place200(){
  theBoard.place200();
  socket.emit('board_ready');
  hideStage("stage1");
  showStage("stage2");
  document.getElementById("waitingForOthers").style.display = "block";
};

socket.on('current_square', function(square){
  hidePopUps();
  theBoard.squareDone(square);
  doThing(theBoard.state.board[square]);
});

function doThing(someThing){
  switch(someThing.props.src){
    case things["rob"].props.src:
      socket.emit('request_crew');
      ReactDOM.render(<ChoosePlayer what={"rob"} />, document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    case things["kill"].props.src:
      socket.emit('request_crew');
      ReactDOM.render(<ChoosePlayer what={"kill"} />, document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    case things["present"].props.src:
      socket.emit('request_crew');
      ReactDOM.render(<ChoosePlayer what={"present"} />, document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    case things["parrot"].props.src:
      socket.emit('gobby_parrot', theThingsBox.state.cash);
      ReactDOM.render(
        <div>
          <h3 style={{display: "inline-block",verticalAlign: "top"}}>Gobby Parrot!</h3>
          <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
            {things["parrot"]}
          </div>
          <hr />
          <p>Now everyone knows &apos;ow much cash ye&apos;s be &apos;avin&apos;.</p>
          <button className="choosePlace close" onClick={readyNow} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
        </div>,
        document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    case things["swap"].props.src:
      socket.emit('request_crew');
      ReactDOM.render(<ChoosePlayer what={"swap"} />, document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    case things["choose"].props.src:
      socket.emit('got_choose');
      ReactDOM.render(
        <div>
          <h3 style={{display: "inline-block",verticalAlign: "top"}}>You Got &apos;Choose&apos;</h3>
          <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
            {things["choose"]}
          </div>
          <hr />
          <p>You&apos;ll be told what to do when it is your turn to choose.</p>
          <button className="choosePlace close" onClick={readyNow} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
        </div>,
        document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
    default:
      switch(someThing.props.src){
        case things["shield"].props.src:
          theThingsBox.setState({shield: "yes"});
          break;
        case things["mirror"].props.src:
          theThingsBox.setState({mirror: "yes"});
          break;
        case things["bomb"].props.src:
          theThingsBox.setState({cash: null});
          break;
        case things["double"].props.src:
          theThingsBox.setState({cash: 2 * theThingsBox.state.cash});
          break;
        case things["bank"].props.src:
          theThingsBox.setState({cash: null, bank: theThingsBox.state.cash});
          break;
        default:
          if (numPattern.test(thingsInverse(someThing))){
            theThingsBox.setState({cash: parseInt(thingsInverse(someThing)) + theThingsBox.state.cash});
          };
          break;
      };
      ReactDOM.render(<YouGot what={thingsInverse(someThing)} />, document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
  };  
};

class ChoosePlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {crew:[]};
    
    theChoosePlayer = this;
  }
  render(){
    return <div>
      <h3 style={{display: "inline-block",verticalAlign: "top"}}>You Got &apos;{this.props.what[0].toUpperCase()+this.props.what.substr(1)}&apos;</h3>
      <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
        {things[this.props.what]}
      </div>
      <hr />
      <p>Choose someone to {this.props.what=="present" ? "give a" : null} {this.props.what}. You can click on them to select them.</p>
      <input type="text" id="choosePlayer" maxLength="172" />
      <div className="choosePlayerList">
        <ul>
          {this.state.crew.map(crewMember => crewMember == myName ? null : (
            <li style={{position:'relative'}} onClick={()=>{document.getElementById("choosePlayer").value=crewMember}}>
              <div className="nameLiDiv">{crewMember}</div>
            </li>
          ))}
        </ul>
      </div>
      <button className="choosePlace close" onClick={() => chooseThemTo(this.props.what)} style={{height:"unset",display:"block",marginTop:"10px"}}>Them!</button>
    </div>;
  }
};

socket.on('crew', function(someCrew){
  console.log(someCrew);
  theChoosePlayer.setState({crew:someCrew});
});

function chooseThemTo(what){
  var name = document.getElementById("choosePlayer").value;
  if (namePattern.test(name) && !exclPattern.test(name)){
    if (theChoosePlayer.state.crew.includes(name)){
      if (what == "swap"){
        socket.emit(what, name, theThingsBox.state.cash);
      } else {
        socket.emit(what, name);
      };
      readyNow();
    } else {
      hidePopUps();
      document.getElementById("noSuchPlayer").style.display = "block";
    };
  } else {
    hidePopUps();
    document.getElementById("invalidName2").style.display = "block";
  };
};
                      
function YouGot(props){
  return <div>
    <h3 style={{display: "inline-block",verticalAlign: "top"}}>You Got &apos;{props.what[0].toUpperCase()+props.what.substr(1)}&apos;</h3>
    <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
      {things[props.what]}
    </div>
    <hr />
    <p>This doesn&apos;t require you to do anything.</p>
    <button className="choosePlace close" onClick={readyNow} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
  </div>;
};

function readyNow(){
 document.getElementById("squareWas").style.display = "none";
 socket.emit('ready');
};

function attemptChooseSquare(){
  var proposedSquare = document.getElementById("chooseSquareInput").value;
  if (squarePattern.test(proposedSquare)){
    if (theBoard.state.done.includes(proposedSquare)){
      hidePopUps();
      document.getElementById("squareDone").style.display = "block";
    } else {
      hidePopUps();
      document.getElementById("chooseSquare").style.display = "none";
      document.getElementById("waitingForChoice").style.display = "block";
      socket.emit('chose', proposedSquare);
    };
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  };
};

socket.on('choose', function(){
  hidePopUps();
  document.getElementById("chooseSquare").style.display = "block";
});

class ThingsBox extends React.Component {
  constructor(){
    super();
    this.state = {shield: "no", mirror: "no", cash: null, bank: null};
    
    theThingsBox = this;
  }
  render(){
    return <div className="thingsBox">
      <div style={{top:"5px", left:"5px"}}>
        <h3>Shield:</h3>
        <div>
          {this.state.shield == "no" ? null : things["shield"]}
          {this.state.shield == "gone" ? <div className="crossout" /> : null}  
        </div>
      </div>
      <div style={{top:"5px", right:"5px"}}>
        <h3>Mirror:</h3>
        <div>
          {this.state.mirror == "no" ? null : things["mirror"]}
          {this.state.mirror == "gone" ? <div className="crossout" /> : null}
        </div>
      </div>
      <div style={{bottom:"5px", left:"5px"}}>
        <h3>CASH:</h3>
        <h4>{this.state.cash}</h4>
      </div>
      <div style={{bottom:"5px", right:"5px"}}>
        <h3>Bank:</h3>
        <h4>{this.state.bank}</h4>
      </div>
    </div>;
  }
};

function ShieldMirror(props){
  return <div className="popUp"><div>
        <h3>{props.name} is trying to {props.what} {props.what == "swap" ? "with" : null} you!</h3>
        <hr />
        <p>You can {theThingsBox.shield == "yes" ? "shield yourself or" : null} {theThingsBox.mirror == "yes" ? "mirror it or" : null} just accept it. Click on the symbol to use it.</p>
        {theThingsBox.shield == "yes" ? <div className="square" onClick={()=>shield(props.what, name, props.amount)}>{things["shield"]}</div> : <div className="square">{theThingsBox.shield == "gone" ? <React.Fragment> {things["shield"]} <div className="crossout" /> </React.Fragment> : null}</div>}
        {theThingsBox.mirror == "yes" ? <div className="square" onClick={()=>mirror(props.what, name, props.amount)}>{things["mirror"]}</div> : <div className="square">{theThingsBox.mirror == "gone" ? <React.Fragment> {things["mirror"]} <div className="crossout" /> </React.Fragment> : null}</div>}
        <button className="close" onClick={()=>okay(props.what, props.name, props.amount)}>Okay!</button>
    </div></div>;
};

function okay(what, name, amount){
  document.getElementById("shieldMirror").style.display = "none";
  switch(what){
    case "rob":
      socket.emit('robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: null});
      break;
    case "kill":
      theThingsBox.setState({cash: null});
      break;
    case "swap":
      socket.emit('swapped', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: amount});
      break;
  };
};

function shield(what, name, amount){
  document.getElementById("shieldMirror").style.display = "none";
  theThingsBox.setState({shield: "gone"});
  switch(what){
    case "rob":
      socket.emit('robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: null});
      break;
    case "kill":
      theThingsBox.setState({cash: null});
      break;
    case "swap":
      socket.emit('swapped', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: amount});
      break;
  };
};

function mirror(what, name, amount){
  document.getElementById("shieldMirror").style.display = "none";
  theThingsBox.setState({shield: "gone"});
  switch(what){
    case "rob":
      socket.emit('robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: null});
      break;
    case "kill":
      theThingsBox.setState({cash: null});
      break;
    case "swap":
      socket.emit('swapped', name, theThingsBox.state.cash);
      theThingsBox.setState({cash: amount});
      break;
  };
};

socket.on('rob', function(name){
  if (theThingsBox.shield == "yes" || theThingsBox.mirror == "yes"){
    ReactDOM.render(<ShieldMirror what="rob" name={name} amount=0/>, document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").style.display = "block";
  } else {
    okay("rob", name, 0);
  };
});

socket.on('kill', function(name){
  if (theThingsBox.shield == "yes" || theThingsBox.mirror == "yes"){
    ReactDOM.render(<ShieldMirror what="kill" name={name} amount=0/>, document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").style.display = "block";
  } else {
    okay("kill", name, 0);
  };
});

socket.on('present', function(){
  theThingsBox.setState({cash: theThingsBox.state.cash + 1000});
});

socket.on('swap', function(name, amount){
  if (theThingsBox.shield == "yes" || theThingsBox.mirror == "yes"){
    ReactDOM.render(<ShieldMirror what="swap" name={name} amount={amount}/>, document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").style.display = "block";
  } else {
    okay("swap", name, amount);
  };
});

socket.on('swapped', function(amount){
  theThingsBox.setState({cash: amount});
});

socket.on('robbed', function(amount){
  theThingsBox.setState({cash: theThingsBox.state.cash + amount});
});

class Stage3 extends React.Component {
  constructor(){
    super();
    
    theStage3 = this;
  }
  render(){
    var pos = 0;
    for (var i = 0; i < this.props.leaderboard.length; i++){
      if (this.props.leaderboard[i].name == myName){
        pos = i;
        break;
      };
    };
    return <div className="leaderboard">
      <button className="backHome" onClick={() => {window.location='index.html';}}>Back to the Homepage</button>
      <h3 style={{top: "120px"}}>The Winner was {this.props.leaderboard[0].name} with {this.props.leaderboard[0].score}</h3>
      <h3 style={{top: "150px"}}>You came {ordinal(pos+1)} with {this.props.leaderboard[pos].score}</h3>
      <h3 style={{top: "200px"}}>Leaderboard:</h3>
      <div className="leaderboardList">
        <ul>
          {range(this.props.leaderboard.length).map(place => (
            <li style={{position:'relative',padding:'0 10px'}}>
              <div className="leaderboardRight">{this.props.leaderboard[place].score}</div>
              <div className="leaderboardLeft">{place+1}. {this.props.leaderboard[place].name}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>;
  }
};

socket.on('get_score', function(){
  socket.emit('got_score', theThingsBox.state.cash + theThingsBox.state.bank);
});

socket.on('game_over', function(results){
  ReactDOM.render(<Stage3 leaderboard={results} />, document.getElementById("stage3"));
  hideStage("stage2");
  showStage("stage3");
});
  
var toRender = <div>
  <div className="stage0">
    <div>
      <div>
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
      <div id="fillInBoard" className="stage1PopUp" style={{display:"block"}}>
        <h3>Fill in the Board</h3>
        <hr />
        <p>Would you like to fill in your Board yourself, or have it done for you, randomly?</p>
        <button className="close" id="leftBtn" onClick={fillItMyself}>Fill&nbsp;it<br />Myself</button>
        <button className="close" id="rightBtn" onClick={fillRandomly}>Randomly</button>
      </div>
      <Place which="rob" />
      <Place which="kill" />
      <Place which="present" />
      <Place which="parrot" />
      <Place which="swap" />
      <Place which="choose" />
      <Place which="shield" />
      <Place which="mirror" />
      <Place which="bomb" />
      <Place which="double" />
      <Place which="bank" />
          
      <div id="place5000" className="stage1PopUp place">
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Choose a Square For The &apos;5000&apos; Symbol</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          <img src="imgs/sym5000.svg" />
        </div>
        <hr />
        <p>In what grid square would you like to place The &apos;5000&apos; Symbol?<br />You can click on the square to select it.</p>
        <input type="text" className="placeInput" id="placeInput5000" maxLength="2" />
        <button className="choosePlace close" onClick={attemptPlace5000} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>

      <div id="place3000" className="stage1PopUp place">
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Choose Squares For Both of The &apos;3000&apos; Symbols</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          <img src="imgs/sym3000.svg" />
        </div>
        <hr />
        <p>In what grid squares would you like to place The &apos;3000&apos; Symbols?<br />You can click on squares to select them.</p>
        <input type="text" className="placeInput3000" id="placeInput3000First" maxLength="2" />
        <input type="text" className="placeInput3000" id="placeInput3000Second" maxLength="2" />
        <button className="choosePlace close" onClick={attemptPlace3000} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>

      <div id="place1000" className="stage1PopUp place">
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Choose Squares For All of The &apos;1000&apos; Symbols</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          <img src="imgs/sym1000.svg" />
        </div>
        <hr />
        <p>In what grid squares would you like to place The &apos;1000&apos; Symbols?<br />You can click on squares to select them.</p>
        <table id="placeInput1000Table">
          <tr>
            <td><input type="text" className="placeInput1000" id="placeInput1000N0" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N1" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N2" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N3" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N4" maxLength="2" /></td>
          </tr>
          <tr>
            <td><input type="text" className="placeInput1000" id="placeInput1000N5" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N6" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N7" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N8" maxLength="2" /></td>
            <td><input type="text" className="placeInput1000" id="placeInput1000N9" maxLength="2" /></td>
          </tr>
        </table>
        <button className="choosePlace close" onClick={attemptPlace1000} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>

      <div id="place200" className="stage1PopUp place">
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Placing The &apos;200&apos; Symbols</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          <img src="imgs/sym200.svg" />
        </div>
        <hr />
        <p>The other symbols are all The &apos;200&apos; Symbol and will be placed automatically.</p>
        <button className="choosePlace close" onClick={place200} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>

    </div>

    <div className="stage2">
      
      <ThingsBox />
      
      <div id="chooseSquare" className="stage2PopUp"><div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Choose the Next Square</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          <img src="imgs/c.png" />
        </div>
        <hr />
        <p>Choose a square.<br />You can click on the square to select it.</p>
        <input type="text" className="placeInput" id="chooseSquareInput" maxLength="2" />
        <button className="choosePlace close" onClick={attemptChooseSquare} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div></div>
          
      <div id="squareWas" className="stage2PopUp" />
        
      <div id="shieldMirror" />

    </div>

  </div>

  <div id="stage3" className="stage3"></div>

  <div id="popUps">

    <div id="invalidName" className="popUp"><div>
        <h3>Invalid Name</h3>
        <hr />
        <p>Please choose a name consisting of alphanumeric characters and spaces but which is not entirely whitespace and especially isn&apos;t the empty name.
          <br />We be sorry if ye&apos;s name be &apos;aving accented characters in it etc.</p>
       <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
    
    <div id="invalidName2" className="popUp"><div>
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
    
    <div id="invalidSquare" className="popUp"><div>
        <h3>Invalid Square</h3>
        <hr />
        <p>Squares must be a letter from [&quot;A&quot;, &quot;B&quot;, &quot;C&quot;, &quot;D&quot;, &quot;E&quot;, &quot;F&quot;, &quot;G&quot;] followed by a digit from [&quot;1&quot;, &quot;2&quot;, &quot;3&quot;, &quot;4&quot;, &quot;5&quot;, &quot;6&quot;, &quot;7&quot;].</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
    
    <div id="squareTaken" className="popUp"><div>
        <h3>Square Taken</h3>
        <hr />
        <p>Oops! There&apos;s something in that square already, choose another.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
    
    <div id="squaresMatch" className="popUp"><div>
        <h3>Squares Match</h3>
        <hr />
        <p>Oops! You&apos;ve chosen the same square multiple times! Choose again.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
     
    <div id="waitingForOthers" className="popUp"><div>
      <h3>Waiting for the Other Crew to Fill Their Boards</h3>
      <hr />
      <p>This won&apos;t take too long, I hope!</p>
    </div></div>
    
    <div id="waitingForSquare" className="popUp"><div>
      <h3>Waiting for the Current Square</h3>
      <hr />
      <p>This won&apos;t take too long, I hope!</p>
    </div></div>
    
    <div id="waitingForChoice" className="popUp"><div>
      <h3>Waiting for the Chosen Square</h3>
      <hr />
      <p>This won&apos;t take too long, I hope!</p>
    </div></div>
    
    <div id="squareDone" className="popUp"><div>
        <h3>Square Done</h3>
        <hr />
        <p>Oops! That square&apos;s been done already, choose another.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
    
    <div id="noSuchPlayer" className="popUp"><div>
        <h3>No Such Player</h3>
        <hr />
        <p>Oops! That player doesn&apos;t exist, maybe check your spelling.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>
      
  </div>
</div>;

ReactDOM.render(toRender, root);

//test();
