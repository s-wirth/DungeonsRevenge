import ReactDOM from "react-dom";
import React from "react";
import Tween from "gsap";
import bindFunctions from "util/bindFunctions";
import Screen from "elements/ui/Screen";
import Scroll from "elements/ui/Scroll";
import "css/ScrollScreen";

class IntroScreen extends React.Component {
  constructor(props) {
    super(props);
    bindFunctions(this, ["closeScreen", "stopAutoScrolling"]);
  }

  componentDidMount() {
    const container = this.refs.scroll.refs.content;
    ReactDOM.findDOMNode(this).focus();
    this.tween = Tween.to(container, 20, {
      delay: 5,
      ease: "Linear",
      scrollTop: container.scrollHeight - container.clientHeight,
    });
  }

  closeScreen() {
    const { switchFromIntroToDungeon } = this.props;
    switchFromIntroToDungeon();
  }

  stopAutoScrolling() {
    this.tween.kill();
  }

  render() {
    return (
      <Screen onKeyPress={ this.closeScreen } onClick={ this.closeScreen }>
        <Scroll
          ref="scroll"
          className="Scroll--introScroll"
          onMouseMove={ this.stopAutoScrolling }
          onTouchStart={ this.stopAutoScrolling }
        >
          <h1>Dungeon's Revenge</h1>
          <p>
            You awake. The familiar stench of the dungeon surrounds you. Grime and detritus
            litter the floor and you hear critters scampering in the shadows.
          </p>
          <p>
            You are a creature of the darkness. Your home has been invaded by
            fortune-seeking adventurers who slaughtered your kin and stole your treasures.
          </p>
          <p>
            Now it's time for revenge...
          </p>
        </Scroll>
      </Screen>
    );
  }
}

IntroScreen.propTypes = {
  switchFromIntroToDungeon: React.PropTypes.func.isRequired,
};

export default IntroScreen;
