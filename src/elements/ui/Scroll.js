import React from "react";
import classnames from "classnames";
import "css/ui/Scroll";

export default function Scroll({ className, children, onClick }) {
  return (
    <div
      className={ classnames("Scroll", className) }
      onClick={ onClick }
    >
      <div className="Scroll__content">
        { children }
      </div>
    </div>
  );
}
Scroll.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
};
