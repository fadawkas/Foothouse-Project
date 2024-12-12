const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User"); // User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Looking for user with Google ID:', profile.id);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          console.log('User not found, creating new user...');
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
          console.log('New user created:', user);
        }
        console.log('User found:', user);
        done(null, user);
      } catch (err) {
        console.error('Error during Google authentication:', err.message);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec(); // Use .exec() to ensure a Promise is returned
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});