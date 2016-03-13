import React from "react";
import Dungeon from "elements/Dungeon";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const InGameScreen = React.createClass({

  renderCreatures() {
    let creatures = this.props.creatures;

    if (!creatures) return null;

    return creatures.map((creature) => {
      if (this.props.sightMap.includes(creature.x, creature.y)) {
        return (
          <div
            className={ `creature ${creature.type}-creature` }
            key={`creature-${creature.id}`}
            style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
          >
            <div className="health">
              <div className="health__remaining" style={{ width: `${creature.health*100/creature.maxHealth}%`}}></div>
            </div>
          </div>
        );
      }
    });
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
          <div className="stats"></div>
          <div className="eventLog"></div>
          <div className="items"></div>
        </div>
      </div>
    );
  },
});

export default InGameScreen;

