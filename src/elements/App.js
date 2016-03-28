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
      logMessages: GameState.log.getMessages(),
      visibleScreen: GameState.visibleScreen,
    });
  }

  render() {
    const {
      player, map, sightMap, memorisedSightMap, creatures, items, logMessages, visibleScreen,
    } = this.state;

    if (visibleScreen === "intro") {
      return (
        <IntroScreen switchFromIntroToDungeon={ GameState.switchFromIntroToDungeon } />
      );
    } else if (visibleScreen === "death") {
      return (
        <DeathScreen />
      );
    } else if (visibleScreen === "win") {
      return (
        <WinningScreen />
      );
    } else if (visibleScreen === "inventory") {
      return (
        <InventoryScreen
          hideInventoryScreen={ GameState.hideInventoryScreen }
          inventory={ player.inventory }
          inventorySize={ player.inventorySize }
          activateItem={ function activateItem(item) { GameState.activateItem(item, player); } }
          dropItem={ function dropItem(item) { GameState.dropItem(item, player); } }
        />
      );
    } else if (visibleScreen === "inGame") {
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
    throw new Error(`Unknown screen name ${visibleScreen}`);
  }
}

export default App;
