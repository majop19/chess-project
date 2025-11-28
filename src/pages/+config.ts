import vikeReact from "vike-react/config";
import { Config } from "vike/types";

export default {
  extends: vikeReact,
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
  _default: {},
} satisfies Config;
