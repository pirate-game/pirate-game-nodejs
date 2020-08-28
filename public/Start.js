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
var key = '';
var globalCrew = [];
var unreadyCrew = [];
var toChoose;
var round = 0;
var x; //////////////

var theBoard;
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;
var theEventReport;
var theNextSquare;
var theShowScores;
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

function range(someInt) {
  var out = [];

  for (var i = 0; i < someInt; i++) {
    out.push(i);
  }

  ;
  return out;
}

;
/*function sortByScore(results){
  var out = [];
  var toTest = 0;
  while (out.length != results.length){
    for (var i = 0; i < results.length; i++){
      if (results[i].score == toTest){
        out.push(results[i]);
      };
    };
    toTest += 100;
  };
  return out.reverse();
};*/

function sortByScore(results) {
  var out = results.slice();
  out.sort(function (a, b) {
    return a.score < b.score ? 1 : -1;
  });
  return out;
}

;

var KeyBox = /*#__PURE__*/function (_React$Component) {
  _inherits(KeyBox, _React$Component);

  var _super = _createSuper(KeyBox);

  function KeyBox() {
    var _this;

    _classCallCheck(this, KeyBox);

    _this = _super.call(this);
    _this.state = {
      key: ''
    };
    socket.on('key', function (msg) {
      key = msg;

      _this.setState({
        key: key
      });
    });
    return _this;
  }

  _createClass(KeyBox, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "keyBox",
        style: {
          backgroundColor: 'lightblue'
        }
      }, /*#__PURE__*/React.createElement("h2", null, " Key: ", this.state.key, " "));
    }
  }]);

  return KeyBox;
}(React.Component);

;

var CrewUl = /*#__PURE__*/function (_React$Component2) {
  _inherits(CrewUl, _React$Component2);

  var _super2 = _createSuper(CrewUl);

  function CrewUl() {
    var _this2;

    _classCallCheck(this, CrewUl);

    _this2 = _super2.call(this);
    _this2.state = {
      crew: []
    };
    socket.on('request_join', function (name) {
      _this2.setState({
        crew: _this2.state.crew.concat([name])
      });

      globalCrew.push(name);
    });
    socket.on('show_provisional_crew', function () {
      hidePopUps();
      document.getElementById("crewAssembledPopUp").style.display = "block";
    });
    _this2.changeCrew = _this2.changeCrew.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(CrewUl, [{
    key: "removePlayer",
    value: function removePlayer(somePlayer) {
      this.setState({
        crew: this.state.crew.filter(function (x) {
          return x != somePlayer;
        })
      });
      globalCrew = globalCrew.filter(function (x) {
        return x != somePlayer;
      });
      socket.emit('remove_player', somePlayer);
    }
  }, {
    key: "changeCrew",
    value: function changeCrew() {
      socket.emit('change_crew');
      hidePopUps();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        id: "firstCrewDiv",
        className: "crewDiv"
      }, /*#__PURE__*/React.createElement("ul", null, this.state.crew.slice().reverse().map(function (crewMember) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "cross",
          onClick: function onClick() {
            return _this3.removePlayer(crewMember);
          }
        }, "\xD7"), /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      }))), /*#__PURE__*/React.createElement("div", {
        id: "crewAssembledPopUp",
        className: "popUp"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Crew Assembled"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          display: 'inline-block',
          width: 'calc(100% - 190px)'
        }
      }, "Those currently in your crew are below. You can remove them with the crosses."), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-block'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: startGame
      }, "Start", /*#__PURE__*/React.createElement("br", null), "Game"), /*#__PURE__*/React.createElement("button", {
        onClick: this.changeCrew
      }, "Change", /*#__PURE__*/React.createElement("br", null), "Crew"))), /*#__PURE__*/React.createElement("div", {
        id: "popUpCrewDiv",
        className: "crewDiv",
        style: {
          maxHeight: 'calc(100vh - 400px)'
        }
      }, /*#__PURE__*/React.createElement("ul", null, this.state.crew.slice().reverse().map(function (crewMember) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "cross",
          onClick: function onClick() {
            return _this3.removePlayer(crewMember);
          }
        }, "\xD7"), /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      }))))));
    }
  }]);

  return CrewUl;
}(React.Component);

;

function assembleCrew() {
  hidePopUps();

  if (globalCrew.length >= 2) {
    document.getElementById("waiting").style.display = "block";
    socket.emit('crew_assembled');
  } else {
    document.getElementById("tooFew").style.display = "block";
  }

  ;
}

;

