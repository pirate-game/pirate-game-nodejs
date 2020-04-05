var root = document.getElementById('root');
var socket = io();

var theBoard;
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;

const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;

function range(someInt){
  var out = [];
  for (var i = 0; i < someInt; i++){
    out.push(i);
  };
  return out;
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

function attemptWatch(){
  var key = document.getElementById("gameKey").value;
  if (keyPattern.test(key)){
    hidePopUps();
    document.getElementById("waiting").style.display = "block";
    socket.emit('attempt_watch', key);
  } else {
    hidePopUps();
    document.getElementById("invalidKey").style.display = "block";
  };
};

socket.on('no_such_game', function(){
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.display = "block";  
});

socket.on('start_game', function(){
  hidePopUps();
  hideStage("stage0");
  showStage("stage2");
});

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

socket.on('current_square', function(square){
  theCurrentSquare.setState({currentSquare: square});
  theBoard.squareDone(square);
});

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

socket.on('choose_next_square', function(player){
  theChooseNextSquare.addPlayer(player)
});

socket.on('too_slow', function(who){
  theChooseNextSquare.removePlayers(who)
});

socket.on('choose', function(player){
  theChooseNextSquare.removePlayers([player])
});


/*var root = document.getElementById('root');
var socket = io();
var key = '';
var globalCrew = [];

var x;//////////////
var theBoard;
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;

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

function nextSquare(){
  if (theChooseNextSquare.players.length === 0){
    var current = remainingSquares[Math.floor(Math.random() * remainingSquares.length)];
    remainingSquares = remainingSquares.filter(e=>e!=current);
    theCurrentSquare.setState({currentSquare: current});
    theBoard.squareDone(current);
    socket.emit('current_square', current);
  } else {
    var toChoose = theChooseNextSquare.state.players[0];
    socket.emit('choose', toChoose);
    hidePopUps();
    document.getElementById("waitForChoose").style.display = "block";
  };
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
});*/

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

socket.on('game_over', function(results){
  ReactDOM.render(<Stage3 leaderboard={results} />, document.getElementById("stage3"));
});

var toRender = <div>
  <div className="stage0">
    <h2 style={{marginTop: 0}}>What game be ye watchin&apos;?</h2>
    <input type="text" id="gameKey" maxLength="6" />
    <button id="watch" onClick={attemptWatch}>Watch</button>
  </div>
  <div className="stage2">
    <Board />
    <CurrentSquare />
    <ChooseNextSquare />
  </div>
  <div id="stage3" className="stage3" />
  <div id="popUps">
    <div id="waiting" className="popUp"><div>
        <h3>Waiting</h3>
        <hr />
        <p>This won&apos;t take too long, I hope!</p>
    </div></div>
      
    <div id="invalidKey" className="popUp"><div>
      <h3>Invalid Key</h3>
      <hr />
      <p>Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. &quot;beef54&quot;.
        <br />Please use all lower-case letters.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
    </div></div>

    <div id="noSuchGame" className="popUp"><div>
        <h3>No Such Game</h3>
        <hr />                                                                                                       
        <p>You&apos;ve probably mistyped your key. Try again.</p>
        <button className="close" onClick={hidePopUps}>Okay!</button>                                                                    
    </div></div>
  </div>
</div>;

ReactDOM.render(toRender, root);
