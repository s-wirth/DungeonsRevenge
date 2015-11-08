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
    let playerPosition = this.state.playerPosition;
    return <p>GameState = { JSON.stringify(playerPosition) }</p>;
  },
});

export default App;
