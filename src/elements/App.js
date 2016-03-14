import React from "react";
import GameState from "GameState";
import Dungeon from "elements/Dungeon";
import InGameScreen from "elements/InGameScreen";
import IntroScreen from "elements/IntroScreen";
import DeathScreen from "elements/DeathScreen";
import WinningScreen from "elements/WinningScreen";

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
      potions: GameState.map.potions,
      sightMap: GameState.map.sightMap,
      memorisedSightMap: GameState.map.memorisedSightMap,
      introScreenShown: GameState.introScreenShown,
      playerDeath: GameState.playerDeath,
      playerWon: GameState.playerWon
    });
  },

  render() {
    let { player, map, sightMap, memorisedSightMap, introScreenShown, playerDeath, playerWon, creatures, potions } = this.state;
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
      <InGameScreen
        map={ map }
        sightMap={ sightMap }
        memorisedSightMap={ memorisedSightMap }
        player={ player }
        creatures={ creatures }
        potions={ potions } />
      );
    }
  },
});

export default App;

