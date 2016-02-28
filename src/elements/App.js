import React from "react";
import GameState from "GameState";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const App = React.createClass({
  getInitialState() {
    return {};
  },

  componentWillMount() {
    GameState.on("change", () => this.getState());
    this.getState();
  },

  getState() {
    this.setState({
      playerPosition: GameState.playerPosition,
      creatures: GameState.creatures,
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
            <div className={ `${mapTile.type}-tile` } key={`${x}-${y}`} style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }} />
          );
        }
      }
    }

    return result;
  },

  renderCreatures() {
    let creatures = this.state.creatures;

    if (!creatures) return null;

    return creatures.map( (creature) => {
      return (
        <div
          className={ `${creature.type}-creature` }
          key={`creature-${creature.x}-${creature.y}`}
          style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
        >
          8(
        </div>
      );
    });
  },

  render() {
    let playerPosition = this.state.playerPosition;
    let x = playerPosition.x;
    let y = playerPosition.y;

    return (
      <div className="scene">
        { this.renderMapTiles() }
        <div className="player" style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }} key="player"> :) </div>
        { this.renderCreatures() }
      </div>
    );
  },
});

export default App;
