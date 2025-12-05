import { Game } from "#front/models/game.model";
import { replacerFunc } from "#front/utils/replaceFunction.ts";
import { type IGame } from "#front/utils/types";
import { render } from "vike/abort";
import { type PageContextServer } from "vike/types";

export type GameData = Awaited<ReturnType<typeof data>>;

export const data = async (pageContext: PageContextServer) => {
  const gameId = pageContext.routeParams.id;

  const game: IGame | null = await Game.findOne({
    _id: gameId,
    // @ts-expect-error -- fix type
    $or: [{ whiteId: pageContext.user?.id }, { blackId: pageContext.user?.id }],
  }).populate("whiteId blackId");

  if (!game) throw render(403);

  await game.whiteId.populate("chessProfile");
  await game.blackId.populate("chessProfile");

  const timeStamp =
    game.timeControl == 10
      ? "rapid"
      : game.timeControl == 5
      ? "blitz"
      : "bullet";

  const whitePlayer = {
    id: game.whiteId._id,
    name: game.whiteId.name,
    image: game.whiteId.image,
    player:
      // @ts-expect-error -- fix type
      String(game.whiteId._id) == String(pageContext.user?.id)
        ? "user"
        : "opponent",
    time:
      game.turn != "white"
        ? game.whiteTime
        : game.whiteTime - (Date.now() - game.lastUpdateTime.getTime()),
    isRunning: game.turn == "white" && game.status == "active",
    elo: game.whiteId.chessProfile.elo[timeStamp],
  };
  const blackPlayer = {
    id: game.blackId._id,
    name: game.blackId.name,
    image: game.blackId.image,
    time:
      game.turn != "black"
        ? game.blackTime
        : game.blackTime - (Date.now() - game.lastUpdateTime.getTime()),
    player:
      // @ts-expect-error -- fix type
      String(game.blackId._id) == String(pageContext.user?.id)
        ? "user"
        : "opponent",
    isRunning: game.turn == "black" && game.status == "active",
    elo: game.blackId.chessProfile.elo[timeStamp],
  };

  console.log("moves", game.moves);
  return {
    white: whitePlayer,
    black: blackPlayer,
    game: {
      _id: game._id,
      timeControl: game.timeControl,
      timeIncrement: game.timeIncrement,
      isRated: game.isRated,
      status: game.status,
      turn: game.turn,
      winner: game.winner,
      pgn: game.pgn,
      boardState: game.boardState,
      castlingRights: game.castlingRights,
      takesMoveNumber: game.takesMoveNumber,
      fullMoveNumber: game.fullMoveNumber,
      lastUpdateTime: game.lastUpdateTime,
      createdAt: game.createdAt,
      whiteTime: game.whiteTime,
      blackTime: game.blackTime,
      moves: JSON.parse(JSON.stringify(game.moves, replacerFunc())),
    },
  };
};
