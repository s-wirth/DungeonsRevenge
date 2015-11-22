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
      map: GameState.map,
    });
  },

  renderMapTiles() {
    let map = this.state.map;

    if (!map) return null;

    let width = map.shape[0];
    let height = map.shape[1];
    let result = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let mapTile = map.get(x, y);
        if (mapTile) {
          result.push(
            <div className="wall-tile" key={`${x}-${y}`} style={{ left: x * 36, top: y * 36 }} />
          );
        }
      }
    }

    return result;
  },

  render() {
    let playerPosition = this.state.playerPosition || {};
    let x = playerPosition.x || 0;
    let y = playerPosition.y || 0;

    return (
      <div className="scene">
        { this.renderMapTiles() }
        <div className="player" style={{ left: x * 36, top: y * 36 }}> :) </div>
      </div>
    );
  },
});

export default App;
