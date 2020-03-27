import React from "react";
import "./game-tile.scss";
import { formatDate } from "../../Util";

const GameTile = ({ game, onClick }) => {
  return (
    <div
      tabIndex="0"
      onClick={() => onClick(game)}
      className={"game-tile-wrapper"}
    >
      <div className={"game-title"}>
        {game.player1} vs {game.player2} ({formatDate(game.timestamp, true)})
        <div className={"game-winner"}>
          {game.winner ? "Winner: " + game.winner : ""}
        </div>
      </div>
    </div>
  );
};

export default GameTile;
