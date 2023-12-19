import gg from "passport-google-oauth20";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

export default function setUpGG() {
  const GoogleStrategy = gg.Strategy;
  const GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    )
  );


  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
