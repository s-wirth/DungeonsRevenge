// import css from "main.css";
/* eslint no-console:0 */
import Mousetrap from "mousetrap";
import React from "react";
import ReactDom from "react-dom";
import EventEmitter from "eventemitter2";

const gameState = new EventEmitter();
gameState.playerPosition = {
  x: 0,
  y: 0,
};

const App = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    gameState.on("change", () => this.getState());
  },

  getState() {
    this.setState({
      playerPosition: gameState.playerPosition,
    });
  },

  render() {
    let playerPosition = this.state.playerPosition;
    return <p>{ JSON.stringify(playerPosition) }</p>;
  },
});

Mousetrap.bind("up", () => {
  gameState.playerPosition.y += 1;
  gameState.emit("change");
  console.log("gameState =", gameState);
});

Mousetrap.bind("right", () => {
  gameState.playerPosition.x += 1;
  gameState.emit("change");
  console.log("gameState =", gameState);
});

Mousetrap.bind("down", () => {
  gameState.playerPosition.y -= 1;
  gameState.emit("change");
  console.log("gameState =", gameState);
});

Mousetrap.bind("left", () => {
  gameState.playerPosition.x -= 1;
  gameState.emit("change");
  console.log("gameState =", gameState);
});

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
ReactDom.render(<App/>, rootElement);
