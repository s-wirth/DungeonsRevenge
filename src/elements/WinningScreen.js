import React from "react";
import crown from "assets/misc/crown.png";
import Screen from "elements/ui/Screen";
import Scroll from "elements/ui/Scroll";

function WinningScreen() {
  return (
    <Screen>
      <Scroll className="Scroll--winningScreen">
        <img src={ crown } className="crownImg" />
        <h1>Victory!</h1>

        <p>
          You have slain your foe and brought glory to your kind. You are master of the dungeon and
          the land above.
        </p>
      </Scroll>
    </Screen>
  );
}

export default WinningScreen;
