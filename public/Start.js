var root = document.getElementById('root');
var socket = io();
var key = '';
var globalCrew = [];
var unreadyCrew = [];
var toChoose;

var x;//////////////
var theBoard;
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;
var theEventReport;

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

function range(someInt){
  var out = [];
  for (var i = 0; i < someInt; i++){
    out.push(i);
  };
  return out;
};

class KeyBox extends React.Component {
  constructor() {
    super();
    this.state = {key: ''};
    socket.on('key', msg => {key = msg;this.setState({key: key})});
  }
  render() {
    return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
      <h2> Key: {this.state.key} </h2>
    </div>;
  };
};

class CrewUl extends React.Component {
  constructor() {
    super();
    this.state = {crew: []};
    
    socket.on('request_join', name => {
      this.setState({crew:this.state.crew.concat([name])});
      globalCrew.push(name);
    });
    socket.on('show_provisional_crew', () => {
      hidePopUps();
      document.getElementById("crewAssembledPopUp").style.display = "block";
    });
    
    this.changeCrew = this.changeCrew.bind(this);
  }
  removePlayer(somePlayer){
    this.setState({crew:this.state.crew.filter((x)=>(x!=somePlayer))});
    globalCrew = globalCrew.filter((x)=>(x!=somePlayer));
    socket.emit('remove_player', somePlayer);
  }
  changeCrew(){
    socket.emit('change_crew');
    hidePopUps();
  }
  render() {
    return (
    <React.Fragment>
      <div id="firstCrewDiv" className="crewDiv">
        <ul>
          {this.state.crew.slice().reverse().map(crewMember => (
            <li style={{position:'relative'}}>
              <div className="cross" onClick={() => this.removePlayer(crewMember)}>&times;</div>
              <div className="nameLiDiv">{crewMember}</div>
            </li>
          ))}
        </ul>
      </div>
      <div id="crewAssembledPopUp" className="popUp"><div>
        <h3>Crew Assembled</h3>
        <hr />
        <div>
          <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those currently in your crew are below. You can remove them with the crosses.</p>
          <div style={{display: 'inline-block'}}>
            <button onClick={startGame}>Start<br />Game</button>
            <button onClick={this.changeCrew}>Change<br />Crew</button>
          </div>
        </div>
        <div id="popUpCrewDiv" className="crewDiv" style={{maxHeight: 'calc(100vh - 400px)'}}>
          <ul>
            {this.state.crew.slice().reverse().map(crewMember => (
              <li style={{position:'relative'}}>
                <div className="cross" onClick={() => this.removePlayer(crewMember)}>&times;</div>
                <div className="nameLiDiv">{crewMember}</div>
              </li>
            ))}
          </ul>
        </div>
      </div></div>
    </React.Fragment>);
  };
};

function assembleCrew(){
  hidePopUps();
  if (globalCrew.length >= 2){
    document.getElementById("waiting").style.display = "block";
    socket.emit('crew_assembled');
  } else {
    document.getElementById("tooFew").style.display = "block";
  };
};

function startGame(){
  hidePopUps();
  if (globalCrew.length >= 2){
    socket.emit('start_game');
    hideStage("stage0");
    showStage("stage1");
    ReactDOM.render(<Stage1 />, document.getElementById("stage1"));
  } else {
    document.getElementById("tooFew").style.display = "block";
  };
};

class Stage1 extends React.Component {
  constructor() {
    super();
    this.state = {waitingFor: globalCrew, ready: []};
    
    this.stage1Done = this.stage1Done.bind(this);
    
    socket.on('board_ready', player => {
      this.setState({waitingFor: this.state.waitingFor.filter((x)=>(x!=player)), ready:this.state.ready.concat(player)});
    });
    
    x = this;//////////////////
  }
  stage1Done(){
    hidePopUps();
    if (this.state.ready.length >= 2){
      globalCrew = this.state.ready;
      socket.emit('too_slow', this.state.waitingFor);
      hideStage("stage1");
      showStage("stage2");
      nextSquare();
    } else {
      document.getElementById("tooFewReady").style.display = "block";
    };
  }
  render() {
    return <div>
      <div id="fillBoards" style={{backgroundColor: 'lightblue'}}>
        <h2 style={{fontSize: '30px', padding: '10px'}}>Fill in your boards</h2>
      </div>
      <button id="doneBtn" onClick={this.stage1Done}>Done</button>
      <div>
        <div className="stage1col" style={{left: '10px'}}>
          <h2>Waiting for:</h2>
          <div className="crewDiv">
            <ul>
              {this.state.waitingFor.slice().reverse().map(crewMember => (
                <li style={{position:'relative'}}>
                  <div className="nameLiDiv">{crewMember}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="stage1col" style={{right: '10px'}}>
          <h2>Ready:</h2>
          <div className="crewDiv">
            <ul>
              {this.state.ready.slice().reverse().map(crewMember => (
                <li style={{position:'relative'}}>
                  <div className="nameLiDiv">{crewMember}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>;
  }
};

class Board extends React.Component {
  constructor(){
    super();
    this.state = {done:[]};
    
    theBoard=this;
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
            <td id={row+col} className="square" style={{backgroundColor:(this.state.done.includes(row+col)?"#CC6600":"white")}}></td>
          ))}
        </tr>
      ))}
      </table>;
  }
};

