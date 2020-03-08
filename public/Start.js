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
  show(){
    this.state.visibility = 'visible';
  }
  hide(){
    this.state.visibility = 'hidden';
  }
};

ReactDOM.render(<KeyBox id='KeyBox' />, root);

socket.on('key', function(msg){
  key = msg;
  document.getElementById('KeyBox').show();
});

socket.emit('request_key', '');
