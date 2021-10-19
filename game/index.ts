import React from "react";
import { nanoid } from "nanoid";

type MovementMove = "Up" | "Down" | "Left" | "Right";
type Move = MovementMove | "Undo";

type Tile = {
  id: string;
  value: number;
  parents: [string, string] | null;
};

type GameState = Array<Array<Tile | null>>;

type GameHistory = {
  current: GameState;
  historyHeight: number;
  previous: GameHistory | null;
};

type MakeMove = (move: Move) => void;

function getRandomFromArray<T>(xs: Array<T>): T {
  return xs[Math.floor(Math.random() * xs.length)];
}

function createNewGameState(boardSize: number): GameState {
  return new Array(boardSize)
    .fill(null)
    .map(() => new Array(boardSize).fill(null));
}

function cloneGameState(state: GameState): GameState {
  const boardSize = state.length;

  return new Array(boardSize)
    .fill(null)
    .map((_, x) => new Array(boardSize).fill(null).map((_, y) => state[x][y]));
}

function shiftTiles(move: MovementMove, state: GameState): GameState {
  const boardSize = state.length;
  const newState = createNewGameState(boardSize);

  switch (move) {
    case "Up": {
      for (let readX = 0; readX < boardSize; readX++) {
        let writeY = 0;
        for (let readY = 0; readY < boardSize; readY++) {
          if (state[readX][readY]) {
            newState[readX][writeY] = state[readX][readY];
            writeY++;
          }
        }
      }
      return newState;
    }

    case "Left": {
      for (let readY = 0; readY < boardSize; readY++) {
        let writeX = 0;
        for (let readX = 0; readX < boardSize; readX++) {
          if (state[readX][readY]) {
            newState[writeX][readY] = state[readX][readY];
            writeX++;
          }
        }
      }
      return newState;
    }

    case "Down": {
      for (let readX = 0; readX < boardSize; readX++) {
        let writeY = boardSize - 1;

        for (let readY = boardSize - 1; readY >= 0; readY--) {
          if (state[readX][readY]) {
            newState[readX][writeY] = state[readX][readY];
            writeY--;
          }
        }
      }
      return newState;
    }

    case "Right": {
      for (let readY = 0; readY < boardSize; readY++) {
        let writeX = boardSize - 1;

        for (let readX = boardSize - 1; readX >= 0; readX--) {
          if (state[readX][readY]) {
            newState[writeX][readY] = state[readX][readY];
            writeX--;
          }
        }
      }
      return newState;
    }
  }
}

function mergeTiles(move: MovementMove, state: GameState): GameState {
  const boardSize = state.length;
  const newState = cloneGameState(state);

  switch (move) {
    case "Up": {
      for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize - 1; y++) {
          const sink = newState[x][y];
          const sacrifice = newState[x][y + 1];

          if (sink && sacrifice) {
            if (sink!.value === sacrifice!.value) {
              newState[x][y + 1] = null;

              newState[x][y] = {
                id: nanoid(),
                value: sink!.value + 1,
                parents: [sink!.id, sacrifice!.id],
              };
            }
          }
        }
      }

      return newState;
    }

    case "Left": {
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize - 1; x++) {
          const sink = newState[x][y];
          const sacrifice = newState[x + 1][y];

          if (sink && sacrifice) {
            if (sink!.value === sacrifice!.value) {
              newState[x + 1][y] = null;

              newState[x][y] = {
                id: nanoid(),
                value: sink!.value + 1,
                parents: [sink!.id, sacrifice!.id],
              };
            }
          }
        }
      }
      return newState;
    }

    case "Down": {
      for (let x = 0; x < boardSize; x++) {
        for (let y = boardSize - 1; y >= 1; y--) {
          const sink = newState[x][y];
          const sacrifice = newState[x][y - 1];

          if (sink && sacrifice) {
            if (sink!.value === sacrifice!.value) {
              newState[x][y - 1] = null;

              newState[x][y] = {
                id: nanoid(),
                value: sink!.value + 1,
                parents: [sink!.id, sacrifice!.id],
              };
            }
          }
        }
      }
      return newState;
    }

    case "Right": {
      for (let y = 0; y < boardSize; y++) {
        let writeX = boardSize - 1;

        for (let x = boardSize - 1; x >= 1; x--) {
          const sink = newState[x][y];
          const sacrifice = newState[x - 1][y];

          if (sink && sacrifice) {
            if (sink!.value === sacrifice!.value) {
              newState[x - 1][y] = null;

              newState[x][y] = {
                id: nanoid(),
                value: sink!.value + 1,
                parents: [sink!.id, sacrifice!.id],
              };
            }
          }
        }
      }
      return newState;
    }
  }

  return newState;
}

function addTile(state: GameState): GameState {
  const emptySpaces: Array<{ x: number; y: number }> = [];
  const newState: GameState = [];

  for (let x = 0; x < state.length; x++) {
    newState[x] = [];
    for (let y = 0; y < state[x].length; y++) {
      newState[x][y] = state[x][y];

      if (state[x][y] === null) {
        emptySpaces.push({ x, y });
      }
    }
  }

  const { x, y } = getRandomFromArray(emptySpaces);

  newState[x][y] = {
    id: nanoid(),
    value: 1,
    parents: null,
  };

  return newState;
}

function printState(state: GameState): void {
  const boardSize = state.length;
  for (let x = 0; x < boardSize; x++) {
    let buff = "";
    for (let y = 0; y < boardSize; y++) {
      buff = buff + (state[x][y]?.value ?? null) + "\t";
    }
    console.log(buff);
  }
}

export default function useGameState(
  boardSize: number
): [GameHistory, MakeMove] {
  const [gameHistory, setGameHistory] = React.useState<GameHistory>({
    current: addTile(createNewGameState(boardSize)),
    historyHeight: 0,
    previous: null,
  });

  const performMove = (move: Move) => {
    setGameHistory((previous) => {
      if (move === "Undo") {
        if (previous.previous) {
          return previous.previous;
        } else {
          return previous;
        }
      }

      const current = addTile(
        shiftTiles(move, mergeTiles(move, shiftTiles(move, previous.current)))
      );

      return {
        current,
        historyHeight: previous.historyHeight + 1,
        previous,
      };
    });
  };

  return [gameHistory, performMove];
}
