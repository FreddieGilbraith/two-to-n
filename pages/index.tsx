import React from "react";

import type { NextPage } from "next";
import cn from "classnames";

import styles from "../styles/Home.module.css";

import useGameState from "../game";

const Home: NextPage = () => {
  const [state, makeMove] = useGameState();

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        {new Array(16).fill(null).map((_, i) => (
          <div key={i} className={cn(styles.gridSpace)} />
        ))}

        {state.map(({ id, value, x, y }) => (
          <div
            key={id}
            className={styles.gameTile}
            style={{
              left: `${1 + x * 7}rem`,
              top: `${1 + y * 7}rem`,
            }}
          >
            {Math.pow(2, value)}
          </div>
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <div className={cn(styles.button)} />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Up")}
        />
        <div className={cn(styles.button)} />

        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Left")}
        />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Undo")}
        />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Right")}
        />

        <div className={cn(styles.button)} />
        <button
          className={cn(styles.button, styles.buttonFilled)}
          onClick={() => makeMove("Down")}
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
