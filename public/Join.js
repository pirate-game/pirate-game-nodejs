"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var root = document.getElementById('root');
var socket = io();
var theBoard;
var theThingsBox;
var theStage3;
var theChoosePlayer;
var myName;
var clickMod10 = 0;
var waitingOn = false;
var globalWhat = "";
var globalName = "";
var globalAmount = null;

function test() {
  hideStage("stage0");
  showStage("stage3");
}

;
var namePattern = /^[\w\'\-\". ]*$/;
var exclPattern = /^\s*$/;
var keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;
var squarePattern = /^[ABCDEFG][1234567]$/;
var numPattern = /^[0-9]*$/;

function ordinal(someInt) {
  var suffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

  switch (someInt % 100) {
    case 11:
    case 12:
    case 13:
      return someInt.toString() + "th";
      break;

    default:
      return someInt.toString() + suffixes[someInt % 10];
  }

  ;
}

;

function range(someInt) {
  var out = [];

  for (var i = 0; i < someInt; i++) {
    out.push(i);
  }

  ;
  return out;
}

;
var thingsArray = ["rob", "kill", "present", "parrot", "swap", "choose", "shield", "mirror", "bomb", "double", "bank", "200", "1000", "3000", "5000"];
var things = {
  "rob": /*#__PURE__*/React.createElement("img", {
    src: "imgs/rob.png"
  }),
  "kill": /*#__PURE__*/React.createElement("img", {
    src: "imgs/kill.svg"
  }),
  "present": /*#__PURE__*/React.createElement("img", {
    src: "imgs/present.png"
  }),
  "parrot": /*#__PURE__*/React.createElement("img", {
    src: "imgs/parrot.png"
  }),
  "swap": /*#__PURE__*/React.createElement("img", {
    src: "imgs/swap.png"
  }),
  "choose": /*#__PURE__*/React.createElement("img", {
    src: "imgs/c.png"
  }),
  "shield": /*#__PURE__*/React.createElement("img", {
    src: "imgs/shield.svg"
  }),
  "mirror": /*#__PURE__*/React.createElement("img", {
    src: "imgs/mirror.png"
  }),
  "bomb": /*#__PURE__*/React.createElement("img", {
    src: "imgs/bomb.svg"
  }),
  "double": /*#__PURE__*/React.createElement("img", {
    src: "imgs/double.svg"
  }),
  "bank": /*#__PURE__*/React.createElement("img", {
    src: "imgs/bank.svg"
  }),
  "200": /*#__PURE__*/React.createElement("img", {
    src: "imgs/sym200.svg"
  }),
  "1000": /*#__PURE__*/React.createElement("img", {
    src: "imgs/sym1000.svg"
  }),
  "3000": /*#__PURE__*/React.createElement("img", {
    src: "imgs/sym3000.svg"
  }),
  "5000": /*#__PURE__*/React.createElement("img", {
    src: "imgs/sym5000.svg"
  })
};

function thingsInverse(thing) {
  for (var i = 0; i < thingsArray.length; i++) {
    if (things[thingsArray[i]].props.src == thing.props.src) {
      return thingsArray[i];
    }

    ;
  }

  ;
  return "";
}

;
var nextPlace = {
  "rob": "placekill",
  "kill": "placepresent",
  "present": "placeparrot",
  "parrot": "placeswap",
  "swap": "placechoose",
  "choose": "placeshield",
  "shield": "placemirror",
  "mirror": "placebomb",
  "bomb": "placedouble",
  "double": "placebank",
  "bank": "place5000"
};
socket.on('no_such_game', function () {
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.display = "block";
});
socket.on('name_taken', function () {
  document.getElementById("pirateName").value = "";
  hidePopUps();
  document.getElementById("nameTaken").style.display = "block";
});
socket.on('game_unavailable', function () {
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("gameUnavailable").style.display = "block";
});
socket.on('join_rejected', function () {
  document.getElementById("pirateName").value = "";
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("joinRejected").style.display = "block";
});
socket.on('start_game', function () {
  hidePopUps();
  hideStage("stage0");
  showStage("stage1");
});
socket.on('too_slow', function () {
  hidePopUps();
  document.getElementById("tooSlow").style.display = "block";
  socket.close();
});

function attemptJoin() {
  var name = document.getElementById("pirateName").value;
  var key = document.getElementById("gameKey").value;

  if (namePattern.test(name) && !exclPattern.test(name)) {
    if (keyPattern.test(key)) {
      hidePopUps();
      document.getElementById("waiting").style.display = "block";
      socket.emit('attempt_join', name, key);
      myName = name;
    } else {
      hidePopUps();
      document.getElementById("invalidKey").style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidName").style.display = "block";
  }

  ;
}

;

function ordThing(i) {
  switch (i) {
    case 0:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/rob.png"
      });
      break;

    case 1:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/kill.svg"
      });
      break;

    case 2:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/present.png"
      });
      break;

    case 3:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/parrot.png"
      });
      break;

    case 4:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/swap.png"
      });
      break;

    case 5:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/c.png"
      });
      break;

    case 6:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/shield.svg"
      });
      break;

    case 7:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/mirror.png"
      });
      break;

    case 8:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/bomb.svg"
      });
      break;

    case 9:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/double.svg"
      });
      break;

    case 10:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/bank.svg"
      });
      break;

    case 11:
      return /*#__PURE__*/React.createElement("img", {
        src: "imgs/sym5000.svg"
      });
      break;

    default:
      if (i < 14) {
        return /*#__PURE__*/React.createElement("img", {
          src: "imgs/sym3000.svg"
        });
      } else if (i < 24) {
        return /*#__PURE__*/React.createElement("img", {
          src: "imgs/sym1000.svg"
        });
      } else {
        return /*#__PURE__*/React.createElement("img", {
          src: "imgs/sym200.svg"
        });
      }

      ;
  }

  ;
}

