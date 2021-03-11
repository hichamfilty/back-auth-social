const express = require('express')
const router = express.Router
const passport = require('passport')

require('../passport')(passport)
const User = require('../models/User')

router.get('/', (req, res) =>{
  res.send('hello world')
})

router.get('/getuser', (req,res) => {
  res.send(req.user)
})

router.get('/auth/logout', (req, res) => {
  if(req.user){
    req.logout()
  req.session.destroy()
  res.status(200).json({message: 'Successfull Logout'})
  } else {
    res.json({message: 'No user to logout'})
  }
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://lucid-meninsky-d3d666.netlify.app', session: true }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('https://lucid-meninsky-d3d666.netlify.app');
  })
router.get('/auth/twitter', passport.authenticate('twitter'))

router.get('/auth/twitter/callback', passport.authenticate('twitter',{failureRedirect: 'https://lucid-meninsky-d3d666.netlify.app'}), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('https://lucid-meninsky-d3d666.netlify.app');
} )
router.get('/auth/github', passport.authenticate('github', { scope: ['user: email']}))
router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: 'https://lucid-meninsky-d3d666.netlify.app', session: true} ), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('https://lucid-meninsky-d3d666.netlify.app')
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : 'https://lucid-meninsky-d3d666.netlify.app',
			failureRedirect : 'https://lucid-meninsky-d3d666.netlify.app'
		}));
module.exports = router
