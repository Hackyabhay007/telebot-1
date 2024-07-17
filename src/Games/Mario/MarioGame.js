import React from "react";
import ReactDOM from "react-dom/client";
import "./mario.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./config/redux/store";
import { Title } from "./components";
import Home from "./config/Routes/Routes";

function MarioGame() {
  return (
    <Provider store={store}>
      <div className=" "><Home /></div>
    </Provider>
  );
}

export default MarioGame;
