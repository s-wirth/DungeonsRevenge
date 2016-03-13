import React from 'react';
import crown from 'assets/misc/crown.png';

const WinningScreen = React.createClass({

  render() {
    return (
      <div className="winningScreen">
        <img src={ crown } className="crownImg"/>
        <h1>You Won</h1>
        <h3>This is where it ends. You brought glory to your "people".<br/>
          Come back when there is more to this game than five levels...</h3>
        <b>Refresh the page to restart.</b>
      </div>
    );
  },
});

export default WinningScreen;