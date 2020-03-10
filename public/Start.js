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

var crewUl = document.getElementById("crewUl");

class CrewUl extends React.Component {
  constructor() {
    super();
    this.state = {crew: []};
  }
  render() {
    return <div id="crewDiv">
      <ul id="crewUl">
          {this.state.crew(crewMember => (
            <li>{crewMember.name}</li>
          ))}
      </ul>
    </div>;
  };

  socket.on('request_join', function(name){
  });
};



var toRender = <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
  <div style={{position: 'relative',top: '-10%'}}>
    <link rel="stylesheet" type="text/css" href="css/Start.css" />
    <button id="crewAssembled">Crew Assembled!</button>
    <KeyBox />
  </div>
  <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
  <CrewUl />
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key', '');
