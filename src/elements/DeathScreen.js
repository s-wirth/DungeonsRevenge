import React from "react";
import skull from "assets/misc/skull.png";
import Screen from "elements/ui/Screen";
import Scroll from "elements/ui/Scroll";

function DeathScreen() {
  return (
    <Screen>
      <Scroll className="Scroll--deathScreen">
        <img src={ skull } className="skullImg" />
        <h1>You have died</h1>

        <p>
          Your body crumbles to dust and your spirit returns to the darkness whence it came.
        </p>

        <a href="#" onClick={ function reload() { window.location.reload(); } }>
          Reincarnate
        </a>
      </Scroll>
    </Screen>
  );
}

export default DeathScreen;
