import vikeReact from "vike-react/config";

export default {
  extends: [vikeReact],
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
} satisfies import("vike/types").Config;