;

var Board = /*#__PURE__*/function (_React$Component) {
  _inherits(Board, _React$Component);

  var _super = _createSuper(Board);

  function Board() {
    var _this;

    _classCallCheck(this, Board);

    _this = _super.call(this);
    var board = [];

    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 7; j++) {
        board[["A", "B", "C", "D", "E", "F", "G"][i] + ["1", "2", "3", "4", "5", "6", "7"][j]] = null;
      }

      ;
    }

    ;
    _this.state = {
      board: {},
      done: [],
      taken: []
    };
    theBoard = _assertThisInitialized(_this);
    return _this;
  }

  _createClass(Board, [{
    key: "fillRandom",
    value: function fillRandom() {
      var possibleSquares = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "G1", "G2", "G3", "G4", "G5", "G6", "G7"];
      var randBoard = {};

      for (var i = 0; i < 49; i++) {
        var current = possibleSquares[Math.floor(Math.random() * possibleSquares.length)];
        possibleSquares = possibleSquares.filter(function (e) {
          return e != current;
        });
        randBoard[current] = ordThing(i);
      }

      ;
      this.setState({
        board: randBoard
      });
    }
  }, {
    key: "updateBoard",
    value: function updateBoard(square, thing) {
      var temp = Object.assign({}, this.state.board);
      temp[square] = things[thing];
      this.setState({
        board: temp,
        taken: this.state.taken.concat([square])
      });
      clickMod10 = 0;
    }
  }, {
    key: "updateBoardM",
    value: function updateBoardM(squares, thing) {
      var temp = Object.assign({}, this.state.board);

      for (var i = 0; i < squares.length; i++) {
        temp[squares[i]] = things[thing];
      }

      ;
      this.setState({
        board: temp,
        taken: this.state.taken.concat(squares)
      });
      clickMod10 = 0;
    }
  }, {
    key: "squareDone",
    value: function squareDone(square) {
      this.setState({
        done: this.state.done.concat([square])
      });
    }
  }, {
    key: "place200",
    value: function place200() {
      var possibleSquares = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "G1", "G2", "G3", "G4", "G5", "G6", "G7"];
      var temp = {};

      for (var i = 0; i < 49; i++) {
        temp[possibleSquares[i]] = things["200"];
      }

      ;
      this.setState({
        board: Object.assign(temp, this.state.board)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/React.createElement("table", {
        id: "board"
      }, /*#__PURE__*/React.createElement("tr", {
        className: "edge"
      }, /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "A"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "B"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "C"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "D"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "E"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "F"), /*#__PURE__*/React.createElement("th", {
        className: "edge"
      }, "G")), ["1", "2", "3", "4", "5", "6", "7"].map(function (col) {
        return /*#__PURE__*/React.createElement("tr", {
          className: "edge"
        }, /*#__PURE__*/React.createElement("th", {
          className: "edge"
        }, col), ["A", "B", "C", "D", "E", "F", "G"].map(function (row) {
          return /*#__PURE__*/React.createElement("td", {
            id: row + col,
            className: "square",
            onClick: function onClick() {
              return squareClicked(row + col);
            }
          }, _this2.state.board[row + col], _this2.state.done.includes(row + col) ? /*#__PURE__*/React.createElement("div", {
            className: "crossout"
          }) : null);
        }));
      }));
    }
  }]);

  return Board;
}(React.Component);

;

function squareClicked(square) {
  var placeInputs = document.getElementsByClassName("placeInput");

  for (var i = 0; i < placeInputs.length; i++) {
    placeInputs[i].value = square;
  }

  ;
  document.getElementById("chooseSquareInput").value = square;

  if (square == "") {
    document.getElementById("placeInput3000First").value = "";
    document.getElementById("placeInput3000Second").value = "";
    var placeInput1000s = document.getElementsByClassName("placeInput1000");

    for (var j = 0; j < placeInput1000s.length; j++) {
      placeInput1000s[j].value = "";
    }

    ;
    clickMod10 = 0;
  } else {
    if (clickMod10 % 2 == 0) {
      document.getElementById("placeInput3000First").value = square;
    } else {
      document.getElementById("placeInput3000Second").value = square;
    }

    ;
    document.getElementById("placeInput1000N" + clickMod10.toString()).value = square;
    clickMod10 = (clickMod10 + 1) % 10;
  }

  ;
}

;

function Place(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "place" + props.which,
    className: "stage1PopUp place"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      display: "inline-block",
      verticalAlign: "top"
    }
  }, "Choose a Square For The '", props.which[0].toUpperCase() + props.which.substr(1), "' Symbol"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      position: "absolute",
      right: "10px",
      top: "15px"
    },
    className: "square"
  }, things[props.which]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "In what grid square would you like to place The '", props.which[0].toUpperCase() + props.which.substr(1), "' Symbol?", /*#__PURE__*/React.createElement("br", null), "You can click on the square to select it."), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "placeInput",
    id: "placeInput" + props.which,
    maxLength: "2"
  }), /*#__PURE__*/React.createElement("button", {
    className: "choosePlace close",
    onClick: function onClick() {
      return attemptPlace(props.which);
    },
    style: {
      height: "unset",
      display: "block",
      marginTop: "10px",
      fontSize: "inherit"
    }
  }, "Okay!"));
}

