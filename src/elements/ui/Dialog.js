import React from "react";
import UILink from "elements/UILink";
import "css/ui/Dialog";

export default function Dialog({ children, title, onClose }) {
  return (
    <div className="Dialog flex-list flex-list--vertical">
      <div
        className="flex-list__item flex-list__item--expand-cross flex-list flex-list--horizontal
          Dialog__header"
      >
        <h2 className="flex-list__item flex-list__item--expand Dialog__title">
          { title }
        </h2>
        <UILink
          flatButton
          className="flex-list__item"
          onClick={ onClose }
        >
          ☓
        </UILink>
      </div>

      <div className="flex-list__item">
        { children }
      </div>
    </div>
  );
}
Dialog.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]).isRequired,
  title: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
};
