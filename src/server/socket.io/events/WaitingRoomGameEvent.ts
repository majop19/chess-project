import mongoose, { ObjectId } from "mongoose";
import {
  type ServerType,
  type SocketServerType,
} from "./../../socket.io/socket.types.js";
import { createChessGame } from "./../../routes/game/game.function.js";
import { ChessGameTimerType } from "./../../utils/types.js";
import { gameTimeout } from "./gameTimeout.function.js";

export const WaitingRoomGameEventHandler = async (
  io: ServerType,
  socket: SocketServerType,
  playersInQueue: mongoose.Schema.Types.ObjectId[],
  activeGames: Map<ObjectId, NodeJS.Timeout>
) => {
  // const userId = socket.handshake.auth?.userId || socket.data.userId;

  socket.on("register", (data) => {
    // Manually register user data for testing with apidog
    socket.data.userId = data.userId;
    socket.data.elo = data.elo;
    socket.join(`user:${data.userId}`);
    console.log("User registered manually:", socket.data, socket.rooms);
  });

  socket.on("addUserInWaitingRoom", async (timer) => {
    const room = `WaitingRoom:${timer.timeControl}/${timer.timeIncrement}`;
    console.log("room", room);
    if (socket.rooms.has(room)) return;
    const gameMode =
      timer.timeControl == 10 || timer.timeControl == 15
        ? "rapid"
        : timer.timeControl == 1
        ? "bullet"
        : "blitz";
    console.log("game mode", gameMode, socket.handshake.auth?.elo?.[gameMode]);
    io.to(room).emit(
      "newUserInWaitingRoom",
      {
        id: socket.handshake.auth?.userId || socket.data.userId,
        elo: socket.handshake.auth?.elo?.[gameMode].rating || socket.data.elo,
      },
      gameMode
    );

    const sockets = await io.in(room).fetchSockets();

    const UsersInWaitingRoom = sockets.map((socket) => {
      return {
        id: socket.handshake.auth?.userId || socket.data.userId,
        elo: socket.handshake.auth?.elo?.[gameMode].rating || socket.data.elo,
      };
    });
    console.log(
      "users in waiting room",
      UsersInWaitingRoom,
      socket.handshake.auth?.userId || socket.data.userId,
      { userId: socket.handshake.auth?.userId, dataUserId: socket.data.userId }
    );
    io.to(`user:${socket.handshake.auth?.userId || socket.data.userId}`).emit(
      "getUsersInWaitingRoom",
      UsersInWaitingRoom,
      gameMode
    );
    socket.join(room);

    playersInQueue.push(socket.handshake.auth?.userId || socket.data.userId);
  });

  socket.on("removeUserInWaitingRoom", async (timer) => {
    const room = `WaitingRoom:${timer.timeControl}/${timer.timeIncrement}`;

    io.in([
      `user:${socket.handshake.auth?.userId || socket.data.userId}`,
    ]).socketsLeave(room);

    console.log("remove User", socket.rooms);
    io.to([`user:${socket.handshake.auth?.userId || socket.data.userId}`]).emit(
      "deleteUserInWaitingRoom",
      socket.handshake.auth?.userId || socket.data.userId,
      timer.timeControl == 1
        ? "bullet"
        : timer.timeControl == 3
        ? "blitz"
        : "rapid"
    );
    playersInQueue.splice(
      playersInQueue.findIndex(
        (value) => value === socket.handshake.auth?.userId || socket.data.userId
      ),
      1
    );
    console.log("playersInQueue after remove", playersInQueue);
  });

  socket.on("createChessGame", async (user, opponent) => {
    console.log("begin create", user, opponent);
    const waitingRoom = Array.from(socket.rooms)
      .find((room) => room.includes("WaitingRoom:"))
      ?.replace("WaitingRoom:", "")
      .split("/");
    console.log(waitingRoom);
    if (waitingRoom) {
      const chessGame = await createChessGame(user.id, opponent.id, {
        timeControl: Number(waitingRoom[0]),
        timeIncrement: Number(waitingRoom[1]),
      } as ChessGameTimerType);

      if (chessGame == "oppenentInGame") {
        io.to(`user:${user.id}`).emit("researchOpponent");
        return;
      } else {
        console.log(`user:${opponent.id}`, socket.rooms);
        if (
          //
          playersInQueue.includes(user.id) &&
          playersInQueue.includes(opponent.id)
        ) {
          playersInQueue.splice(
            playersInQueue.findIndex((value) => value === user.id),
            1
          );
          playersInQueue.splice(
            playersInQueue.findIndex((value) => value === opponent.id),
            1
          );

          io.to([`user:${user.id}`, `user:${opponent.id}`])
            .timeout(2000)
            .emit("sendChessGameId", chessGame.id, async (err) => {
              if (err) {
                //   console.log("erreur", err);
                //  await Game.findByIdAndDelete(chessGame);
                //  io.to([`user:${socket.handshake.auth?.userId || socket.data.userId}`, `user:${opponent.id}`]).emit(
                //    "researchOpponent"
                //  );
              }
            });
          io.in([`user:${user.id}`, `user:${opponent.id}`]).socketsLeave(
            `WaitingRoom:${Number(waitingRoom[0])}/${Number(waitingRoom[1])}`
          );
          gameTimeout(io, activeGames, { ...chessGame, winner: "black" });
        }
      }
    }
  });
};
