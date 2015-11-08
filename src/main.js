// import css from "main.css";
/* eslint no-console:0 */
import React from "react";
import ReactDom from "react-dom";
import App from "elements/App";
import controls from "controls";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
ReactDom.render(<App/>, rootElement);
