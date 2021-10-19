import React from "react";

import type { NextPage } from "next";
import cn from "classnames";

import styles from "../styles/Home.module.css";

import arrowDownIcon from "../svg/arrow-down.svg";
import arrowLeftIcon from "../svg/arrow-left.svg";
import arrowRightIcon from "../svg/arrow-right.svg";
import arrowUpIcon from "../svg/arrow-up.svg";
import undoIcon from "../svg/undo.svg";

import useGameState from "../game";

const GameTile: React.FC<{ value: number; x: number; y: number }> = ({
  value,
  x,
  y,
}) => {
  const [coords, setCoords] = React.useState([
    { x, y },
    { x, y },
  ]);

  React.useEffect(() => {
    setCoords(([prev]) => [{ x, y }, prev]);
  }, [setCoords, x, y]);

  return (
    <div
      className={styles.gameTile}
      style={{
        transition: [
          //`top ${Math.abs(coords[1].y - coords[0].y) / 15}s`,
          //`left ${Math.abs(coords[1].x - coords[0].x) / 15}s`,
          `top 0.2s`,
          `left 0.2s`,
        ].join(", "),

        left: `${1 + coords[0].x * 7}rem`,
        top: `${1 + coords[0].y * 7}rem`,
      }}
    >
      {Math.pow(2, value)}
    </div>
  );
};

const Home: NextPage = () => {
  const boardSize = 4;
  const [{ current: currentState, historyHeight: undos }, makeMove] =
    useGameState(boardSize);

  const tiles = (() => {
    const acc = [];

    let x = 0;
    for (const row of currentState) {
      let y = 0;
      for (const cell of row) {
        if (cell) {
          acc.push({ ...cell, x, y });
        }
        y++;
      }
      x++;
    }
    return acc;
  })();

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        {new Array(Math.pow(2, boardSize)).fill(null).map((_, i) => (
          <div key={i} className={cn(styles.gridSpace)} />
        ))}

        {tiles.map(({ id, ...props }) => (
          <GameTile key={id} {...props} />
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <div className={cn(styles.button)} />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Up")}
          style={{ backgroundImage: `url(${arrowUpIcon.src}` }}
        />
        <div className={cn(styles.button)} />

        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Left")}
          style={{ backgroundImage: `url(${arrowLeftIcon.src}` }}
        />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          style={{ backgroundImage: `url(${undoIcon.src}` }}
          onClick={() => makeMove("Undo")}
        >
          <div className={cn(styles.buttonFlag)}>{undos}</div>
        </button>
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Right")}
          style={{ backgroundImage: `url(${arrowRightIcon.src}` }}
        />

        <div className={cn(styles.button)} />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Down")}
          style={{ backgroundImage: `url(${arrowDownIcon.src}` }}
        />
        <div className={cn(styles.button)} />
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
