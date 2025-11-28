import vikeReact from "vike-react/config" with {type: "pointer"}
import { type Config } from "vike/types" with {type: "pointer"}

export default {
  extends: [vikeReact],
  stream: "node",
  passToClient: ["user", "loginAccessError"],
  title: "chessApp Project",
} satisfies Config


