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

export const Page = () => {
  const pageContext = usePageContext();
  const { white, black, game } = useData<GameData>();

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
    <div className="flex justify-center gap-10 items-center h-full w-full">
      <div className="flex flex-col mb-auto justify-end m-0">
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
      <div className="w-1/4 ml-10">
        <GameLayout socket={socket} />
      </div>
    </div>
  );
};
