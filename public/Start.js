var root = document.getElementById('root');
var socket = io();
var key = '';

class KeyBox extends React.Component {
  constructor() {
    super();
    this.state = {visibilty: 'hidden'};
  }
  render() {
    return <h2 style={{visibilty: this.state.visibility}}> Key: {key} </h2>;
  }
};

var keyBox = <KeyBox />;

ReactDOM.render(keyBox, root);

socket.on('key', function(msg){
  key = msg;
  keyBox.state.visibility = 'visible';
});

socket.emit('request_key', '');
