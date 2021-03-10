const express = require('express')
const router = express.Router()
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
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000', session: true }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  })
router.get('/auth/twitter', passport.authenticate('twitter'))

router.get('/auth/twitter/callback', passport.authenticate('twitter',{failureRedirect: 'http://localhost:3000'}), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('http://localhost:3000');
} )
router.get('/auth/github', passport.authenticate('github', { scope: ['user: email']}))
router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: 'http://localhost:3000', session: true} ), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('http://localhost:3000')
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : 'http://localhost:3000',
			failureRedirect : 'http://localhost:3000'
		}));
module.exports = router
