var root = document.getElementById('root');
var socket = io();

var theBoard;
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;
var theEventReport;

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

socket.on('state', function(gameState){
  theBoard.setState(gameState[0]);
  theCurrentSquare.setState(gameState[1]);
  theChooseNextSquare.setState(gameState[2]);
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

socket.on('game_over', function(results){
  ReactDOM.render(<Stage3 leaderboard={results} />, document.getElementById("stage3"));
  hideStage("stage2");
  showStage("stage3");
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
    this.setState({queue: this.state.queue.slice(0, -1)});
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
        <p>{someEvent[1]} has got {someEvent[2] || 0}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "swap":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Swap!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["swap"]}
        </div>
        <hr />
        <p>{someEvent[1]} has swapped score with {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being robbed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being killed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_swap":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["swap"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being swapped with by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;  
    case "mirror_rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Mirrored Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[1]} mirrored being robbed by {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "mirror_kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Mirrored Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[1]} mirrored being killed by {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_mirror_rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Mirrored Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being mirror robbed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_mirror_kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Mirrored Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being mirror killed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "mirror_mirror_rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Mirrored Mirrored Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[1]} mirrored being mirror robbed by {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "mirror_mirror_kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Mirrored Mirrored Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[1]} mirrored being mirror killed by {someEvent[2]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_mirror_mirror_rob":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Mirrored Mirrored Rob!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["rob"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being mirror mirror robbed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
    case "shielded_mirror_mirror_kill":
      return (<div>
        <h3 style={{display: "inline-block",verticalAlign: "top"}}>Shielded Mirrored Mirrored Kill!</h3>
        <div style={{display:"inline-block",position: "absolute",right: "10px",top: "7px"}} className="square">
          {things["kill"]}
        </div>
        <hr />
        <p>{someEvent[2]} shielded being mirror mirror killed by {someEvent[1]}!</p>
        <button onClick={theEventReport.pop} style={{height:"unset",display:"block",marginTop:"10px"}}>Okay!</button>
      </div>);
      break;
  };
};

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
    <EventReport />
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
