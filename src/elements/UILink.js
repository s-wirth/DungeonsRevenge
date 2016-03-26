import React from "react";
import classnames from "classnames";
import "css/UILink";

export default function UILink({ children, href, className, onClick, button, flatButton }) {
  return (
    <a
      className={ classnames("UILink", className, {
        "UILink--button": button,
        "UILink--flatButton": flatButton,
      }) }
      {...{ onClick, href, children }}
    />
  );
}

UILink.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.array,
  ]),
  className: React.PropTypes.string,
  href: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired,
  button: React.PropTypes.bool,
  flatButton: React.PropTypes.bool,
};