function startGame() {
  hidePopUps();

  if (globalCrew.length >= 2) {
    socket.emit('start_game');
    hideStage("stage0");
    showStage("stage1");
    ReactDOM.render( /*#__PURE__*/React.createElement(Stage1, null), document.getElementById("stage1"));
  } else {
    document.getElementById("tooFew").style.display = "block";
  }

  ;
}

;

var Stage1 = /*#__PURE__*/function (_React$Component3) {
  _inherits(Stage1, _React$Component3);

  var _super3 = _createSuper(Stage1);

  function Stage1() {
    var _this4;

    _classCallCheck(this, Stage1);

    _this4 = _super3.call(this);
    _this4.state = {
      waitingFor: globalCrew,
      ready: []
    };
    _this4.stage1Done = _this4.stage1Done.bind(_assertThisInitialized(_this4));
    socket.on('board_ready', function (player) {
      _this4.setState({
        waitingFor: _this4.state.waitingFor.filter(function (x) {
          return x != player;
        }),
        ready: _this4.state.ready.concat(player)
      });
    });
    x = _assertThisInitialized(_this4); //////////////////

    return _this4;
  }

  _createClass(Stage1, [{
    key: "stage1Done",
    value: function stage1Done() {
      hidePopUps();

      if (this.state.ready.length >= 2) {
        globalCrew = this.state.ready;
        socket.emit('too_slow', this.state.waitingFor);
        hideStage("stage1");
        showStage("stage2");
        nextSquare();
      } else {
        document.getElementById("tooFewReady").style.display = "block";
      }

      ;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        id: "fillBoards",
        style: {
          backgroundColor: 'lightblue'
        }
      }, /*#__PURE__*/React.createElement("h2", {
        style: {
          fontSize: '30px',
          padding: '10px'
        }
      }, "Fill in your boards")), /*#__PURE__*/React.createElement("button", {
        id: "doneBtn",
        onClick: this.stage1Done
      }, "Done"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "stage1col",
        style: {
          left: '10px'
        }
      }, /*#__PURE__*/React.createElement("h2", null, "Waiting for:"), /*#__PURE__*/React.createElement("div", {
        className: "crewDiv"
      }, /*#__PURE__*/React.createElement("ul", null, this.state.waitingFor.slice().reverse().map(function (crewMember) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      })))), /*#__PURE__*/React.createElement("div", {
        className: "stage1col",
        style: {
          right: '10px'
        }
      }, /*#__PURE__*/React.createElement("h2", null, "Ready:"), /*#__PURE__*/React.createElement("div", {
        className: "crewDiv"
      }, /*#__PURE__*/React.createElement("ul", null, this.state.ready.slice().reverse().map(function (crewMember) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      }))))));
    }
  }]);

  return Stage1;
}(React.Component);

;

var Board = /*#__PURE__*/function (_React$Component4) {
  _inherits(Board, _React$Component4);

  var _super4 = _createSuper(Board);

  function Board() {
    var _this5;

    _classCallCheck(this, Board);

    _this5 = _super4.call(this);
    _this5.state = {
      done: []
    };
    theBoard = _assertThisInitialized(_this5);
    return _this5;
  }

  _createClass(Board, [{
    key: "squareDone",
    value: function squareDone(square) {
      this.setState({
        done: this.state.done.concat([square])
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

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
            style: {
              backgroundColor: _this6.state.done.includes(row + col) ? "#CC6600" : "white"
            }
          });
        }));
      }));
    }
  }]);

  return Board;
}(React.Component);

;

var CurrentSquare = /*#__PURE__*/function (_React$Component5) {
  _inherits(CurrentSquare, _React$Component5);

  var _super5 = _createSuper(CurrentSquare);

  function CurrentSquare() {
    var _this7;

    _classCallCheck(this, CurrentSquare);

    _this7 = _super5.call(this);
    _this7.state = {
      currentSquare: "??"
    };
    theCurrentSquare = _assertThisInitialized(_this7);
    return _this7;
  }

  _createClass(CurrentSquare, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "currentSquare"
      }, /*#__PURE__*/React.createElement("h2", null, "Current Square: ", this.state.currentSquare));
    }
  }]);

  return CurrentSquare;
}(React.Component);

;

