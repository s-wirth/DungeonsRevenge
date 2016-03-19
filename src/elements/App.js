import React from "react";
import GameState from "GameState";

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
      playerWon: GameState.playerWon,
    });
  },

  render() {
    let {
      player, map, sightMap, memorisedSightMap, introScreenShown, playerDeath, playerWon, creatures,
      potions,
    } = this.state;

    if (!introScreenShown) {
      return (
        <IntroScreen switchFromIntroToDungeon={ GameState.switchFromIntroToDungeon }/>
      );
    } else if (playerDeath) {
      return (
        <DeathScreen />
      );
    } else if (playerWon) {
      return (
        <WinningScreen />
      );
    }
    return (
      <InGameScreen
        map={ map }
        sightMap={ sightMap }
        memorisedSightMap={ memorisedSightMap }
        player={ player }
        creatures={ creatures }
        potions={ potions } />
    );
  },
});

export default App;
