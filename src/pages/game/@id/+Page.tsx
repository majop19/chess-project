import { useSocket } from "#front/hooks/use-socket";
import { UserGuardPageContext } from "#front/utils/types";
import { usePageContext } from "vike-react/usePageContext";
import { useData } from "vike-react/useData";
import { GameTimer, UserGameProfile } from "./userGameProfile";
import { GameData } from "./+data";
import { ChessGame } from "./chessGame";
import { GameLayout } from "./gameLayout";
import { DialogEndGame } from "./DialogEndGame";
import { bufferToObjectId } from "#front/utils/bufferToHex.function.ts";
import { useIsMobile } from "#front/hooks/use-mobile.ts";
import { cn } from "#front/lib/utils.ts";
import { useBoardSize } from "#front/hooks/use-BoardSize.ts";

export const Page = () => {
  const isMobile = useIsMobile();
  const { width } = useBoardSize();
  const pageContext = usePageContext();
  const { white, black, game } = useData<GameData>();
  console.log("width", width);
  const user = {
    // @ts-expect-error -- fix type
    ...pageContext.user,
    // @ts-expect-error -- fix type
    id: bufferToObjectId(pageContext.user.id),
  } as UserGuardPageContext;

  console.log("render page game", game._id, white.id, black.id);

  const socket = useSocket({
    auth: {
      userId: user.id,
      elo: user.chessProfile.elo,
    },
  });

  const opponentSide = white.player == "user" ? "blackTime" : "whiteTime";

  const userSide = white.player == "user" ? "whiteTime" : "blackTime";
  //@ts-expect-error Convert game._id from Buffer to ObjectId
  const gameId = bufferToObjectId(game._id);

  console.log(userSide, opponentSide, gameId);

  return (
    <div
      className={cn(
        "flex justify-center gap-10 items-center h-full w-full",
        isMobile ? "flex-col" : ""
      )}
    >
      <div
        className={cn(
          "flex flex-col mb-auto m-0",
          isMobile ? "" : "justify-end"
        )}
      >
        <UserGameProfile
          user={opponentSide == "whiteTime" ? white : black}
          player={opponentSide}
        >
          <GameTimer socket={socket} player={opponentSide} />
        </UserGameProfile>
        <DialogEndGame socket={socket}>
          {/* @ts-expect-error Convert game._id from Buffer to ObjectId */}
          <ChessGame socket={socket} gameId={gameId} />
        </DialogEndGame>
        <UserGameProfile
          user={userSide == "whiteTime" ? white : black}
          player={userSide}
        >
          <GameTimer socket={socket} player={userSide} />
        </UserGameProfile>
      </div>
      <GameLayout socket={socket} />
    </div>
  );
};
