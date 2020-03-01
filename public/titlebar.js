function Nbsp() {
  return '\u00A0';
}

const titlebar = <div>
      			<link rel="stylesheet" type="text/css" href="css/titlebar.css" />
	    		  <h1 id="title"><u><Nbsp />The<Nbsp />Pirate<Nbsp />Game<Nbsp /></u></h1>
		</div>;
ReactDOM.render(titlebar, document.getElementById("titlebar"));
