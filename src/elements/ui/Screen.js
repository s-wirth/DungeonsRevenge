import React from "react";
import "css/ui/Screen";

export default function Screen({ children, onBackdropClick, focusable = true }) {
  return (
    <div
      className="Screen"
      tabIndex={ focusable ? 0 : "" }
      onClick={ onBackdropClick }
    >
      <div className="Screen__content">
        { children }
      </div>
    </div>
  );
}
Screen.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
  focusable: React.PropTypes.bool,
  onBackdropClick: React.PropTypes.func,
};
