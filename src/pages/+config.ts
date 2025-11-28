import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
  extends: [vikeReact],
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
};

export default config;
