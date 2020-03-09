var root = document.getElementById('root');
var socket = io();
var key = '';

var toRender = 
<div>
  <link rel="stylesheet" type="text/css" href="css/Join.css" />
  <div className="first">
    <h2>What be your name?</h2>
  </div>
  <div className="last">
    <h2>What game be ye joinin&apos;?</h2>
  </div>
  <button id="join">Join</button>
</div>;

ReactDOM.render(toRender, root);
