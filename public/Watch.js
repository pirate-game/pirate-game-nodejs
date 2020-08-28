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
var theCurrentSquare;
var theChooseNextSquare;
var theStage3;
var theEventReport;
var keyPattern = /^[0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef][0-9abcdef]$/;
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

var Board = /*#__PURE__*/function (_React$Component) {
  _inherits(Board, _React$Component);

  var _super = _createSuper(Board);

  function Board() {
    var _this;

    _classCallCheck(this, Board);

    _this = _super.call(this);
    _this.state = {
      done: []
    };
    theBoard = _assertThisInitialized(_this);
    return _this;
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
            style: {
              backgroundColor: _this2.state.done.includes(row + col) ? "#CC6600" : "white"
            }
          });
        }));
      }));
    }
  }]);

  return Board;
}(React.Component);

;

function attemptWatch() {
  var key = document.getElementById("gameKey").value;

  if (keyPattern.test(key)) {
    hidePopUps();
    document.getElementById("waiting").style.display = "block";
    socket.emit('attempt_watch', key);
  } else {
    hidePopUps();
    document.getElementById("invalidKey").style.display = "block";
  }

  ;
}

;
socket.on('no_such_game', function () {
  document.getElementById("gameKey").value = "";
  hidePopUps();
  document.getElementById("noSuchGame").style.display = "block";
});
socket.on('start_game', function () {
  hidePopUps();
  hideStage("stage0");
  showStage("stage2");
});

var CurrentSquare = /*#__PURE__*/function (_React$Component2) {
  _inherits(CurrentSquare, _React$Component2);

  var _super2 = _createSuper(CurrentSquare);

  function CurrentSquare() {
    var _this3;

    _classCallCheck(this, CurrentSquare);

    _this3 = _super2.call(this);
    _this3.state = {
      currentSquare: "??"
    };
    theCurrentSquare = _assertThisInitialized(_this3);
    return _this3;
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
socket.on('current_square', function (square) {
  theCurrentSquare.setState({
    currentSquare: square
  });
  theBoard.squareDone(square);
});

var ChooseNextSquare = /*#__PURE__*/function (_React$Component3) {
  _inherits(ChooseNextSquare, _React$Component3);

  var _super3 = _createSuper(ChooseNextSquare);

  function ChooseNextSquare() {
    var _this4;

    _classCallCheck(this, ChooseNextSquare);

    _this4 = _super3.call(this);
    _this4.state = {
      players: []
    };
    theChooseNextSquare = _assertThisInitialized(_this4);
    return _this4;
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
socket.on('choose_next_square', function (player) {
  theChooseNextSquare.addPlayer(player);
});
socket.on('too_slow', function (who) {
  theChooseNextSquare.removePlayers(who);
});
socket.on('choose', function (player) {
  theChooseNextSquare.removePlayers([player]);
});
socket.on('state', function (gameState) {
  theBoard.setState(gameState[0]);
  theCurrentSquare.setState(gameState[1]);
  theChooseNextSquare.setState(gameState[2]);
});

var Stage3 = /*#__PURE__*/function (_React$Component4) {
  _inherits(Stage3, _React$Component4);

  var _super4 = _createSuper(Stage3);

  function Stage3() {
    var _this5;

    _classCallCheck(this, Stage3);

    _this5 = _super4.call(this);
    theStage3 = _assertThisInitialized(_this5);
    return _this5;
  }

  _createClass(Stage3, [{
    key: "render",
    value: function render() {
      var _this6 = this;

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
        }, _this6.props.leaderboard[place].score), /*#__PURE__*/React.createElement("div", {
          className: "leaderboardLeft"
        }, place + 1, ". ", _this6.props.leaderboard[place].name));
      }))));
    }
  }]);

  return Stage3;
}(React.Component);

;
socket.on('game_over', function (results) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Stage3, {
    leaderboard: results
  }), document.getElementById("stage3"));
  hideStage("stage2");
  showStage("stage3");
});

var EventReport = /*#__PURE__*/function (_React$Component5) {
  _inherits(EventReport, _React$Component5);

  var _super5 = _createSuper(EventReport);

  function EventReport() {
    var _this7;

    _classCallCheck(this, EventReport);

    _this7 = _super5.call(this);
    _this7.state = {
      queue: []
    };
    _this7.pop = _this7.pop.bind(_assertThisInitialized(_this7));
    theEventReport = _assertThisInitialized(_this7);
    return _this7;
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
var toRender = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "stage0"
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    marginTop: 0
  }
}, "What game be ye watchin'?"), /*#__PURE__*/React.createElement("input", {
  type: "text",
  id: "gameKey",
  maxLength: "6"
}), /*#__PURE__*/React.createElement("button", {
  id: "watch",
  onClick: attemptWatch
}, "Watch")), /*#__PURE__*/React.createElement("div", {
  className: "stage2"
}, /*#__PURE__*/React.createElement(Board, null), /*#__PURE__*/React.createElement(CurrentSquare, null), /*#__PURE__*/React.createElement(ChooseNextSquare, null), /*#__PURE__*/React.createElement(EventReport, null)), /*#__PURE__*/React.createElement("div", {
  id: "stage3",
  className: "stage3"
}), /*#__PURE__*/React.createElement("div", {
  id: "popUps"
}, /*#__PURE__*/React.createElement("div", {
  id: "waiting",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Waiting"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "This won't take too long, I hope!"))), /*#__PURE__*/React.createElement("div", {
  id: "invalidKey",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Invalid Key"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. \"beef54\".", /*#__PURE__*/React.createElement("br", null), "Please use all lower-case letters."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!"))), /*#__PURE__*/React.createElement("div", {
  id: "noSuchGame",
  className: "popUp"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "No Such Game"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, "You've probably mistyped your key. Try again."), /*#__PURE__*/React.createElement("button", {
  className: "close",
  onClick: hidePopUps
}, "Okay!")))));
ReactDOM.render(toRender, root);