var ChooseNextSquare = /*#__PURE__*/function (_React$Component6) {
  _inherits(ChooseNextSquare, _React$Component6);

  var _super6 = _createSuper(ChooseNextSquare);

  function ChooseNextSquare() {
    var _this8;

    _classCallCheck(this, ChooseNextSquare);

    _this8 = _super6.call(this);
    _this8.state = {
      players: []
    };
    theChooseNextSquare = _assertThisInitialized(_this8);
    return _this8;
  }

  _createClass(ChooseNextSquare, [{
    key: "addPlayer",
    value: function addPlayer(player) {
      this.setState({
        players: this.state.players.concat([player])
      });
    }
  }, {
    key: "removePlayers",
    value: function removePlayers(players) {
      this.setState({
        players: this.state.players.filter(function (player) {
          return !players.includes(player);
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "chooseNextSquare"
      }, /*#__PURE__*/React.createElement("h2", null, "Choose\xA0Next\xA0Square:"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, this.state.players.map(function (player) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", null, player));
      }))));
    }
  }]);

  return ChooseNextSquare;
}(React.Component);

;
var remainingSquares = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "G1", "G2", "G3", "G4", "G5", "G6", "G7"];

function NextSquareConfirm() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "popUp"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Confirm Next Square"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      display: 'inline-block',
      width: 'calc(100% - 190px)'
    }
  }, "The crewmembers below are not ready and will be dropped from the game."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: nextSquareMid
  }, "Okay!"), /*#__PURE__*/React.createElement("button", {
    onClick: hidePopUps
  }, "Wait!"))), /*#__PURE__*/React.createElement("div", {
    className: "crewDiv",
    style: {
      maxHeight: 'calc(100vh - 400px)'
    }
  }, /*#__PURE__*/React.createElement("ul", null, unreadyCrew.map(function (crewMember) {
    return /*#__PURE__*/React.createElement("li", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nameLiDiv"
    }, crewMember));
  }))))));
}

;

function nextSquare() {
  hidePopUps();

  if (globalCrew.length - unreadyCrew.length >= 2) {
    if (unreadyCrew.length == 0) {
      nextSquareMid();
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement(NextSquareConfirm, null), document.getElementById("nextSquareConfirm"));
      document.getElementById("nextSquareConfirm").childNodes[0].style.display = "block";
    }

    ;
  } else {
    document.getElementById("tooFewReady").style.display = "block";
  }

  ;
}

;

function nextSquareMid() {
  theNextSquare.setState({
    allReady: false
  });
  theShowScores.setState({
    allReady: false
  });
  socket.emit('too_slow', unreadyCrew);

  if (document.getElementById("nextSquareConfirm").childNodes.length != 0) {
    document.getElementById("nextSquareConfirm").childNodes[0].style.display = "none";
  }

  ;

  if (theChooseNextSquare.state.players.length === 0) {
    var current = remainingSquares[Math.floor(Math.random() * remainingSquares.length)];
    remainingSquares = remainingSquares.filter(function (e) {
      return e != current;
    });
    theCurrentSquare.setState({
      currentSquare: current
    });
    theBoard.squareDone(current);
    socket.emit('current_square', current);
  } else {
    toChoose = theChooseNextSquare.state.players[0];
    theChooseNextSquare.removePlayers([toChoose]);
    socket.emit('choose', toChoose);
    hidePopUps();
    document.getElementById("waitForChoose").style.display = "block";
  }

  ;
  globalCrew = globalCrew.filter(function (e) {
    return !unreadyCrew.includes(e);
  });
  unreadyCrew = globalCrew;
  round += 1;

  if (round == 49) {
    document.getElementById("nextSquare").style.display = "none";
    document.getElementById("showScores").style.display = "block";
  }

  ;
}

;

function tooSlowToChoose() {
  if (globalCrew.length > 2) {
    globalCrew = globalCrew.filter(function (e) {
      return e != toChoose;
    });
    socket.emit('too_slow', [toChoose]);
    unreadyCrew = [];
    nextSquare();
  } else {
    document.getElementById("tooFewReady").style.display = "block";
  }

  ;
}

;
socket.on('player_gone', function (player) {
  hidePopUps();
  document.getElementById("playerGone").style.display = "block";
});
socket.on('chose', function (square) {
  hidePopUps();
  remainingSquares = remainingSquares.filter(function (e) {
    return e != square;
  });
  theCurrentSquare.setState({
    currentSquare: square
  });
  theBoard.squareDone(square);
  socket.emit('current_square', square);
});
socket.on('got_choose', function (player) {
  theChooseNextSquare.addPlayer(player);
  socket.emit('choose_next_square', player);
});
socket.on('request_state', function () {
  socket.emit('state', [theBoard.state, theCurrentSquare.state, theChooseNextSquare.state]);
});

