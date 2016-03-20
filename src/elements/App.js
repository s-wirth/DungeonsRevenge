import React from "react";
import GameState from "GameState";
import IntroScreen from "elements/IntroScreen";
import DeathScreen from "elements/DeathScreen";
import WinningScreen from "elements/WinningScreen";
import InGameScreen from "elements/InGameScreen";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    GameState.on("change", () => this.getState());
    this.getState();
  }

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
  }

  render() {
    const {
      player, map, sightMap, memorisedSightMap, introScreenShown, playerDeath, playerWon, creatures,
      potions,
    } = this.state;

    if (!introScreenShown) {
      return (
        <IntroScreen switchFromIntroToDungeon={ GameState.switchFromIntroToDungeon } />
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
        potions={ potions }
        movePlayerTo={ GameState.movePlayerTo }
        skipTurn={ GameState.skipPlayerTurn }
      />
    );
  }
}

export default App;
