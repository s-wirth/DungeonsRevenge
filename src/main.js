/* eslint-disable */
import "css/main";
import React from "react";
import ReactDom from "react-dom";
import App from "elements/App";
import controls from "controls";
/* eslint-enable */

const rootElement = document.createElement("div");
rootElement.className = "root";
document.body.appendChild(rootElement);

ReactDom.render(<App />, rootElement);
