import React, { useRef } from "react";
import "./App.scss";
import GravityScene from "./scene/gravityScene";
import Cursor from "./Cursor";

function App() {
  return (
    <>
      <Cursor />
      <GravityScene />
    </>
  );
}

export default App;
