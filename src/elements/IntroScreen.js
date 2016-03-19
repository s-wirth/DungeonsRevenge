import ReactDOM from "react-dom";
import React from "react";

const IntroScreen = React.createClass({

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  onKeyUp() {
    let { switchFromIntroToDungeon } = this.props;
    switchFromIntroToDungeon();
  },

  render() {
    return (
      <div className="introScreen" tabIndex="99" onKeyUp={ this.onKeyUp }>
        <h1>Dungeon's Revenge</h1>
        <h3>
          This is a Rogue Like. To beat it, you have hack your way through the dungeon and defeat
          the boss.
        </h3>
        <b>If you die you're done for. No extra lives.</b>
        <br/>
        <b>Move with the arrow keys</b>
        <h2>Press any key to start</h2>
      </div>
    );
  },
});

export default IntroScreen;
