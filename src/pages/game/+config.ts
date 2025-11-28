import { env } from "process";
import { Config } from "vike/types";

export default {
  reactStrictMode: env.NODE_ENV !== "production",
} satisfies Config;
