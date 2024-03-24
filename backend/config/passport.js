import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { secretTokens } from "./keys.js";
import User from "../models/user.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretTokens.accessTokenSecret,
};

passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    try {
      const foundUser = await User.findOne({ email: payload.email });

      if (!foundUser)
        return done(
          new Error("Email is not registered in the database."),
          false
        );

      return done(null, foundUser);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);

export default (app) => {
  app.use(passport.initialize());
};