;

function attemptPlace(which) {
  var proposedSquare = document.getElementById("placeInput" + which).value;
  squareClicked("");

  if (squarePattern.test(proposedSquare)) {
    if (theBoard.state.taken.includes(proposedSquare)) {
      hidePopUps();
      document.getElementById("squareTaken").style.display = "block";
    } else {
      theBoard.updateBoard(proposedSquare, which);
      document.getElementById("place" + which).style.display = "none";
      document.getElementById(nextPlace[which]).style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  }

  ;
}

;

function fillRandomly() {
  theBoard.fillRandom();
  socket.emit('board_ready');
  hideStage("stage1");
  showStage("stage2");
  document.getElementById("waitingForOthers").style.display = "block";
}

;

function fillItMyself() {
  squareClicked("");
  document.getElementById("fillInBoard").style.display = "none";
  document.getElementById("placerob").style.display = "block";
}

;

function attemptPlace5000() {
  var proposedSquare = document.getElementById("placeInput5000").value;
  squareClicked("");

  if (squarePattern.test(proposedSquare)) {
    if (theBoard.state.taken.includes(proposedSquare)) {
      hidePopUps();
      document.getElementById("squareTaken").style.display = "block";
    } else {
      theBoard.updateBoard(proposedSquare, "5000");
      document.getElementById("place5000").style.display = "none";
      document.getElementById("place3000").style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  }

  ;
}

;

function attemptPlace3000() {
  var proposedSquares = [document.getElementById("placeInput3000First").value, document.getElementById("placeInput3000Second").value];
  squareClicked("");

  if (squarePattern.test(proposedSquares[0]) && squarePattern.test(proposedSquares[1])) {
    if (proposedSquares[0] != proposedSquares[1]) {
      if (theBoard.state.taken.includes(proposedSquares[0]) || theBoard.state.taken.includes(proposedSquares[1])) {
        hidePopUps();
        document.getElementById("squareTaken").style.display = "block";
      } else {
        theBoard.updateBoardM(proposedSquares, "3000");
        document.getElementById("place3000").style.display = "none";
        document.getElementById("place1000").style.display = "block";
      }

      ;
    } else {
      hidePopUps();
      document.getElementById("squaresMatch").style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  }

  ;
}

;

function attemptPlace1000() {
  var proposedSquares_ = document.getElementsByClassName("placeInput1000");
  var proposedSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (e) {
    return proposedSquares_[e].value;
  });

  if (proposedSquares.map(function (e) {
    return squarePattern.test(e);
  }).sort()[0]) {
    if (new Set(proposedSquares).size === proposedSquares.length) {
      if (proposedSquares.map(function (e) {
        return theBoard.state.taken.includes(e);
      }).sort().reverse()[0]) {
        hidePopUps();
        document.getElementById("squareTaken").style.display = "block";
      } else {
        theBoard.updateBoardM(proposedSquares, "1000");
        document.getElementById("place1000").style.display = "none";
        document.getElementById("place200").style.display = "block";
      }

      ;
    } else {
      hidePopUps();
      document.getElementById("squaresMatch").style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  }

  ;
}

;

function place200() {
  theBoard.place200();
  socket.emit('board_ready');
  hideStage("stage1");
  showStage("stage2");
  document.getElementById("waitingForOthers").style.display = "block";
}

;
socket.on('current_square', function (square) {
  hidePopUps();
  theBoard.squareDone(square);
  doThing(theBoard.state.board[square]);

  if (waitingOn) {
    okay(globalWhat, globalName, globalAmount);
  }

  ;
  waitingOn = false;
});

function doThing(someThing) {
  switch (someThing.props.src) {
    case things["rob"].props.src:
      socket.emit('request_crew');
      ReactDOM.render( /*#__PURE__*/React.createElement(ChoosePlayer, {
        what: "rob"
      }), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    case things["kill"].props.src:
      socket.emit('request_crew');
      ReactDOM.render( /*#__PURE__*/React.createElement(ChoosePlayer, {
        what: "kill"
      }), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    case things["present"].props.src:
      socket.emit('request_crew');
      ReactDOM.render( /*#__PURE__*/React.createElement(ChoosePlayer, {
        what: "present"
      }), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    case things["parrot"].props.src:
      socket.emit('gobby_parrot', theThingsBox.state.cash);
      ReactDOM.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Gobby Parrot!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["parrot"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Now everyone knows 'ow much cash ye's be 'avin'."), /*#__PURE__*/React.createElement("button", {
        className: "choosePlace close",
        onClick: readyNow,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!")), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    case things["swap"].props.src:
      socket.emit('request_crew');
      ReactDOM.render( /*#__PURE__*/React.createElement(ChoosePlayer, {
        what: "swap"
      }), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    case things["choose"].props.src:
      socket.emit('got_choose');
      ReactDOM.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "You Got 'Choose'"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["choose"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You'll be told what to do when it is your turn to choose."), /*#__PURE__*/React.createElement("button", {
        className: "choosePlace close",
        onClick: readyNow,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!")), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;

    default:
      switch (someThing.props.src) {
        case things["shield"].props.src:
          theThingsBox.setState({
            shield: "yes"
          });
          break;

        case things["mirror"].props.src:
          theThingsBox.setState({
            mirror: "yes"
          });
          break;

        case things["bomb"].props.src:
          theThingsBox.setState({
            cash: null
          });
          break;

        case things["double"].props.src:
          if (theThingsBox.state.cash != null) {
            theThingsBox.setState({
              cash: 2 * theThingsBox.state.cash
            });
          }

          ;
          break;

        case things["bank"].props.src:
          theThingsBox.setState({
            cash: null,
            bank: theThingsBox.state.cash
          });
          break;

        default:
          if (numPattern.test(thingsInverse(someThing))) {
            theThingsBox.setState({
              cash: parseInt(thingsInverse(someThing)) + theThingsBox.state.cash
            });
          }

          ;
          break;
      }

      ;
      ReactDOM.render( /*#__PURE__*/React.createElement(YouGot, {
        what: thingsInverse(someThing)
      }), document.getElementById("squareWas"));
      document.getElementById("squareWas").style.display = "block";
      break;
  }

  ;
}

;

var ChoosePlayer = /*#__PURE__*/function (_React$Component2) {
  _inherits(ChoosePlayer, _React$Component2);

  var _super2 = _createSuper(ChoosePlayer);

  function ChoosePlayer(props) {
    var _this3;

    _classCallCheck(this, ChoosePlayer);

    _this3 = _super2.call(this, props);
    _this3.state = {
      crew: []
    };
    theChoosePlayer = _assertThisInitialized(_this3);
    return _this3;
  }

  _createClass(ChoosePlayer, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "You Got '", this.props.what[0].toUpperCase() + this.props.what.substr(1), "'"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things[this.props.what]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Choose someone to ", this.props.what == "present" ? "give a" : null, " ", this.props.what, ". You can click on them to select them."), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "choosePlayer",
        maxLength: "172"
      }), /*#__PURE__*/React.createElement("div", {
        className: "choosePlayerList"
      }, /*#__PURE__*/React.createElement("ul", null, this.state.crew.map(function (crewMember) {
        return crewMember == myName ? null : /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          },
          onClick: function onClick() {
            document.getElementById("choosePlayer").value = crewMember;
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      }))), /*#__PURE__*/React.createElement("button", {
        className: "choosePlace close",
        onClick: function onClick() {
          return chooseThemTo(_this4.props.what);
        },
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Them!"));
    }
  }]);

  return ChoosePlayer;
}(React.Component);

;
socket.on('crew', function (someCrew) {
  console.log(someCrew);
  theChoosePlayer.setState({
    crew: someCrew
  });
});

function chooseThemTo(what) {
  var name = document.getElementById("choosePlayer").value;
  document.getElementById("choosePlayer").value = "";

  if (namePattern.test(name) && !exclPattern.test(name)) {
    if (theChoosePlayer.state.crew.includes(name) && name != myName) {
      if (what == "swap") {
        socket.emit(what, name, theThingsBox.state.cash);
      } else {
        socket.emit(what, name);
      }

      ;
      readyNow();
    } else {
      hidePopUps();
      document.getElementById("noSuchPlayer").style.display = "block";
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidName2").style.display = "block";
  }

  ;
}

;

function YouGot(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      display: "inline-block",
      verticalAlign: "top"
    }
  }, "You Got '", props.what[0].toUpperCase() + props.what.substr(1), "'"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      position: "absolute",
      right: "10px",
      top: "7px"
    },
    className: "square"
  }, things[props.what]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This doesn't require you to do anything."), /*#__PURE__*/React.createElement("button", {
    className: "choosePlace close",
    onClick: readyNow,
    style: {
      height: "unset",
      display: "block",
      marginTop: "10px"
    }
  }, "Okay!"));
}

