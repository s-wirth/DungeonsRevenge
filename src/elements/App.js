import React from "react";
import GameState from "GameState";
import Dungeon from "elements/Dungeon";
import IntroScreen from "elements/IntroScreen";
import DeathScreen from "elements/DeathScreen";

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
      map: GameState.map,
      creatures: GameState.map.creatures,
      sightMap: GameState.map.sightMap,
      memorisedSightMap: GameState.map.memorisedSightMap,
      introScreenShown: GameState.introScreenShown,
      playerDeath: GameState.playerDeath
    });
  },

  renderCreatures() {
    let creatures = this.state.creatures;

    if (!creatures) return null;

    return creatures.map((creature) => {
      if(this.state.sightMap.includes(creature.x, creature.y)) {
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
    let { player, map, sightMap, memorisedSightMap, introScreenShown, playerDeath } = this.state;
    let x = player.x;
    let y = player.y;

    if (!introScreenShown) {
      return (
        <IntroScreen switchFromIntroToDungeon={ GameState.switchFromIntroToDungeon }/>
      );
    } else if (playerDeath) {
      return (
        <DeathScreen />
      );
    }  else if (playerWon) {
      return (
        <WinningScreen />
      );
    } else {
      return (
        <div className="scene">
          <Dungeon map={ map } sightMap={ sightMap } memorisedSightMap={ memorisedSightMap }/>
          { this.renderCreatures() }
        </div>
      );
    }
  },
});

export default App;

