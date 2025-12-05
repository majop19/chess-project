import { BoardOrientationProvider } from "#front/context/board-orientation";
import { TimersProvider } from "#front/context/timers";
import { ReactNode } from "react";
import { useData } from "vike-react/useData";
import { GameData } from "./+data";
import { ChessGameProvider } from "#front/context/ChessGameContext";

export const Layout = ({ children }: { children: ReactNode }) => {
  const data = useData<GameData>();

  const timeCurrentPlayer =
    data.white.isRunning == true ? data.game.whiteTime : data.game.blackTime;
  return (
    <BoardOrientationProvider
      initialOrientation={data.white.player == "user" ? "white" : "black"}
    >
      <TimersProvider
        timer={{
          whiteTime: data.white.time,
          blackTime: data.black.time,
          timeIncrement: data.game.timeIncrement,
          timeCurrentPlayer: timeCurrentPlayer,
          isRunning: {
            white: data.white.isRunning,
            black: data.black.isRunning,
          },
        }}
        lastUpdateTime={data.game.lastUpdateTime}
      >
        <ChessGameProvider initialBoardState={data.game.boardState}>
          {children}
        </ChessGameProvider>
      </TimersProvider>
    </BoardOrientationProvider>
  );
};
