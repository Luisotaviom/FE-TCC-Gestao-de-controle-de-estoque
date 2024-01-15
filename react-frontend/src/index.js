// declaração das funcionalidades utilizadas nesse arquivo
import React from "react"; // biblioteca principal
import ReactDOM from "react-dom";  // biblioteca para lidar com o DOM
import { BrowserRouter } from "react-router-dom"; // biblioteca para roteamento
import App from "./App"; // componente principal

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
