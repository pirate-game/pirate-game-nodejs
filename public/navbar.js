const navbar = <div>
      			<link rel="stylesheet" type="text/css" href="css/navbar.css" />
	    		<ul>
				<li><a id="logo" href="index.html"><img border="0" src="logo.png" /></a></li>
				<li><a href="Start.html">Start a<br />Game</a></li>
				<li><a href="Join.html">Join a<br />Game</a></li>
				<li><a href="Watch.html">Watch a<br />Game</a></li>
				<li><a href="Acknowledge.html">Acknowledgements</a></li>
				<li><h1 id="title" style={{whiteSpace: "nowrap"}}>The Pirate Game</h1></li>
	    		</ul>
		</div>;
ReactDOM.render(navbar, document.getElementById("nav"));
