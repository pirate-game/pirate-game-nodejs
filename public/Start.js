var root = document.getElementById('root');
var socket = io();
var key = '';
var globalCrew = [];

socket.on('debugmsg', function(msg){console.log(msg)});

function hidePopUps(){
  for (var t = 0; t < popUps.length; t++){
    popUps[t].style.display = "none";
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
    
    this.changeCrew = this.changeCrew.bind(this);//Fancy js thing
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
};

var toRender = <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
  <link rel="stylesheet" type="text/css" href="css/PopUp.css" />
  <div style={{position: 'relative',top: '-10%'}}>
    <link rel="stylesheet" type="text/css" href="css/Start.css" />
    <button id="crewAssembled" onClick={assembleCrew}>Crew Assembled!</button>
    <KeyBox />
  </div>
  <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
  <CrewUl />
  <div id="popUps">
    <div id="waiting" className="popUp"><div>
      <h3>Waiting</h3>
      <hr />
      <p>This won&apos;t take too long, I hope!</p>
    </div></div>
  </div>
  <div id="tooFew" className="popUp"><div>
      <h3>Too Few Crewmembers</h3>
      <hr />
      <p>Yarr, ye be needin&apos; at least 2 players.</p>
      <button className="close" onClick={hidePopUps}>Okay!</button>
  </div></div> 
</div>;

ReactDOM.render(toRender, root);

var popUps = document.getElementsByClassName("popUp");  

socket.emit('request_key');
