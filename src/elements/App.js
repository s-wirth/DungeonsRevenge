import React from "react";
import GameState from "GameState";

const App = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    GameState.on("change", () => this.getState());
    this.getState();
  },

  getState() {
    this.setState({
      playerPosition: GameState.playerPosition,
    });
  },

  render() {
    let playerPosition = this.state.playerPosition || {};
    let x = playerPosition.x;
    let y = playerPosition.y;

    return (
      <div className="scene">
        <div className="player" style={{ left: x, top: -y }}> :) </div>
      </div>
    );
  },
});

export default App;
