import React from "react";
import { nanoid } from "nanoid";

type Move = "Up" | "Down" | "Left" | "Right" | "Undo";

type TileState = {
  id: string;
  value: number;
  x: number;
  y: number;
};

type GameState = Array<TileState>;

type GameHistory = {
  current: GameState;
  previous: GameHistory | null;
};

type MakeMove = (move: Move) => void;

export default function useGameState(): [GameState, MakeMove] {
  const [gameHistory, setGameHistory] = React.useState<GameHistory>({
    current: [
      { id: nanoid(), value: 1, x: 0, y: 0 },
      { id: nanoid(), value: 2, x: 1, y: 1 },
      { id: nanoid(), value: 3, x: 2, y: 2 },
      { id: nanoid(), value: 4, x: 3, y: 3 },
    ],
    previous: null,
  });

  return [gameHistory.current, (...args) => console.log("Move", ...args)];
}
