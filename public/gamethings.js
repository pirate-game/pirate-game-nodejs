function unloadFn(event){event.returnValue="";};
window.addEventListener("beforeunload",unloadFn);];

socket.on('debugmsg', function(msg){console.log(msg)});

function showStage(stage){
  var stageElements = document.getElementsByClassName(stage);
  for (var i = 0; i < stageElements.length; i++){
    stageElements[i].style.display = "block";
  };
};

function hideStage(stage){
  var stageElements = document.getElementsByClassName(stage);
  for (var i = 0; i < stageElements.length; i++){
    stageElements[i].style.display = "none";
  };
};

function hidePopUps(){
  var popUps = document.getElementsByClassName("popUp");
  for (var i = 0; i < popUps.length; i++){
    popUps[i].style.display = "none";
  };
};
