import React from "react";
import "css/ui/Screen";

export default function Screen({ children, onClick, onKeyPress, focusable = true }) {
  return (
    <div
      className="Screen flex-list flex-list--center-content"
      tabIndex={ focusable ? 0 : "" }
      onClick={ onClick }
      {...{ onKeyPress }}
    >
      <div className="Screen__content flex-list__item">
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
  onClick: React.PropTypes.func,
  onKeyPress: React.PropTypes.func,
};