;

function readyNow() {
  document.getElementById("squareWas").style.display = "none";
  socket.emit('ready');
}

;

function attemptChooseSquare() {
  var proposedSquare = document.getElementById("chooseSquareInput").value;

  if (squarePattern.test(proposedSquare)) {
    if (theBoard.state.done.includes(proposedSquare)) {
      hidePopUps();
      document.getElementById("squareDone").style.display = "block";
    } else {
      hidePopUps();
      document.getElementById("chooseSquare").style.display = "none";
      document.getElementById("waitingForChoice").style.display = "block";
      socket.emit('chose', proposedSquare);
    }

    ;
  } else {
    hidePopUps();
    document.getElementById("invalidSquare").style.display = "block";
  }

  ;
}

;
socket.on('choose', function () {
  hidePopUps();
  squareClicked("");
  document.getElementById("chooseSquare").style.display = "block";
});

var ThingsBox = /*#__PURE__*/function (_React$Component3) {
  _inherits(ThingsBox, _React$Component3);

  var _super3 = _createSuper(ThingsBox);

  function ThingsBox() {
    var _this5;

    _classCallCheck(this, ThingsBox);

    _this5 = _super3.call(this);
    _this5.state = {
      shield: "no",
      mirror: "no",
      cash: null,
      bank: null
    };
    theThingsBox = _assertThisInitialized(_this5);
    return _this5;
  }

  _createClass(ThingsBox, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "thingsBox"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          top: "5px",
          left: "5px"
        }
      }, /*#__PURE__*/React.createElement("h3", null, "Shield:"), /*#__PURE__*/React.createElement("div", null, this.state.shield == "no" ? null : things["shield"], this.state.shield == "gone" ? /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }) : null)), /*#__PURE__*/React.createElement("div", {
        style: {
          top: "5px",
          right: "5px"
        }
      }, /*#__PURE__*/React.createElement("h3", null, "Mirror:"), /*#__PURE__*/React.createElement("div", null, this.state.mirror == "no" ? null : things["mirror"], this.state.mirror == "gone" ? /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }) : null)), /*#__PURE__*/React.createElement("div", {
        style: {
          bottom: "5px",
          left: "5px"
        }
      }, /*#__PURE__*/React.createElement("h3", null, "CASH:"), /*#__PURE__*/React.createElement("h4", null, this.state.cash)), /*#__PURE__*/React.createElement("div", {
        style: {
          bottom: "5px",
          right: "5px"
        }
      }, /*#__PURE__*/React.createElement("h3", null, "Bank:"), /*#__PURE__*/React.createElement("h4", null, this.state.bank)));
    }
  }]);

  return ThingsBox;
}(React.Component);

