import React from "react";
import skull from "assets/misc/skull.png";
import "css/ScrollScreen";

function DeathScreen() {
  return (
    <div className="ScrollScreen ScrollScreen--deathScreen">
      <img src={ skull } className="skullImg" />
      <h1>You're Dead.</h1>
      <h3>Not quite as clever as you thought, eh?</h3>
      <h2>Refresh the page to restart.</h2>
    </div>
  );
}

export default DeathScreen;
