import React from "react";
import classnames from "classnames";
import "css/ui/Scroll";

class Scroll extends React.Component {
  render() {
    const { className, children, onClick, onMouseMove, onTouchStart } = this.props;
    return (
      <div
        className={ classnames("Scroll", className) }
        {...{ onClick, onMouseMove, onTouchStart }}
      >
        <div className="Scroll__content" ref="content">
          { children }
        </div>
      </div>
    );
  }
}
Scroll.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
  onClick: React.PropTypes.func,
  onMouseMove: React.PropTypes.func,
  onTouchStart: React.PropTypes.func,
  className: React.PropTypes.string,
};

export default Scroll;
