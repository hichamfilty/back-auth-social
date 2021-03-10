const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GitthubStrategy = require('passport-github').Strategy
const facebookStrategy = require('passport-facebook').Strategy

const User = require('./models/User')

module.exports = function(passport){

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL:'/auth/google/callback' 
  },  (accessToken, refreshToken, profile, cb) => {
    User.findOne({ uid: profile.id }, async(err, user) => {
     if(err) {
       return cb(err, null)
     }
     if(!user){
       const newUser = new User({
         uid: profile.id,
         username: profile.name.givenName + ' ' + profile.name.familyName,
         picture: profile.photos[0].value,
         provider: profile.provider,
         profileUrl: profile.profileUrl
       })
       await newUser.save()
       cb(null, newUser)
     }
     return cb(null, user)
    })
    //console.log(profile)
    //cb(null, profile)
    
  }))

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  }, function(token, tokenSecret, profile, cb){
    User.findOne({uid: profile._id}, async(err, user) => {
      if(err) {
        return cb(err, null)
      }
      if(!user) {
        const newUser = new User({
          uid: profile._id,
          token,
          username: profile.username,
          picture: profile.photos[0].value,
          provider: profile.provider,
          profileUrl: profile.profileUrl
        })
        await newUser.save()
        cb(null, newUser)
      }
      cb(null, user)
    })
    // console.log(profile)
    // cb(null, profile)
  }))

  passport.use(new GitthubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  }, function(accessToken, refreshToken, profile, cb) {
    User.findOne({uid: profile.id}, async(err, user) => {
      if(err) {
        return cb(err, null)
      }
      if(!user) {
        const newUser = new User({
          uid: profile.id,
          username: profile.username,
          picture: profile.photos[0].value,
          provider: profile.provider,
          profileUrl: profile.profileUrl
        })
        await newUser.save()
        cb(null, newUser)
      }
      return cb(null, user)
    })
    // console.log(profile)
    // cb(null, profile)
  }))
  

  passport.use(new facebookStrategy({

    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
},
function(token, refreshToken, profile, cb) {
        User.findOne({ 'uid' : profile.id }, async function(err, user) {
            if (err){
                return cb(err, null)   
             }
            if (user) {
                console.log("user found")
                console.log(user)
                return cb(null, user)
            } else {
                const newUser = new User({
                  uid: profile.id,
                  token: token,
                  username: profile.name.givenName + ' ' + profile.name.familyName,
                  provider: profile.provider,
                  gender: profile.gender,
                  email: profile.emails[0].value,
                  picture: profile.photos[0].value
                })
                await newUser.save()
                return cb(null, newUser)
            }
        })
}))
  passport.serializeUser((user, done) => {
    return done(null, user._id)
    })

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });
}
