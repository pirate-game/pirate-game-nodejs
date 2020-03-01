import './navbar.css';

function Nbsp() {
  return '\u00A0';
}

const navbar = <div>
	    		<ul>
				<li><a id="logo" href="index.html"><img border="0" src="logo.png" /></a></li>
				<li><a href="Start.html">Start<Nbsp />a<br />Game</a></li>
				<li><a href="Join.html">Join<Nbsp />a<br />Game</a></li>
				<li><a href="Watch.html">Watch<Nbsp />a<br />Game</a></li>
				<li><a href="Acknowledge.html">Acknowledgements</a></li>
	    		</ul>
	    		<h1 id="title"><u><Nbsp />The<Nbsp />Pirate<Nbsp />Game<Nbsp /></u></h1>
		</div>;
ReactDOM.render(navbar, document.getElementById("nav"));
