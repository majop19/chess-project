import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  extends: [vikeReact],
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
  disableUrlNormalization: true,
  port: Number(process.env.PORT) || 3000,
} satisfies Config;
