import { useSocket } from "#front/hooks/use-socket";
import { usePageContext } from "vike-react/usePageContext";
import { Button } from "#front/components/ui/button";
import { ChessGameTimerType, UserGuardPageContext } from "#front/utils/types";
import { useUserWaitingRoom } from "#front/hooks/use-userWaitingRoom";
import { Chessboard } from "react-chessboard";
import {
  BlitzTimerArray,
  BulletTimerArray,
  RapidTimerArray,
  TimersVariant,
} from "./chessGameTimerArray";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "#front/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  BlitzIcon,
  BulletIcon,
  RapidIcon,
} from "#front/components/icon/GameMode.icon";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#front/components/ui/avatar";
import { bufferToObjectId } from "#front/utils/bufferToHex.function";
import { useBoardSize } from "#front/hooks/use-BoardSize.ts";
import { useIsMobile } from "#front/hooks/use-mobile.ts";
import { cn } from "#front/lib/utils.ts";

export const Page = () => {
  const pageContext = usePageContext();
  const [currentTimer, setCurrentTimer] = useState<ChessGameTimerType>({
    timeControl: 10,
    timeIncrement: 0,
  });
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const { width } = useBoardSize();
  console.log("width", width);
  const isMobile = useIsMobile();
  const increment =
    currentTimer.timeIncrement != 0
      ? ` | ${currentTimer.timeIncrement}`
      : " min";
  const playerTimer = currentTimer.timeControl.toString() + ":00";

  const user = {
    // @ts-expect-error -- fix type
    ...pageContext.user,
    // @ts-expect-error -- fix type
    id: bufferToObjectId(pageContext.user.id),
  } as UserGuardPageContext;

  const socket = useSocket({
    auth: {
      userId: user.id,
      elo: user.chessProfile.elo,
    },
  });

  const handleTimerClick = (timer: ChessGameTimerType) => {
    if (isWaiting) {
      socket.emit("removeUserInWaitingRoom", {
        timeControl: currentTimer.timeControl,
        timeIncrement: currentTimer.timeIncrement,
      });
    } else {
      socket.emit("addUserInWaitingRoom", {
        timeControl: timer.timeControl,
        timeIncrement: timer.timeIncrement,
      });
    }
    setIsWaiting((curr) => !curr);
  };

  const onClick = (timer: ChessGameTimerType) => {
    setCurrentTimer(timer);
    setIsTimersOpen(false);
  };

  useUserWaitingRoom(socket, user, setIsWaiting);
  console.log("mutation", isWaiting);
  return (
    <div className="flex justify-center gap-10 items-center h-full w-full">
      {!isMobile ? (
        <div>
          <div
            className={cn(
              "flex flex-items gap-2 items-center h-[70px]",
              width > 1400
                ? "w-[800px]"
                : width > 1280
                ? "w-[700px]"
                : width > 1180
                ? "w-[600px]"
                : isMobile
                ? `w-[${width - 20}px]`
                : "w-[500px]"
            )}
          >
            <Avatar className="size-13">
              <AvatarImage src="player.png" className="p-1" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <p className="font-medium text-xl">Opponent</p>
            <div className="w-45 h-12 bg-card flex items-center text-4xl font-semibold justify-end pr-3 relative ml-auto">
              {playerTimer}
            </div>
          </div>
          <Chessboard
            boardWidth={
              width > 1400
                ? 800
                : width > 1280
                ? 700
                : width > 1180
                ? 600
                : isMobile
                ? width - 20
                : 500
            }
            arePiecesDraggable={false}
            customDarkSquareStyle={{
              backgroundColor: "var(--color-board-black)",
            }}
            customLightSquareStyle={{
              backgroundColor: "var(--color-board-white)",
            }}
            customNotationStyle={{ fontSize: "17px", fontWeight: "600" }}
          />
          <div
            className={cn(
              "flex flex-items gap-2 items-center h-[70px]",
              width > 1400
                ? "w-[800px]"
                : width > 1280
                ? "w-[700px]"
                : width > 1180
                ? "w-[600px]"
                : isMobile
                ? `w-[${width - 20}px]`
                : "w-[500px]"
            )}
          >
            <Avatar className="h-11 w-11 rounded-md">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="font-semibold bg-secondary rounded-md text-2xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-xl">{user.name}</p>
            <div className="w-45 h-12 bg-card flex items-center text-4xl font-semibold  justify-end pr-3 relative ml-auto">
              {playerTimer}
            </div>
          </div>
        </div>
      ) : null}
      <Card
        className={cn(
          "h-[940px]",
          isMobile ? "w-3/4 h-fit" : "w-1/4 h-[940px]"
        )}
      >
        <CardHeader className="w-full">
          <div className="flex justify-center">
            <Button
              onClick={() => setIsTimersOpen((curr) => !curr)}
              className={cn(
                "w-full text-xl font-bold h-14 p-4",
                isMobile ? "" : "m-2"
              )}
              variant="outline"
              disabled={isWaiting}
            >
              <div className="flex justify-center w-full">
                {currentTimer.timeControl >= 10 ? (
                  <RapidIcon />
                ) : currentTimer.timeControl >= 3 ? (
                  <BlitzIcon />
                ) : (
                  <BulletIcon />
                )}
                {currentTimer.timeControl + increment}
              </div>
              {isTimersOpen ? (
                <ChevronUp size={28} className="ml-auto" />
              ) : (
                <ChevronDown size={28} className="ml-auto" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className={cn("h-full", isMobile ? "" : "p-2")}>
          {isTimersOpen ? (
            <div className="w-full">
              <TimersVariant
                timersArray={BulletTimerArray}
                gameMode="bullet"
                onClick={onClick}
              />
              <TimersVariant
                timersArray={BlitzTimerArray}
                gameMode="blitz"
                onClick={onClick}
              />
              <TimersVariant
                timersArray={RapidTimerArray}
                gameMode="rapid"
                onClick={onClick}
              />
            </div>
          ) : null}
          <div className="flex justify-center">
            <Button
              className={cn(
                "w-full text-xl font-bold h-14 p-4",
                isMobile ? "m-2" : "m-2"
              )}
              onClick={() => handleTimerClick(currentTimer)}
            >
              {isWaiting ? "Cancel Search" : "Start Game"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