;

function ShieldMirror(props) {
  switch (props.mirror) {
    case 0:
      return /*#__PURE__*/React.createElement("div", {
        className: "popUp"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("h3", null, props.name, " is trying to ", props.what, " ", props.what == "swap" ? "with" : null, " you!"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You can ", theThingsBox.shield == "yes" ? "shield yourself or" : null, " ", theThingsBox.mirror == "yes" ? "mirror it or" : null, " just accept it. Click on the symbol to use it. ", props.what == "swap" ? "If you mirrored a swap it would still be a swap." : null), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center"
        }
      }, theThingsBox.state.shield == "yes" ? /*#__PURE__*/React.createElement("div", {
        className: "square",
        onClick: function onClick() {
          return shield(props.what, props.name, props.amount);
        }
      }, things["shield"]) : /*#__PURE__*/React.createElement("div", {
        className: "square"
      }, theThingsBox.state.shield == "gone" ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", things["shield"], " ", /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }), " ") : null), theThingsBox.state.mirror == "yes" ? /*#__PURE__*/React.createElement("div", {
        className: "square",
        onClick: props.what == "swap" ? null : function () {
          return mirror(props.what, props.name, props.amount);
        }
      }, things["mirror"]) : /*#__PURE__*/React.createElement("div", {
        className: "square"
      }, theThingsBox.state.mirror == "gone" ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", things["mirror"], " ", /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }), " ") : null)), /*#__PURE__*/React.createElement("button", {
        className: "close",
        onClick: function onClick() {
          return okay(props.what, props.name, props.amount);
        }
      }, "Okay!")));
      break;

    case 1:
      return /*#__PURE__*/React.createElement("div", {
        className: "popUp"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("h3", null, props.name, " reflected your ", props.what, "!"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You can ", theThingsBox.shield == "yes" ? "shield yourself or" : null, " ", theThingsBox.mirror == "yes" ? "mirror it again or" : null, " just accept it. Click on the symbol to use it."), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center"
        }
      }, theThingsBox.state.shield == "yes" ? /*#__PURE__*/React.createElement("div", {
        className: "square",
        onClick: function onClick() {
          return shield("mirror_" + props.what, props.name, props.amount);
        }
      }, things["shield"]) : /*#__PURE__*/React.createElement("div", {
        className: "square"
      }, theThingsBox.state.shield == "gone" ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", things["shield"], " ", /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }), " ") : null), theThingsBox.state.mirror == "yes" ? /*#__PURE__*/React.createElement("div", {
        className: "square",
        onClick: function onClick() {
          return mirror("mirror_" + props.what, props.name, props.amount);
        }
      }, things["mirror"]) : /*#__PURE__*/React.createElement("div", {
        className: "square"
      }, theThingsBox.state.mirror == "gone" ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", things["mirror"], " ", /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }), " ") : null)), /*#__PURE__*/React.createElement("button", {
        className: "close",
        onClick: function onClick() {
          return okay("mirror_" + props.what, props.name, props.amount);
        }
      }, "Okay!")));
      break;

    case 2:
      return /*#__PURE__*/React.createElement("div", {
        className: "popUp"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("h3", null, props.name, " reflected your reflected ", props.what, "!"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You can shield yourself or just accept it. Click on the symbol to use it."), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "square",
        onClick: function onClick() {
          return shield("mirror_mirror_" + props.what, props.name, props.amount);
        }
      }, things["shield"]), /*#__PURE__*/React.createElement("div", {
        className: "square"
      }, things["mirror"], /*#__PURE__*/React.createElement("div", {
        className: "crossout"
      }))), /*#__PURE__*/React.createElement("button", {
        className: "close",
        onClick: function onClick() {
          return okay("mirror_mirror_" + props.what, props.name, props.amount);
        }
      }, "Okay!")));
      break;
  }

  ;
}

;

function okay(what, name, amount) {
  waitingOn = false;

  if (document.getElementById("shieldMirror").childNodes.length != 0) {
    document.getElementById("shieldMirror").childNodes[0].style.display = "none";
  }

  ;

  switch (what) {
    case "rob":
      socket.emit('robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({
        cash: null
      });
      break;

    case "kill":
      socket.emit('killed', name);
      theThingsBox.setState({
        cash: null
      });
      break;

    case "swap":
      socket.emit('swapped', name, theThingsBox.state.cash);
      theThingsBox.setState({
        cash: amount
      });
      break;

    case "mirror_rob":
      socket.emit('mirror_robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({
        cash: null
      });
      break;

    case "mirror_kill":
      socket.emit('mirror_killed', name);
      theThingsBox.setState({
        cash: null
      });
      break;

    case "mirror_mirror_rob":
      socket.emit('mirror_mirror_robbed', name, theThingsBox.state.cash);
      theThingsBox.setState({
        cash: null
      });
      break;

    case "mirror_mirror_kill":
      socket.emit('mirror_mirror_killed', name);
      theThingsBox.setState({
        cash: null
      });
      break;
  }

  ;
}

