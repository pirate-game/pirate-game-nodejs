var a = new URLSearchParams(window.location.search);

var toRender = <img src={"imgs/"+a.get("which")} />;

ReactDOM.render(toRender, document.getElementById('root'););
