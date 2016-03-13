import React from "react";
import Dungeon from "elements/Dungeon";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const InGameScreen = React.createClass({

  renderCreatures() {
    let creatures = this.props.creatures;

    if (!creatures) return null;

    function renderHealthBar(creature) {
      if (creature.type != "player") {
        return (
          <div className="health">
            <div className="health__remaining" style={{ width: `${creature.health*100/creature.maxHealth}%`}}></div>
          </div>
        );
      } return null;
    }

    return creatures.map((creature) => {
      if (this.props.sightMap.includes(creature.x, creature.y)) {
        return (
          <div
            className={ `creature ${creature.type}-creature` }
            key={`creature-${creature.id}`}
            style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
          >
            { renderHealthBar(creature) }
          </div>
        );
      }
    });
  },

  renderPlayerStats() {
    let player = this.props.player;
    return (
      <div>Health: { player.health }
        <div className="playerHealth">
          <div className="playerHealth__remaining" style={{ width: `${player.health*100/player.maxHealth}%`}}></div>
        </div>
      </div>
    );
  },

  render() {
    let { map, sightMap, memorisedSightMap } = this.props;
    return (
      <div className="gameContainer">
        <div className="scene">
          <Dungeon map={ map } sightMap={ sightMap } memorisedSightMap={ memorisedSightMap }/>
          { this.renderCreatures() }
        </div>
        <div className="infoBar">
          <div className="stats">
            { this.renderPlayerStats() }
          </div>
          <div className="eventLog"></div>
          <div className="items"></div>
        </div>
      </div>
    );
  },
});

export default InGameScreen;

