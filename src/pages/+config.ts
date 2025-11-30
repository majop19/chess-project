export { config };

import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config = {
  extends: vikeReact,
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
  disableUrlNormalization: true,
} satisfies Config;
