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
    return <h2> Key: {this.state.key} </h2>;
  };
};

var keyBox = <KeyBox />;

ReactDOM.render(keyBox, root);

socket.emit('request_key', '');
