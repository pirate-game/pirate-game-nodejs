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
  speak() {
    console.log(`${this.name} barks.`);
  }
};

var keyBox = <KeyBox />;
keyBox.speak();

ReactDOM.render(keyBox, root);

socket.on('key', function(msg){
  key = msg;
  
});

socket.emit('request_key', '');
