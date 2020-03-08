var root = document.getElementById('root');
var socket = io();
var key = '';

class KeyBox extends React.Component {
  constructor() {
    super();
    this.state = {visibility: 'hidden'};
  }
  render() {
    return <h2 style={{visibility: this.state.visibility}}> Key: {key} </h2>;
  }
  show = () => {this.setState({visibility: 'visible'})}
};

//var keyBox = <KeyBox />;
var keyBox = new KeyBox();
keyBox.show();

ReactDOM.render(keyBox, root);

socket.on('key', function(msg){
  key = msg;
  
});

socket.emit('request_key', '');
