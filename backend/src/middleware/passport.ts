import type { StrategyOptions } from "passport-jwt";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import Config from "@/config";
import UserModel from "@/models/user/user.model";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Config.env.jwt_secret,
};

export const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await UserModel.findOne({ user_id: jwt_payload.user_id, user_archived: false });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
