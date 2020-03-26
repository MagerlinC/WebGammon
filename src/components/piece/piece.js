import React from "react";
import "./piece.scss";

const Piece = ({ color }) => {
  return <div className={"board-piece " + color}></div>;
};

export default Piece;
