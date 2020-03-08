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
    return <div id="keyBox" style={{backgroundColor: "lightblue"}}>
      <h2> Key: {this.state.key} </h2>
    </div>;
  };
};

var toRender = <div>
  <div style={{position: 'relative'}}>
    <link rel="stylesheet" type="text/css" href="css/Start.css" />
    <button id="crewAssembled">Crew Assembled!</button>
    <KeyBox />
    <h2 style={{float: left;}}>Crew:</h2>
  </div>
  <div id="crewDiv">
    <ul>
      <li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li><li>Sometext</li>
    </ul>
  </div>
</div>;

ReactDOM.render(toRender, root);

socket.emit('request_key', '');
