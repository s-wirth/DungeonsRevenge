import ReactDOM from 'react-dom';
import React from 'react';

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
        <p>This is a Rogue Like, Bla bla bla bla bla.</p>
        <ul>
          <li>Commands:</li>
        </ul>
        <h2>Press any key to start</h2>
      </div>
    );
  },
});

export default IntroScreen;