import React from "react";
import { nanoid } from "nanoid";

type MovementMove = "Up" | "Down" | "Left" | "Right";
type Move = MovementMove | "Undo";

type TileState = {
  id: string;
  value: number;
  x: number;
  y: number;
};

type GameState = Array<TileState>;

type GameHistory = {
  current: GameState;
  historyHeight: number;
  previous: GameHistory | null;
};

type MakeMove = (move: Move) => void;

function getPrimaryAxis(move: MovementMove): "x" | "y" {
  if (move === "Up" || move === "Down") {
    return "y";
  } else {
    return "x";
  }
}

function getSecondaryAxis(move: MovementMove): "x" | "y" {
  if (move === "Up" || move === "Down") {
    return "x";
  } else {
    return "y";
  }
}

function getAxisSign(move: MovementMove): number {
  if (move === "Up" || move === "Left") {
    return -1;
  } else {
    return 1;
  }
}

function getAxisBound(move: MovementMove): number {
  if (move === "Up" || move === "Left") {
    return 0;
  } else {
    return 3;
  }
}

function getAxisAntiBound(move: MovementMove): number {
  if (move === "Up" || move === "Left") {
    return 3;
  } else {
    return 0;
  }
}

function getAxisShift(move: MovementMove): (...args: Array<number>) => number {
  if (move === "Up" || move === "Left") {
    return Math.min;
  } else {
    return Math.max;
  }
}

function getAxisAntiShift(
  move: MovementMove
): (...args: Array<number>) => number {
  if (move === "Up" || move === "Left") {
    return Math.max;
  } else {
    return Math.min;
  }
}

function sortTiles(
  move: MovementMove,
  state: Array<TileState>
): Array<TileState> {
  const sortedState = [...state];

  sortedState.sort(
    (lhs, rhs) =>
      getAxisSign(move) *
      (rhs[getPrimaryAxis(move)] - lhs[getPrimaryAxis(move)])
  );

  return sortedState;
}

function shiftTiles(
  move: MovementMove,
  state: Array<TileState>
): Array<TileState> {
  const bound = getAxisBound(move);
  const primaryAxis = getPrimaryAxis(move);
  const secondaryAxis = getSecondaryAxis(move);
  const shifter = getAxisShift(move);
  const antiShift = getAxisAntiShift(move);
  const sign = getAxisSign(move);

  const spaceInGrid: Array<Array<boolean>> = new Array(4).fill(
    new Array(4).fill(true)
  );
  const newState = [];

  for (const tile of state) {
    let primary = tile[primaryAxis];
    const secondary = tile[secondaryAxis];

    while (primary !== bound) {
      if (spaceInGrid[primary + sign][secondary]) {
        primary = primary + sign;
      } else {
        break;
      }
    }

    spaceInGrid[primary][secondary] = false;

    newState.push({
      ...tile,
      [primaryAxis]: primary,
    });
  }

  return newState;
}

export default function useGameState(): [GameState, MakeMove, number] {
  const [gameHistory, setGameHistory] = React.useState<GameHistory>({
    current: [
      { id: nanoid(), value: 1, x: 0, y: 0 },
      { id: nanoid(), value: 2, x: 1, y: 1 },
      { id: nanoid(), value: 3, x: 2, y: 2 },
      { id: nanoid(), value: 4, x: 3, y: 3 },
    ],
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

      const sorted = sortTiles(move, previous.current);

      const shifted = shiftTiles(move, sorted);

      return {
        current: shifted,
        historyHeight: previous.historyHeight + 1,
        previous,
      };
    });
  };

  return [gameHistory.current, performMove, gameHistory.historyHeight];
}
