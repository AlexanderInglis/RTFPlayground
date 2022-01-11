import React, { useRef } from "react";
import "./App.scss";
import GravityScene from "./scene/gravityScene";
import Cursor from "./assets/Cursor";
import ImageScene from "./scene/imageScene";

function App() {
  return (
    <>
      <GravityScene />
      {/* <ImageScene /> */}
      <Cursor />
    </>
  );
}

export default App;
