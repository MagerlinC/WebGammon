import React, { useState, useEffect } from "react";
import {
  GetGameState,
  StartNewGame,
  MakeMove,
  GetAvailableGames
} from "./GameService";
import "./App.scss";
import Player from "./dataobjects/Player";
import BoardHalf from "./components/board-position-line/board-half";
import { DragDropContext } from "react-virtualized-dnd";
import GameTile from "./components/game-tile/game-tile";
import EndZone from "./components/end-zone/end-zone";

function App() {
  document.title = "WebGammon";

  // Hardcoded Player setup
  const player1 = new Player("Xia", "black");
  const player2 = new Player("Mikkel", "white");

  const [curPlayer, setCurPlayer] = useState("black");
  const [curPlayerMoveCount, setCurPlayerMoveCount] = useState(0);
  const [availableGames, setAvailableGames] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);
  const [dieRoll, setDieRoll] = useState([]);

  // Load available games on mount
  useEffect(() => {
    GetAvailableGames(doc => setAvailableGames(doc));
  }, []);

  useEffect(() => {
    if (selectedGame != null) {
      let curPlayer = "black";
      let curTurnCount = 0;
      for (let i = 0; i <= selectedGame.moveCount; i++) {
        if (curTurnCount === 2) {
          curPlayer = curPlayer === "black" ? "white" : "black";
          curTurnCount = 1;
        } else {
          curTurnCount++;
        }
      }
      setCurPlayer(curPlayer);
      setCurPlayerMoveCount(curTurnCount);
    }
  }, [selectedGame]);

  // Hardcoded start of game setup for now
  const boardHalf = selectedGame ? selectedGame.positions.length / 2 : 0;

  const groupName = "backgammon-board";

  const onMoveSucces = () => {
    if (curPlayerMoveCount === 0) {
      setCurPlayerMoveCount(1);
    } else {
      setCurPlayer(curPlayer === "black" ? "white" : "black");
      setCurPlayerMoveCount(0);
      setDieRoll([]);
    }
  };

  const movePiece = (source, destination, place) => {
    // Move off board
    if (destination.includes("end-zone")) {
      const zoneColor = destination.replace("end-zone-", "");
      if (curPlayer === zoneColor) {
        const posFrom = source.droppableId.match(/\d+/g).map(Number)[0];
        const posTo = zoneColor === "black" ? 24 : 25;
        MakeMove(
          curPlayer === player1.color ? player1 : player2,
          posFrom,
          posTo,
          selectedGame,
          dieRoll,
          onMoveSucces
        );
      }
      return;
    }

    // {draggableId: "piece-0-1", droppableId: "board-line-0", height: 42} "board-line-2" "END_OF_LIST"
    const posFrom = source.droppableId.match(/\d+/g).map(Number)[0];
    const posTo = destination.match(/\d+/g).map(Number)[0];

    // TODO, CHECK VALIDITY OF MOVE. ADD INDEXED MOVING?

    /*
    const sourceId = source.draggableId.split("-");
    const pieceIdx = sourceId[sourceId.length - 1];
    const pieceIdxTo =
      place === "END_OF_LIST" ? 0 : place.match(/\d+/g).map(Number)[0];
    */
    MakeMove(
      curPlayer === player1.color ? player1 : player2,
      posFrom,
      posTo,
      selectedGame,
      dieRoll,
      onMoveSucces
    );
  };

  const onNewGameSuccess = res => {
    console.log(res);
  };

  const rollDie = () => {
    const dieRoll = () => Math.round(Math.random() * 6);
    const roll = [dieRoll(), dieRoll()];
    setDieRoll(roll);
  };
  // selectedGame.positions.slice(0, boardHalf)
  const topHalfPieces = selectedGame ? selectedGame.positions.slice(0, 12) : [];
  const bottomHalfPieces = selectedGame
    ? selectedGame.positions.slice(12, 23)
    : [];
  const whiteZonePieces = selectedGame ? selectedGame.positions[24].pieces : [];
  const blackZonePieces = selectedGame ? selectedGame.positions[25].pieces : [];

  return (
    <div className="App">
      <DragDropContext
        onDragEnd={movePiece}
        scrollContainerHeight={document.innerHeight}
        scrollContainerMinHeight={document.innerHeight}
        dragAndDropGroup={groupName}
      >
        <header className="App-header">
          <div className={"header-text"}>WebGammon</div>
          <button
            onClick={() => StartNewGame(player1, player2, onNewGameSuccess)}
            className={"new-game-btn"}
          >
            New Game
          </button>
        </header>
        {selectedGame ? (
          <div className={"board-wrapper game"}>
            <div className={"board-top-section"}>
              <button
                tabIndex="0"
                onClick={() => setSelectedGame(null)}
                className={"back-btn"}
              >
                {"<- "}Back
              </button>
              <div className={"cur-player-header " + curPlayer}>
                Current Player: {curPlayer}
              </div>
              <div className={"num-moves"}>
                Move Count: {selectedGame.moveCount}
              </div>
              <div className={"dice-section"}>
                <button
                  tabIndex="0"
                  onClick={rollDie}
                  className={"roll-dice-btn"}
                >
                  Roll Dice
                </button>
                {dieRoll.length > 0 && (
                  <div className={"die-roll-info"}>
                    Die Roll: (
                    {dieRoll.map((die, idx) => (idx === 0 ? die + ", " : die))})
                  </div>
                )}
              </div>
            </div>
            <div className={"game-board-wrapper"}>
              <EndZone
                pieces={whiteZonePieces}
                dragAndDropGroup={groupName}
                color={player1.color}
              />
              <div className={"board-halves"}>
                <div className={"board-half top"}>
                  <BoardHalf
                    middleIndex={boardHalf}
                    curPlayer={curPlayer}
                    top={true}
                    groupName={groupName}
                    pieces={topHalfPieces}
                  />
                </div>
                <div className={"board-half bottom"}>
                  <BoardHalf
                    middleIndex={boardHalf}
                    curPlayer={curPlayer}
                    groupName={groupName}
                    pieces={bottomHalfPieces}
                  />
                </div>
              </div>
              <EndZone
                pieces={blackZonePieces}
                dragAndDropGroup={groupName}
                color={player2.color}
              />
            </div>
          </div>
        ) : availableGames &&
          availableGames.docs &&
          availableGames.docs.length > 0 ? (
          <div className={"board-wrapper"}>
            <div className={"game-selection-header"}>Select Game to Resume</div>
            <div className={"avilable-games"}>
              {availableGames.docs
                .map(doc => {
                  const game = doc.data();
                  game.id = doc.id;
                  return game;
                })
                .map(game => (
                  <GameTile
                    key={game.id}
                    onClick={setSelectedGame}
                    game={game}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className={"board-wrapper"}>No games yet...</div>
        )}
      </DragDropContext>
    </div>
  );
}

export default App;
