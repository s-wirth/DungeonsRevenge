import React from "react";
import ImmutableProptypes from "react-immutable-proptypes";
import classnames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "css/Log";
import "css/animations/fadeInDown";
import "css/animations/fadeOut";

function LogMessage(message) {
  return (
    <div
      key={ message.get("id") }
      className={ `Log__message Log__message--${message.get("type")}` }
    >
      { message.get("description") }
    </div>
  );
}

export default function Log({ className, messages }) {
  return (
    <div className={ classnames("Log", className) }>
      <ReactCSSTransitionGroup
        transitionAppear
        transitionName={{
          enter: "fadeInDown",
          appear: "fadeInDown",
          leave: "fadeOut",
        }}
        transitionEnterTimeout={300}
        transitionAppearTimeout={300}
        transitionLeaveTimeout={300}
      >
        { messages.map(LogMessage) }
      </ReactCSSTransitionGroup>
    </div>
  );
}
Log.propTypes = {
  className: React.PropTypes.string,
  messages: ImmutableProptypes.listOf(
    ImmutableProptypes.contains({
      description: React.PropTypes.string.isRequired,
      type: React.PropTypes.string,
    })
  ).isRequired,
};
