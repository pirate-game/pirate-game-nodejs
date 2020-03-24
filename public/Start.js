var root = document.getElementById('root');
var socket = io();
var key = '';
var globalCrew = [];

socket.on('debugmsg', function(msg){console.log(msg)});

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
          {this.state.crew.map(crewMember => (
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
            {this.state.crew.map(crewMember => (
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
  } else {
    document.getElementById("tooFew").style.display = "block";
  };
};

class Stage1 extends React.Component {
  constructor() {
    super();
    this.state = {waitingFor: globalCrew, ready: []};
    
    this.tooSlow = this.tooSlow.bind(this);
  }
  tooSlow(somePlayer){
    if (globalCrewthis.state.ready.length >= 2){
      this.setState({waitingFor:this.state.waitingFor.filter((x)=>(x!=somePlayer))});
      globalCrew = globalCrew.filter((x)=>(x!=somePlayer));
      socket.emit('too_slow', somePlayer);
    } else {
      hidePopUps();
      document.getElementById("tooFewReady").style.display = "block";
    };
  }
  render() {
    return <div>
      <div style={{backgroundColor: 'lightblue'}}>
        <h2>Fill in your boards</h2>
      </div>
      <button>Done</button>
      <h2>Waiting for:</h2>
      <ul>
        {this.state.waitingFor.map(crewMember => (
          <li style={{position:'relative'}}>
            <div className="cross" onClick={() => this.tooSlow(crewMember)}>&times;</div>
            <div className="nameLiDiv">{crewMember}</div>
          </li>
        ))}
      </ul>
      <h2>Ready:</h2>
      <ul>
        {this.state.ready.map(crewMember => (
          <li style={{position:'relative'}}>
            <div className="nameLiDiv">{crewMember}</div>
          </li>
        ))}
      </ul>
    </div>;
  }
};

var toRender = <div>
    <div className="stage0">
      <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
        <link rel="stylesheet" type="text/css" href="css/PopUp.css" />
        <div style={{position: 'relative',top: '-10%'}}>
          <link rel="stylesheet" type="text/css" href="css/Start.css" />
          <button id="crewAssembled" onClick={assembleCrew}>Crew Assembled!</button>
          <KeyBox />
        </div>
        <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
        <CrewUl />
      </div> 
    </div>
  </div>
  <div className="stage1">
    <Stage1 />
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
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key');