;

function shield(what, name, amount) {
  waitingOn = false;
  document.getElementById("shieldMirror").childNodes[0].style.display = "none";
  theThingsBox.setState({
    shield: "gone"
  });

  switch (what) {
    case "rob":
      socket.emit('shielded_rob', name);
      break;

    case "kill":
      socket.emit('shielded_kill', name);
      break;

    case "swap":
      socket.emit('shielded_swap', name);
      break;

    case "mirror_rob":
      socket.emit('shielded_mirror_rob', name);
      break;

    case "mirror_kill":
      socket.emit('shielded_mirror_kill', name);
      break;

    case "mirror_mirror_rob":
      socket.emit('shielded_mirror_mirror_rob', name);
      break;

    case "mirror_mirror_kill":
      socket.emit('shielded_mirror_mirror_kill', name);
      break;
  }

  ;
}

;

function mirror(what, name, amount) {
  waitingOn = false;
  document.getElementById("shieldMirror").childNodes[0].style.display = "none";
  theThingsBox.setState({
    mirror: "gone"
  });
  socket.emit('mirror_' + what, name);
}

;
socket.on('rob', function (name) {
  if (theThingsBox.state.shield == "yes" || theThingsBox.state.mirror == "yes") {
    waitingOn = true;
    globalWhat = "rob";
    globalName = name;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "rob",
      name: name,
      amount: 0,
      mirror: 0
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("rob", name, 0);
  }

  ;
});
socket.on('kill', function (name) {
  if (theThingsBox.state.shield == "yes" || theThingsBox.state.mirror == "yes") {
    waitingOn = true;
    globalWhat = "kill";
    globalName = name;
    globalAmount = 0;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "kill",
      name: name,
      amount: 0,
      mirror: 0
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("kill", name, 0);
  }

  ;
});
socket.on('mirror_rob', function (name) {
  if (theThingsBox.state.shield == "yes" || theThingsBox.state.mirror == "yes") {
    waitingOn = true;
    globalWhat = "mirror_rob";
    globalName = name;
    globalAmount = 0;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "rob",
      name: name,
      amount: 0,
      mirror: 1
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("mirror_rob", name, 0);
  }

  ;
});
socket.on('mirror_kill', function (name) {
  if (theThingsBox.state.shield == "yes" || theThingsBox.state.mirror == "yes") {
    waitingOn = true;
    globalWhat = "mirror_kill";
    globalName = name;
    globalAmount = 0;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "kill",
      name: name,
      amount: 0,
      mirror: 1
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("mirror_kill", name, 0);
  }

  ;
});
socket.on('mirror_mirror_rob', function (name) {
  if (theThingsBox.state.shield == "yes") {
    waitingOn = true;
    globalWhat = "mirror_mirror_rob";
    globalName = name;
    globalAmount = 0;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "rob",
      name: name,
      amount: 0,
      mirror: 2
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("mirror_mirror_rob", name, 0);
  }

  ;
});
socket.on('mirror_mirror_kill', function (name) {
  if (theThingsBox.state.shield == "yes") {
    waitingOn = true;
    globalWhat = "mirror_mirror_kill";
    globalName = name;
    globalAmount = 0;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "kill",
      name: name,
      amount: 0,
      mirror: 2
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("mirror_mirror_kill", name, 0);
  }

  ;
});
socket.on('present', function () {
  theThingsBox.setState({
    cash: theThingsBox.state.cash + 1000
  });
});
socket.on('swap', function (name, amount) {
  if (theThingsBox.state.shield == "yes") {
    waitingOn = true;
    globalWhat = "swap";
    globalName = name;
    globalAmount = amount;
    ReactDOM.render( /*#__PURE__*/React.createElement(ShieldMirror, {
      what: "swap",
      name: name,
      amount: amount,
      mirror: 0
    }), document.getElementById("shieldMirror"));
    document.getElementById("shieldMirror").childNodes[0].style.display = "block";
  } else {
    okay("swap", name, amount);
  }

  ;
});
socket.on('swapped', function (amount) {
  theThingsBox.setState({
    cash: amount
  });
});
socket.on('robbed', function (amount) {
  if (amount != null) {
    theThingsBox.setState({
      cash: theThingsBox.state.cash + amount
    });
  }

  ;
});

