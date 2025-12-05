import MongoStore from "connect-mongo";
import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  cookie: {
    sameSite: "strict",
    maxAge: 1209600000, // 2 weeks
    secure: "auto",
    domain:
      process.env.NODE_ENV === "production"
        ? `${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : undefined,
  },
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI!,
    touchAfter: 12 * 3600, // 24 hours
  }),
});

export default sessionMiddleware;
