import React from "react";
import classnames from "classnames";
import "css/UILink";

export default function UILink({ children, href, className, onClick }) {
  return (
    <a
      className={ classnames("ui-link", className) }
      {...{ onClick, href, children }}
    />
  );
}

UILink.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
  className: React.PropTypes.string,
  href: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired,
};