var Stage3 = /*#__PURE__*/function (_React$Component4) {
  _inherits(Stage3, _React$Component4);

  var _super4 = _createSuper(Stage3);

  function Stage3() {
    var _this6;

    _classCallCheck(this, Stage3);

    _this6 = _super4.call(this);
    theStage3 = _assertThisInitialized(_this6);
    return _this6;
  }

  _createClass(Stage3, [{
    key: "render",
    value: function render() {
      var _this7 = this;

      var pos = 0;

      for (var i = 0; i < this.props.leaderboard.length; i++) {
        if (this.props.leaderboard[i].name == myName) {
          pos = i;
          break;
        }

        ;
      }

      ;
      return /*#__PURE__*/React.createElement("div", {
        className: "leaderboard"
      }, /*#__PURE__*/React.createElement("button", {
        className: "backHome",
        onClick: function onClick() {
          window.location = 'index.html';
        }
      }, "Back to the Homepage"), /*#__PURE__*/React.createElement("h3", {
        style: {
          top: "120px"
        }
      }, "The Winner was ", this.props.leaderboard[0].name, " with ", this.props.leaderboard[0].score), /*#__PURE__*/React.createElement("h3", {
        style: {
          top: "150px"
        }
      }, "You came ", ordinal(pos + 1), " with ", this.props.leaderboard[pos].score), /*#__PURE__*/React.createElement("h3", {
        style: {
          top: "200px"
        }
      }, "Leaderboard:"), /*#__PURE__*/React.createElement("div", {
        className: "leaderboardList"
      }, /*#__PURE__*/React.createElement("ul", null, range(this.props.leaderboard.length).map(function (place) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative',
            padding: '0 10px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "leaderboardRight"
        }, _this7.props.leaderboard[place].score), /*#__PURE__*/React.createElement("div", {
          className: "leaderboardLeft"
        }, place + 1, ". ", _this7.props.leaderboard[place].name));
      }))));
    }
  }]);

  return Stage3;
}(React.Component);

