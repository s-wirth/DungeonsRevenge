import React from 'react';
import crown from 'assets/misc/crown.png';

const WinningScreen = React.createClass({

  render() {
    return (
      <div className="winningScreen">
        <img src={ crown } className="crownImg"/>
        <h1>You Won</h1>
        <b>Bla bla bla bla bla bla bla bla </b>
        <h2>Refresh the page to restart.</h2>
      </div>
    );
  },
});

export default WinningScreen;