const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session)
const config = require("./config");
const dbLocation = path.join(__dirname, config.database);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const log = require("./logger");
const userModule = require("./lib/userModule/userModule");
const moment = require("moment");
userModule.init(dbLocation, log);

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: config.auth.secret,
    store: new SQLiteStore({ db: config.database })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.deserializeUser((user, done) => {        
    userModule.findUser(user.provider, user.id)
    .then((user) => {
        done(null, user)
    })
    .catch(err => {
        done(err, null)
    });
});

passport.serializeUser((user, done) => {
    done(null, {
        provider: user.provider,
        id: user.provider_id
    });
});

if(config.auth.facebook.clientID && config.auth.facebook.clientSecret) {
    config.auth.providers.push('facebook');
    passport.use(new FacebookStrategy({
        clientID: config.auth.facebook.clientID,
        clientSecret: config.auth.facebook.clientSecret,
        callbackURL: `/auth/facebook/callback`
      },
      function(accessToken, refreshToken, profile, done) {
        userModule.getUser(profile).then(user => {
            done(null, user);
        })
      }
    ));
}

if(config.auth.google.clientID && config.auth.google.clientSecret) {
    config.auth.providers.push('google');
    passport.use(new GoogleStrategy({
        clientID: config.auth.google.clientID,
        clientSecret: config.auth.google.clientSecret,
        callbackURL: `/auth/google/callback`
      },
      function(accessToken, refreshToken, profile, done) {
        userModule.getUser(profile).then(user => {
            return done(null, user);
        })
      }
    ));
}

app.get('/auth/success', (req, res) => {
    res.send(`<script>window.opener.window.cmt.getComments(); window.close()</script>`)
});

app.get('/auth/failure', (req, res) => {
    res.send(`<script>window.opener.alert('authentication failed, please try again'); window.close()</script>`)
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.end(JSON.stringify({ok: true}));
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/google', passport.authenticate('google',  { scope : ['profile', 'email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: `/auth/success`,
                                      failureRedirect: `/auth/failure` }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect: `/auth/success`,
                                        failureRedirect: `/auth/failure` }));
module.exports = {
    app
}