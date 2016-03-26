import ReactDOM from "react-dom";
import React from "react";
import "gsap";
import bindFunctions from "util/bindFunctions";
import Screen from "elements/ui/Screen";
import Scroll from "elements/ui/Scroll";

class IntroScreen extends React.Component {
  constructor(props) {
    super(props);
    bindFunctions(this, ["closeScreen", "stopAutoScrolling"]);
  }

  componentDidMount() {
    const container = this.refs.scroll.refs.content;
    ReactDOM.findDOMNode(this).focus();
    // For some reason the height of the element isn't correct yet, so we do this on the next tick
    setTimeout(() => {
      const timeline = new window.TimelineLite();
      timeline.add(new window.TweenLite(container, 10, {
        delay: 5,
        ease: "Linear",
        scrollTop: container.scrollHeight - container.clientHeight,
      }));
      timeline.add(this.closeScreen, "+=5");
      this.tween = timeline;
      timeline.play();
    }, 0);
  }

  closeScreen() {
    const { switchFromIntroToDungeon } = this.props;
    switchFromIntroToDungeon();
  }

  stopAutoScrolling() {
    if (this.tween) {
      this.tween.kill();
    }
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
            You awaken. The familiar stench of the dungeon surrounds you. Grime and detritus
            litter the floor and critters scamper in the shadows.
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
