import React from "react";
import GameState from "GameState";
import Dungeon from "elements/Dungeon";

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
      player: GameState.player,
      creatures: GameState.creatures,
      map: GameState.map,
    });
  },

  renderCreatures() {
    let creatures = this.state.creatures;

    if (!creatures) return null;

    return creatures.map((creature) => {
      return (
        <div
          className={ `${creature.type}-creature` }
          key={`creature-${creature.id}`}
          style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
        >
          <div className="health">
            <div className="health__remaining" style={{ width: `${creature.health*100/creature.maxHealth}%`}}></div>
          </div>
        </div>
      );
    });
  },

  render() {
    let { player, map } = this.state;
    let x = player.x;
    let y = player.y;

    return (
      <div className="scene">
        <Dungeon map={ map }/>
        { this.renderCreatures() }
      </div>
    );
  },
});

export default App;
