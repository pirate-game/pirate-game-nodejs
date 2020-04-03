var root = document.getElementById('root');
var socket = io();
var key = '';
var globalCrew = [];

var x;//////////////
var theBoard;

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
    </div>
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
  </div>
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key');