var Stage3 = /*#__PURE__*/function (_React$Component7) {
  _inherits(Stage3, _React$Component7);

  var _super7 = _createSuper(Stage3);

  function Stage3(props) {
    var _this9;

    _classCallCheck(this, Stage3);

    _this9 = _super7.call(this, props);
    theStage3 = _assertThisInitialized(_this9);
    return _this9;
  }

  _createClass(Stage3, [{
    key: "render",
    value: function render() {
      var _this10 = this;

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
          top: "170px"
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
        }, _this10.props.leaderboard[place].score), /*#__PURE__*/React.createElement("div", {
          className: "leaderboardLeft"
        }, place + 1, ". ", _this10.props.leaderboard[place].name));
      }))));
    }
  }]);

  return Stage3;
}(React.Component);

;
socket.on('ready', function (name) {
  unreadyCrew = unreadyCrew.filter(function (e) {
    return e != name;
  });

  if (unreadyCrew.length == 0) {
    theNextSquare.setState({
      allReady: true
    });
    theShowScores.setState({
      allReady: true
    });
  }

  ;
});

var EventReport = /*#__PURE__*/function (_React$Component8) {
  _inherits(EventReport, _React$Component8);

  var _super8 = _createSuper(EventReport);

  function EventReport() {
    var _this11;

    _classCallCheck(this, EventReport);

    _this11 = _super8.call(this);
    _this11.state = {
      queue: []
    };
    _this11.pop = _this11.pop.bind(_assertThisInitialized(_this11));
    theEventReport = _assertThisInitialized(_this11);
    return _this11;
  }

  _createClass(EventReport, [{
    key: "addEvent",
    value: function addEvent(someEvent) {
      this.setState({
        queue: [someEvent].concat(this.state.queue)
      });
    }
  }, {
    key: "pop",
    value: function pop() {
      this.setState({
        queue: this.state.queue.slice(0, -1)
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "eventReport"
      }, this.state.queue.map(function (e) {
        return /*#__PURE__*/React.createElement("div", null, eventReportThing(e));
      }));
    }
  }]);

  return EventReport;
}(React.Component);

;
socket.on('some_event', function (someEvent) {
  theEventReport.addEvent(someEvent);
});

function eventReportThing(someEvent) {
  switch (someEvent[0]) {
    case "rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " has robbed ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " has killed ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "present":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Present!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["present"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " has given ", someEvent[2], " a present!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "parrot":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
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
      }, things["parrot"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " has got ", someEvent[2] || 0, "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "swap":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Swap!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["swap"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " has swapped score with ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being robbed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being killed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_swap":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["swap"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being swapped with by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "mirror_rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Mirrored Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " mirrored being robbed by ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "mirror_kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Mirrored Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " mirrored being killed by ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_mirror_rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Mirrored Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being mirror robbed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_mirror_kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Mirrored Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being mirror killed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "mirror_mirror_rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Mirrored Mirrored Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " mirrored being mirror robbed by ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "mirror_mirror_kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Mirrored Mirrored Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[1], " mirrored being mirror killed by ", someEvent[2], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_mirror_mirror_rob":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Mirrored Mirrored Rob!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["rob"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being mirror mirror robbed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;

    case "shielded_mirror_mirror_kill":
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          display: "inline-block",
          verticalAlign: "top"
        }
      }, "Shielded Mirrored Mirrored Kill!"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "7px"
        },
        className: "square"
      }, things["kill"]), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, someEvent[2], " shielded being mirror mirror killed by ", someEvent[1], "!"), /*#__PURE__*/React.createElement("button", {
        onClick: theEventReport.pop,
        style: {
          height: "unset",
          display: "block",
          marginTop: "10px"
        }
      }, "Okay!"));
      break;
  }

  ;
}

;

function showScores() {
  hidePopUps();

  if (globalCrew.length - unreadyCrew.length >= 2) {
    if (unreadyCrew.length == 0) {
      socket.emit('get_scores');
      hideStage("stage2");
      document.getElementById("waiting").style.display = "block";
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "popUp"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Confirm Show Scores"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          display: 'inline-block',
          width: 'calc(100% - 190px)'
        }
      }, "The crewmembers below are not ready and their scores may not be shown."), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-block'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          socket.emit('too_slow', unreadyCrew);
          unreadyCrew = [];
          showScores();
        }
      }, "Okay!"), /*#__PURE__*/React.createElement("button", {
        onClick: hidePopUps
      }, "Wait!"))), /*#__PURE__*/React.createElement("div", {
        className: "crewDiv",
        style: {
          maxHeight: 'calc(100vh - 400px)'
        }
      }, /*#__PURE__*/React.createElement("ul", null, unreadyCrew.map(function (crewMember) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            position: 'relative'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "nameLiDiv"
        }, crewMember));
      })))))), document.getElementById("nextSquareConfirm"));
      document.getElementById("nextSquareConfirm").childNodes[0].style.display = "block";
    }

    ;
  } else {
    document.getElementById("tooFewReady").style.display = "block";
  }

  ;
}

