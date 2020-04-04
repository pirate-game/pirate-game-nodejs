var root = document.getElementById('root');
var socket = io();

var theBoard;
var theCurrentSquare;
var theChooseNextSquare;

const keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;

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