;
socket.on('get_score', function () {
  socket.emit('got_score', theThingsBox.state.cash + theThingsBox.state.bank);
});
socket.on('game_over', function (results) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Stage3, {
    leaderboard: results
  }), document.getElementById("stage3"));
  hideStage("stage2");
  showStage("stage3");
});
var toRender = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "stage0"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "inputsDiv"
}, /*#__PURE__*/React.createElement("h2", {
  id: "nameH2"
}, "What be your name?"), /*#__PURE__*/React.createElement("input", {
  type: "text",
  id: "pirateName",
  maxLength: "172"
}), /*#__PURE__*/React.createElement("h2", null, "What game be ye joinin'?"), /*#__PURE__*/React.createElement("input", {
  type: "text",
  id: "gameKey",
  maxLength: "6"
})), /*#__PURE__*/React.createElement("button", {
  id: "join",
  onClick: attemptJoin
}, "Join")))), /*#__PURE__*/React.createElement("div", {
  className: "stage1 stage2"
}, /*#__PURE__*/React.createElement(Board, null), /*#__PURE__*/React.createElement("div", {
  className: "stage1"
}, /*#__PURE__*/React.createElement("div", {
  id: "fillInBoard",
  className: "stage1PopUp",
  style: {
    display: "block"
  }
}, /*#__PURE__*/React.createElement("h3", null, "Fill in the Board"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Would you like to fill in your Board yourself, or have it done for you, randomly?"), /*#__PURE__*/React.createElement("button", {
  className: "close",
  id: "leftBtn",
  onClick: fillItMyself
}, "Fill\xA0it", /*#__PURE__*/React.createElement("br", null), "Myself"), /*#__PURE__*/React.createElement("button", {
  className: "close",
  id: "rightBtn",
  onClick: fillRandomly
}, "Randomly")), /*#__PURE__*/React.createElement(Place, {
  which: "rob"
}), /*#__PURE__*/React.createElement(Place, {
  which: "kill"
}), /*#__PURE__*/React.createElement(Place, {
  which: "present"
}), /*#__PURE__*/React.createElement(Place, {
  which: "parrot"
}), /*#__PURE__*/React.createElement(Place, {
  which: "swap"
}), /*#__PURE__*/React.createElement(Place, {
  which: "choose"
}), /*#__PURE__*/React.createElement(Place, {
  which: "shield"
}), /*#__PURE__*/React.createElement(Place, {
  which: "mirror"
}), /*#__PURE__*/React.createElement(Place, {
  which: "bomb"
}), /*#__PURE__*/React.createElement(Place, {
  which: "double"
}), /*#__PURE__*/React.createElement(Place, {
  which: "bank"
}), /*#__PURE__*/React.createElement("div", {
  id: "place5000",
  className: "stage1PopUp place"
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    display: "inline-block",
    verticalAlign: "top"
  }
}, "Choose a Square For The '5000' Symbol"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    top: "7px"
  },
  className: "square"
}, /*#__PURE__*/React.createElement("img", {
  src: "imgs/sym5000.svg"
})), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "In what grid square would you like to place The '5000' Symbol?", /*#__PURE__*/React.createElement("br", null), "You can click on the square to select it."), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput",
  id: "placeInput5000",
  maxLength: "2"
}), /*#__PURE__*/React.createElement("button", {
  className: "choosePlace close",
  onClick: attemptPlace5000,
  style: {
    height: "unset",
    display: "block",
    marginTop: "10px"
  }
}, "Okay!")), /*#__PURE__*/React.createElement("div", {
  id: "place3000",
  className: "stage1PopUp place"
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    display: "inline-block",
    verticalAlign: "top"
  }
}, "Choose Squares For Both of The '3000' Symbols"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    top: "7px"
  },
  className: "square"
}, /*#__PURE__*/React.createElement("img", {
  src: "imgs/sym3000.svg"
})), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "In what grid squares would you like to place The '3000' Symbols?", /*#__PURE__*/React.createElement("br", null), "You can click on squares to select them."), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput3000",
  id: "placeInput3000First",
  maxLength: "2"
}), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput3000",
  id: "placeInput3000Second",
  maxLength: "2"
}), /*#__PURE__*/React.createElement("button", {
  className: "choosePlace close",
  onClick: attemptPlace3000,
  style: {
    height: "unset",
    display: "block",
    marginTop: "10px"
  }
}, "Okay!")), /*#__PURE__*/React.createElement("div", {
  id: "place1000",
  className: "stage1PopUp place"
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    display: "inline-block",
    verticalAlign: "top"
  }
}, "Choose Squares For All of The '1000' Symbols"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    top: "7px"
  },
  className: "square"
}, /*#__PURE__*/React.createElement("img", {
  src: "imgs/sym1000.svg"
})), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "In what grid squares would you like to place The '1000' Symbols?", /*#__PURE__*/React.createElement("br", null), "You can click on squares to select them."), /*#__PURE__*/React.createElement("table", {
  id: "placeInput1000Table"
}, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N0",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N1",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N2",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N3",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N4",
  maxLength: "2"
}))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N5",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N6",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N7",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N8",
  maxLength: "2"
})), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput1000",
  id: "placeInput1000N9",
  maxLength: "2"
})))), /*#__PURE__*/React.createElement("button", {
  className: "choosePlace close",
  onClick: attemptPlace1000,
  style: {
    height: "unset",
    display: "block",
    marginTop: "10px"
  }
}, "Okay!")), /*#__PURE__*/React.createElement("div", {
  id: "place200",
  className: "stage1PopUp place"
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    display: "inline-block",
    verticalAlign: "top"
  }
}, "Placing The '200' Symbols"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    top: "7px"
  },
  className: "square"
}, /*#__PURE__*/React.createElement("img", {
  src: "imgs/sym200.svg"
})), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "The other symbols are all The '200' Symbol and will be placed automatically."), /*#__PURE__*/React.createElement("button", {
  className: "choosePlace close",
  onClick: place200,
  style: {
    height: "unset",
    display: "block",
    marginTop: "10px"
  }
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  className: "stage2"
}, /*#__PURE__*/React.createElement(ThingsBox, null), /*#__PURE__*/React.createElement("div", {
  id: "chooseSquare",
  className: "stage2PopUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
  style: {
    display: "inline-block",
    verticalAlign: "top"
  }
}, "Choose the Next Square"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    top: "7px"
  },
  className: "square"
}, /*#__PURE__*/React.createElement("img", {
  src: "imgs/c.png"
})), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Choose a square.", /*#__PURE__*/React.createElement("br", null), "You can click on the square to select it."), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "placeInput",
  id: "chooseSquareInput",
  maxLength: "2"
}), /*#__PURE__*/React.createElement("button", {
  className: "choosePlace close",
  onClick: attemptChooseSquare,
  style: {
    height: "unset",
    display: "block",
    marginTop: "10px"
  }
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "squareWas",
  className: "stage2PopUp"
}), /*#__PURE__*/React.createElement("div", {
  id: "shieldMirror"
}))), /*#__PURE__*/React.createElement("div", {
  id: "stage3",
  className: "stage3"
}), /*#__PURE__*/React.createElement("div", {
  id: "popUps"
}, /*#__PURE__*/React.createElement("div", {
  id: "invalidName",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Invalid Name"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Please choose a name consisting of alphanumeric characters and spaces but which is not entirely whitespace and especially isn't the empty name. Ye's can also include single and double quotes.", /*#__PURE__*/React.createElement("br", null), "We be sorry if ye's name be 'aving accented characters in it etc."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "invalidName2",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Invalid Name"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Please choose a name consisting of alphanumeric characters and spaces but which is not entirely whitespace and especially isn't the empty name. Ye's can also include single and double quotes."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "invalidKey",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Invalid Key"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. \"beef54\".", /*#__PURE__*/React.createElement("br", null), "Please use all lower-case letters."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "waiting",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This usually means that the game is about to start. :)", /*#__PURE__*/React.createElement("br", null), "However, sometimes it means that something has gone wrong and you may need to try to join again. :("))), /*#__PURE__*/React.createElement("div", {
  id: "noSuchGame",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "No Such Game"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You've probably mistyped your key. Try again."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "nameTaken",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Name Taken"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Great minds think alike! (and fools' seldom differ)", /*#__PURE__*/React.createElement("br", null), " Someone's taken your name already. Choose another one."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "gameUnavailable",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Game Unavailable"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Unfortunately for you, this probably means they've started without you. :("), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "joinRejected",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Join Rejected"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You have not been allowed to join that game (yet). Maybe they don't like your Pirate Name. Or, maybe they can't stand how you always beat them."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "tooSlow",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Too Slow"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Oh, No! You were too slow to respond and they've carried on without you."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: function onClick() {
    window.location = 'index.html';
  }
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "invalidSquare",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Invalid Square"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Squares must be a letter from [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\"] followed by a digit from [\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\"]."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "squareTaken",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Square Taken"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Oops! There's something in that square already, choose another."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "squaresMatch",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Squares Match"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Oops! You've chosen the same square multiple times! Choose again."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "waitingForOthers",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting for the Other Crew to Fill Their Boards"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"))), /*#__PURE__*/React.createElement("div", {
  id: "waitingForSquare",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting for the Current Square"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"))), /*#__PURE__*/React.createElement("div", {
  id: "waitingForChoice",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting for the Chosen Square"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"))), /*#__PURE__*/React.createElement("div", {
  id: "squareDone",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Square Done"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Oops! That square's been done already, choose another."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "noSuchPlayer",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "No Such Player"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Oops! That player doesn't exist, maybe check your spelling."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!")))));
ReactDOM.render(toRender, root);