;
socket.on('got_scores', function (results) {
  var leaderboard = sortByScore(results);
  ReactDOM.render( /*#__PURE__*/React.createElement(Stage3, {
    leaderboard: leaderboard
  }), document.getElementById("stage3"));
  hideStage("stage2");
  showStage("stage3");
  hidePopUps();
  socket.emit('game_over', leaderboard);
});

var NextSquare = /*#__PURE__*/function (_React$Component9) {
  _inherits(NextSquare, _React$Component9);

  var _super9 = _createSuper(NextSquare);

  function NextSquare() {
    var _this12;

    _classCallCheck(this, NextSquare);

    _this12 = _super9.call(this);
    _this12.state = {
      allReady: false
    };
    theNextSquare = _assertThisInitialized(_this12);
    return _this12;
  }

  _createClass(NextSquare, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("button", {
        id: "nextSquare",
        onClick: nextSquare,
        style: this.state.allReady ? {
          border: '2px solid magenta'
        } : {}
      }, /*#__PURE__*/React.createElement("h2", null, "Next\xA0Square"));
    }
  }]);

  return NextSquare;
}(React.Component);

;

var ShowScores = /*#__PURE__*/function (_React$Component10) {
  _inherits(ShowScores, _React$Component10);

  var _super10 = _createSuper(ShowScores);

  function ShowScores() {
    var _this13;

    _classCallCheck(this, ShowScores);

    _this13 = _super10.call(this);
    _this13.state = {
      allReady: false
    };
    theShowScores = _assertThisInitialized(_this13);
    return _this13;
  }

  _createClass(ShowScores, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("button", {
        id: "showScores",
        onClick: showScores,
        style: this.state.allReady ? {
          display: "none",
          border: '2px solid magenta'
        } : {
          display: "none"
        }
      }, /*#__PURE__*/React.createElement("h2", null, "Show\xA0Scores"));
    }
  }]);

  return ShowScores;
}(React.Component);

;
var toRender = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "stage0"
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'relative',
    minHeight: 'calc(100vh - 230px)'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'relative',
    top: '-10%'
  }
}, /*#__PURE__*/React.createElement("button", {
  id: "crewAssembled",
  onClick: assembleCrew
}, "Crew Assembled!"), /*#__PURE__*/React.createElement(KeyBox, null)), /*#__PURE__*/React.createElement("h2", {
  style: {
    fontSize: '50px',
    margin: '0px',
    marginLeft: '10px'
  }
}, "Crew:"), /*#__PURE__*/React.createElement(CrewUl, null))), /*#__PURE__*/React.createElement("div", {
  id: "stage1",
  className: "stage1"
}), /*#__PURE__*/React.createElement("div", {
  id: "stage2",
  className: "stage2"
}, /*#__PURE__*/React.createElement(Board, null), /*#__PURE__*/React.createElement(CurrentSquare, null), /*#__PURE__*/React.createElement(ChooseNextSquare, null), /*#__PURE__*/React.createElement(NextSquare, null), /*#__PURE__*/React.createElement(ShowScores, null), /*#__PURE__*/React.createElement("div", {
  id: "nextSquareConfirm"
}), /*#__PURE__*/React.createElement(EventReport, null)), /*#__PURE__*/React.createElement("div", {
  id: "stage3",
  className: "stage3"
}), /*#__PURE__*/React.createElement("div", {
  id: "popUps"
}, /*#__PURE__*/React.createElement("div", {
  id: "waiting",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"))), /*#__PURE__*/React.createElement("div", {
  id: "tooFew",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Too Few Crewmembers"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Yarr, ye be needin' at least 2 players."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "tooFewReady",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Too Few Crewmembers Ready"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Yarr, ye be needin' at least 2 ready players before ye can drop people for bein' slow."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "waitForChoose",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting For Next Square to be Chosen"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: tooSlowToChoose
}, "Too Slow"))), /*#__PURE__*/React.createElement("div", {
  id: "playerGone",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Player Gone"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "They not be 'ere any more. :("), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: nextSquare
}, "Next\xA0Square")))));
ReactDOM.render(toRender, root);
socket.emit('request_key');
