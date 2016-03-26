import React from "react";
import GameState from "GameState";
import IntroScreen from "elements/IntroScreen";
import DeathScreen from "elements/DeathScreen";
import WinningScreen from "elements/WinningScreen";
import InGameScreen from "elements/InGameScreen";
import InventoryScreen from "elements/InventoryScreen";

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
      items: GameState.map.items,
      sightMap: GameState.map.sightMap,
      memorisedSightMap: GameState.map.memorisedSightMap,
      introScreenShown: GameState.introScreenShown,
      playerDeath: GameState.playerDeath,
      playerWon: GameState.playerWon,
      inventoryScreenVisible: GameState.inventoryScreenVisible,
      logMessages: GameState.log.getMessages(),
    });
  }

  render() {
    const {
      player, map, sightMap, memorisedSightMap, introScreenShown, playerDeath, playerWon, creatures,
      items, inventoryScreenVisible, logMessages,
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
    } else if (inventoryScreenVisible) {
      return (
        <InventoryScreen
          hideInventoryScreen={ GameState.hideInventoryScreen }
          inventory={ player.inventory }
          inventorySize={ player.inventorySize }
          activateItem={ function activateItem(item) { GameState.activateItem(item, player); } }
          dropItem={ function dropItem(item) { GameState.dropItem(item, player); } }
        />
      );
    }
    return (
      <InGameScreen
        map={ map }
        sightMap={ sightMap }
        memorisedSightMap={ memorisedSightMap }
        player={ player }
        creatures={ creatures }
        items={ items }
        movePlayerTo={ GameState.movePlayerTo }
        skipPlayerTurn={ GameState.skipPlayerTurn }
        showInventoryScreen={ GameState.showInventoryScreen }
        updatePlayerPosition={ GameState.updatePlayerPosition }
        logMessages={ logMessages }
      />
    );
  }
}

export default App;
