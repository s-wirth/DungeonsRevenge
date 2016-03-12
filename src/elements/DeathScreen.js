import React from 'react';
import skull from 'assets/skull.png';

const DeathScreen = React.createClass({

  render() {
    return (
      <div className="deathScreen">
        <img src={ skull } className="skullImg"/>
        <h1>Ya Deeeeead</h1>
        <b>Not quite as clever as you thought, eh?</b>
        <h2>Refresh the page to restart.</h2>
      </div>
    );
  },
});

export default DeathScreen;