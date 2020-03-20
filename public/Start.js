var root = document.getElementById('root');
var socket = io();
var key = '';

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
    });
  }
  render() {
    return 
    <React.Fragment>
      <div id="firstCrewDiv" className="crewDiv">
        <ul>
          {this.state.crew.map(crewMember => (
            <li>{crewMember}</li>
          ))}
        </ul>
      </div>
      <div id="crewAssembled" className="popUp"><div>
        <h3>Crew Assembled</h3>
        <hr />
        <p></p>
        <button className="close" onClick={hidePopUps}>Okay!</button>
        <div id="popUpCrewDiv" className="crewDiv">
          <ul>
            {this.state.crew.map(crewMember => (
              <li>{crewMember}</li>
            ))}
          </ul>
        </div>
      </div></div>
    </React.Fragment>;
  };
};



var toRender = <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
  <link rel="stylesheet" type="text/css" href="css/PopUp.css" />
  <div style={{position: 'relative',top: '-10%'}}>
    <link rel="stylesheet" type="text/css" href="css/Start.css" />
    <button id="crewAssembled">Crew Assembled!</button>
    <KeyBox />
  </div>
  <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
  <CrewUl />
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key');
