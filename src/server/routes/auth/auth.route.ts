import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resendTokenEmail,
  resetPassword,
  signup,
  verifyEmail,
} from "./../../routes/auth/auth.function.js";
import passport from "passport";

const router: express.Router = express.Router();

router.post("/register", signup);

router.get(
  "/google",
  passport.authenticate("google", { failureMessage: true })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // failureRedirect: "/auth/register",
    successRedirect: "/",
    failureMessage: true,
  }),
  (req) => {
    // @ts-expect-error -- IGNORE ---
    console.log("hhhh", req.session.messages);
  }
);

router.post("/verify-email", verifyEmail);

router.post("/resend-email", resendTokenEmail);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
