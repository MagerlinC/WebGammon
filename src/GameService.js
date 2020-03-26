import { db } from "./Firebase";

const isMoveLegal = (color, fromPos, toPos, dieRoll, game) => {
  const validObject = { valid: true, reason: "" };
  if (toPos >= 23) {
    return validObject;
  }
  if (dieRoll.length === 0) {
    validObject.valid = false;
    validObject.reason = "You must roll dice first";
    return validObject;
  }
  if (
    (color === "black" && fromPos > toPos) ||
    (color === "white" && fromPos < toPos)
  ) {
    validObject.valid = false;
    validObject.reason = "Can't move pieces backwards";
  }
  const difference = Math.abs(fromPos - toPos);
  if (
    difference !== dieRoll[0] &&
    difference !== dieRoll[1] &&
    difference !== dieRoll[0] + dieRoll[1]
  ) {
    validObject.valid = false;
    validObject.reason = "You must move according to the die roll";
  }
  return validObject;
};

export const MakeMove = (
  player,
  fromPos,
  toPos,
  game,
  dieRoll,
  onSuccess,
  onError
) => {
  const validObject = isMoveLegal(player.color, fromPos, toPos, dieRoll, game);
  if (validObject.valid) {
    const documentId = game.id;
    const newGameState = game;
    // Increase number of moves
    newGameState.moveCount = game.moveCount + 1;

    const boardLineFrom = newGameState.positions[fromPos];
    const boardLineTo = newGameState.positions[toPos];

    const indexFrom = boardLineFrom.pieces.findIndex(
      piece => piece === player.color
    );

    if (indexFrom >= 0) {
      // Remove piece from
      boardLineFrom.pieces.splice(indexFrom, 1);
      // Add piece to new line
      boardLineTo.pieces.push(player.color);
    } else {
      alert(`Error - no ${player.color} pieces at line ${fromPos}`);
      return;
    }

    db.collection("boardstates")
      .doc(documentId)
      .set(newGameState)
      .then(
        onSuccess
          ? onSuccess
          : console.log(
              "Succesfully moved piece from " + fromPos + " to " + toPos
            )
      )
      .catch(err => (onError ? onError(err) : console.log(err)));
  } else {
    alert("Illegal move - " + validObject.reason);
  }
};

export const GetAvailableGames = onSnapShotFunc => {
  return db.collection("boardstates").onSnapshot(doc => onSnapShotFunc(doc));
};

// Returns the newest game - CURRENTLY HARDCODED TO RETURN NEW GAME
export const GetGameState = (gameId, onSnapShotFunc) => {
  if (gameId && onSnapShotFunc) {
    return db
      .collection("boardstates")
      .doc(gameId)
      .onSnapshot(doc => onSnapShotFunc(doc));
  }
  /*// TODO - CURRENTLY HARDCODED TO RETURN NEW GAME
  const player1 = new Player("Xia", "black");
  const player2 = new Player("Mikkel", "white");
  return GetInitialGameState(player1, player2);*/
};

export const StartNewGame = (player1, player2, onSuccess, onError) => {
  const initialGameState = GetInitialGameState(player1, player2);
  db.collection("boardstates")
    .add(JSON.parse(JSON.stringify(initialGameState)))
    .then(onSuccess ? onSuccess : console.log("Succesfully started new game"))
    .catch(err => (onError ? onError(err) : console.log(err)));
  return initialGameState;
};

// Factory method to create multiple pieces at once in the same position
const CreatePieces = (player, numPieces) => {
  return Array(numPieces).fill(player.color);
};

// Start of game setup
export const GetInitialGameState = (player1, player2) => {
  const game = {
    player1: player1.name,
    player2: player2.name,
    timestamp: new Date(),
    moveCount: 0,
    winner: ""
  };
  game.positions = [
    // SQ1
    { position: 0, pieces: CreatePieces(player1, 5) },
    { position: 1, pieces: [] },
    { position: 2, pieces: [] },
    { position: 3, pieces: [] },
    { position: 4, pieces: CreatePieces(player2, 3) },
    { position: 5, pieces: [] },
    // SQ2
    { position: 6, pieces: CreatePieces(player2, 5) },
    { position: 7, pieces: [] },
    { position: 8, pieces: [] },
    { position: 9, pieces: [] },
    { position: 10, pieces: [] },
    { position: 11, pieces: CreatePieces(player1, 2) },
    // SQ3
    { position: 12, pieces: CreatePieces(player2, 5) },
    { position: 13, pieces: [] },
    { position: 14, pieces: [] },
    { position: 15, pieces: [] },
    { position: 16, pieces: CreatePieces(player1, 3) },
    { position: 17, pieces: [] },
    // SQ4
    { position: 18, pieces: CreatePieces(player1, 5) },
    { position: 19, pieces: [] },
    { position: 20, pieces: [] },
    { position: 21, pieces: [] },
    { position: 22, pieces: [] },
    { position: 23, pieces: CreatePieces(player2, 2) },
    // ENDZONE 1
    { position: 24, pieces: [] },
    // ENDZONE 2
    { position: 25, pieces: [] }
  ];

  return game;
};
