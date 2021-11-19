import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import { Provider } from "react-redux";
import ReduxStore from "./store";

ReactDOM.render(
  <>
    <Provider store={ReduxStore()}>
      <Routes />
    </Provider>
  </>,
  document.getElementById("root")
);