class CurrentSquare extends React.Component{
  constructor(){
    super();
    this.state = {currentSquare:"??"};
    
    theCurrentSquare = this;
  }
  render(){
    return <div className="currentSquare">
      <h2>Current Square: {this.state.currentSquare}</h2>
    </div>;
  }
};

class ChooseNextSquare extends React.Component{
  constructor(){
    super();
    this.state = {players: []};
    
    theChooseNextSquare = this;
  }
  addPlayer(player){
    this.setState({players:this.state.players.concat([player])});
  }
  removePlayers(players){
    this.setState({players:this.state.players.filter(player=>!players.includes(player))});
  }
  render(){
    return <div className="chooseNextSquare">
      <h2>Choose&nbsp;Next&nbsp;Square:</h2>
      <div>
        <ul>
          {this.state.players.map(player => (
            <li style={{position:'relative'}}>
              <div>{player}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>;
  }
};

var remainingSquares = ["A1","A2","A3","A4","A5","A6","A7",
               "B1","B2","B3","B4","B5","B6","B7",
               "C1","C2","C3","C4","C5","C6","C7",
               "D1","D2","D3","D4","D5","D6","D7",
               "E1","E2","E3","E4","E5","E6","E7",
               "F1","F2","F3","F4","F5","F6","F7",
               "G1","G2","G3","G4","G5","G6","G7"];

function NextSquareConfirm(){
  return (<React.Fragment>
    <div className="popUp"><div>
      <h3>Confirm Next Square</h3>
      <hr />
      <div>
        <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>The crewmembers below are not ready and will be dropped from the game.</p>
        <div style={{display: 'inline-block'}}>
          <button onClick={nextSquareMid}>Okay!</button>
          <button onClick={hidePopUps}>Wait!</button>
        </div>
      </div>
      <div className="crewDiv" style={{maxHeight: 'calc(100vh - 400px)'}}>
        <ul>
          {unreadyCrew.map(crewMember => (
            <li style={{position:'relative'}}>
              <div className="nameLiDiv">{crewMember}</div>
            </li>
          ))}
        </ul>
      </div>
    </div></div>
  </React.Fragment>);
};

function nextSquare(){
  hidePopUps();
  if (globalCrew.length - unreadyCrew.length >= 2){
    if (unreadyCrew.length == 0){
      nextSquareMid();
    } else {
      ReactDOM.render(<NextSquareConfirm />, document.getElementById("nextSquareConfirm"));
      document.getElementById("nextSquareConfirm").childNodes[0].style.display = "block";
    };
  } else {
    document.getElementById("tooFewReady").style.display = "block";
  };
};

function nextSquareMid(){
  socket.emit('too_slow', unreadyCrew);
  if (document.getElementById("nextSquareConfirm").childNodes.length != 0){
    document.getElementById("nextSquareConfirm").childNodes[0].style.display = "none";
  };
  if (theChooseNextSquare.state.players.length === 0){
    var current = remainingSquares[Math.floor(Math.random() * remainingSquares.length)];
    remainingSquares = remainingSquares.filter(e=>e!=current);
    theCurrentSquare.setState({currentSquare: current});
    theBoard.squareDone(current);
    socket.emit('current_square', current);
  } else {
    toChoose = theChooseNextSquare.state.players[0];
    socket.emit('choose', toChoose);
    hidePopUps();
    document.getElementById("waitForChoose").style.display = "block";
  };
  globalCrew = globalCrew.filter(e=>!unreadyCrew.includes(e));
  unreadyCrew = globalCrew;
};

function tooSlowToChoose(){
  globalCrew = globalCrew.filter(e=>e!=toChoose);
  socket.emit('too_slow', [toChoose]);
  nextSquare();
};

socket.on('player_gone', function(player){
  hidePopUps();
  document.getElementById("playerGone").style.display = "block";
});

socket.on('chose', function(square){
  hidePopUps();
  remainingSquares = remainingSquares.filter(e=>e!=square);
  theCurrentSquare.setState({currentSquare: square});
  theBoard.squareDone(square);
  socket.emit('current_square', square);
});

socket.on('got_choose', function(player){
  theChooseNextSquare.addPlayer(player);
  socket.emit('choose_next_square', player);
});

socket.on('request_state', function(){
  socket.emit('state', [theBoard.state, theCurrentSquare.state, theChooseNextSquare.state]);
});

class Stage3 extends React.Component {
  constructor(){
    super();
    
    theStage3 = this;
  }
  render(){
    return <div className="leaderboard">
      <button className="backHome" onClick={() => {window.location='index.html';}}>Back to the Homepage</button>
      <h3 style={{top: "120px"}}>The Winner was {this.props.leaderboard[0].name} with {this.props.leaderboard[0].score}</h3>
      <h3 style={{top: "170px"}}>Leaderboard:</h3>
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

socket.on('ready', function(name){
  unreadyCrew = unreadyCrew.filter(e=>e!=name);
});

class EventReport extends React.Component {
  constructor(){
    super();
    this.state = {queue: []};
    
    this.pop = this.pop.bind(this);
    
    theEventReport = this;
  }
  addEvent(someEvent){
    this.setState({queue: [someEvent].concat(this.state.queue)});
  }
  pop(){
    this.setState({queue: this.state.queue.slice(1)});
  }
  render(){
    return <div id="eventReport">
      {this.state.queue.map(e=>(<div>{eventReportThing(e)}</div>))}
    </div>;
  }
};

socket.on('some_event', function(someEvent){theEventReport.addEvent(someEvent);});
  
function eventReportThing(someEvent){
  switch(someEvent[0]){
    case "rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[1]} has robbed {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[1]} has killed {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "present":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Present!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["present"]}
        </div>
        <hr />
        <p>{someEvent[1]} has given {someEvent[2]} a present!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "parrot":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Gobby Parrot!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["parrot"]}
        </div>
        <hr />
        <p>{someEvent[1]} has got {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "swap":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Swap!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["Swap"]}
        </div>
        <hr />
        <p>{someEvent[1]} has swapped score with {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
  };
};

var toRender = <div>
    <div className="stage0">
      <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
        <div style={{position: 'relative',top: '-10%'}}>
          <button id="crewAssembled" onClick={assembleCrew}>Crew Assembled!</button>
          <KeyBox />
        </div>
        <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
        <CrewUl />
      </div> 
    </div>
    <div id="stage1" className="stage1"></div>
    <div id="stage2" className="stage2">
      <Board />
      <CurrentSquare />
      <ChooseNextSquare />
      <button id="nextSquare" onClick={nextSquare}><h2>Next&nbsp;Square</h2></button>
      <div id="nextSquareConfirm" />
      <EventReport />
    </div>
    <div id="stage3" className="stage3"></div>
    <div id="popUps">
      
      <div id="waiting" className="popUp"><div>
          <h3>Waiting</h3>
          <hr />
          <p>This won&apos;t take too long, I hope!</p>
      </div></div>
        
      <div id="tooFew" className="popUp"><div>
          <h3>Too Few Crewmembers</h3>
          <hr />
          <p>Yarr, ye be needin&apos; at least 2 players.</p>
          <button className="close" onClick={hidePopUps}>Okay!</button>
      </div></div>
        
      <div id="tooFewReady" className="popUp"><div>
          <h3>Too Few Crewmembers Ready</h3>
          <hr />
          <p>Yarr, ye be needin&apos; at least 2 ready players before ye can drop people for bein&apos; slow.</p>
          <button className="close" onClick={hidePopUps}>Okay!</button>
      </div></div>
        
      <div id="waitForChoose" className="popUp"><div>
          <h3>Waiting For Next Square to be Chosen</h3>
          <hr />
          <p>This won&apos;t take too long, I hope!</p>
          <button className="close" onClick={tooSlowToChoose}>Too Slow</button>
      </div></div>
        
      <div id="playerGone" className="popUp"><div>
          <h3>Player Gone</h3>
          <hr />
          <p>They not be &apos;ere any more. :(</p>
          <button className="close" onClick={nextSquare}>Next&nbsp;Square</button>
      </div></div>
                                               
  </div>
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key');
