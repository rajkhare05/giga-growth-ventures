const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userMod = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: [ 'email', 'profile' ]
    },
    async (accessToken, refreshToken, profile, cb) => {
        let user = await userMod.findOne({ email: profile.emails[0].value });
        if (user == null) {
            user = await userMod.create({ 
                googleID: profile.id,
                firstName: profile.name.givenName, 
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
            });
        }
        return cb(null, user);
    }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { firstName: user.firstName, lastName: user.lastName, email: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

module.exports = passport;

