import React, { useRef } from "react";
import "./App.scss";
import GravityScene from "./scene/gravityScene";
import Cursor from "./assets/Cursor";
import ImageScene from "./scene/imageScene";
import HorizontalScroller from "./scene/Horizontal/index";
import { Minimap } from "./scene/Horizontal/Minimap";
import HorizontalScrollerTwo from "./scene//HorizontalTwo/index";

function App() {
  return (
    <>
      {/* <GravityScene /> */}
      {/* <ImageScene /> */}
      <Cursor />
      {/* <HorizontalScroller /> */}
      <HorizontalScrollerTwo />
    </>
  );
}

export default App;
