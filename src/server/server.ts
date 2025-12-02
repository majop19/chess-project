import express from "express";
import cors from "cors";
import AuthRouter from "./routes/auth/auth.route.js";
import ProfileRouter from "./routes/profile/profile.route.js";
import ProblemsRouter from "./routes/problems/problems.route.js";
import passport from "passport";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import compression from "compression";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { onlyForHandshake } from "./middleware/onlyForHandshake.js";
import sessionMiddleware from "./middleware/sessionMiddleware.js";
import vikeRenderPage from "./middleware/vikeRenderPage.js";
import { googleStrategy, localStrategy } from "./utils/authStrategy.js";
import deserializeUser from "./utils/deserializeUser.function.js";
import { WaitingRoomGameEventHandler } from "./socket.io/events/WaitingRoomGameEvent.js";
import { ServerType } from "./socket.io/socket.types.js";
import { ChessGameEventHandler } from "./socket.io/events/ChessGameEvent.js";
import mongoose, { ObjectId } from "mongoose";
import { createDevMiddleware } from "vike/server";
import { root } from "./root.js";
import tailwindcss from "@tailwindcss/vite";

async function startServer() {
  dotenv.config();

  const isProduction = process.env.NODE_ENV === "production";
  const app = express();
  const nodeServer = createServer(app);
  const io = new Server<ServerType>(nodeServer);
  app.use(compression());

  app.use(express.json());
  app.use(express.static("public"));
  app.use(cors({ origin: process.env.URL, credentials: true }));

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(localStrategy);
  passport.use(googleStrategy);

  passport.serializeUser(function (user, done) {
    console.log("serialize");
    // @ts-expect-error -- IGNORE ---
    done(null, user.id);
  });
  passport.deserializeUser(deserializeUser);
  // Vite integration
  //const __dirname = dirname(fileURLToPath(import.meta.url));
  //const root = `${__dirname}/..`;
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    app.use(express.static(`${__dirname}/dist/client`));
  } else {
    const { devMiddleware } = await createDevMiddleware({
      root,
      viteConfig: { plugins: [tailwindcss()] },
    });
    app.use(devMiddleware);
  }
  // middleware for sharing the user context
  io.engine.use(onlyForHandshake(sessionMiddleware));
  io.engine.use(onlyForHandshake(passport.session()));
  io.engine.use(
    onlyForHandshake((req, res, next) => {
      if (req.user) {
        console.log("user io", req.user);
        next();
      } else {
        res.writeHead(401);
        res.end();
      }
    })
  );
  const rematchInvitation: mongoose.Types.ObjectId[] = [];
  const activeGames: Map<ObjectId, NodeJS.Timeout> = new Map(); // stocke les parties actifs avec timeout
  io.on("connection", (socket) => {
    console.log("connection");
    const userId = socket.handshake.auth?.userId || null;

    WaitingRoomGameEventHandler(io, socket);
    ChessGameEventHandler(io, socket, rematchInvitation, activeGames);

    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("disconnect", () => {});
  });

  app.use("/auth", AuthRouter);

  app.use("/profile", ProfileRouter);

  app.use("/problems", ProblemsRouter);

  // app.get("/health", (_, res) => {
  // for health check
  //  res.status(200).send("ok");
  //});
  // Vike middleware.
  app.get("/{*vikeCatchAll}", vikeRenderPage);

  const port = process.env.PORT || 3000;
  connectDB();
  nodeServer.listen(port);
  console.log(`Server running at http://localhost:${port}`);
  return app;
}

startServer();
export default startServer;
