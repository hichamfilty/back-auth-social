const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  uid: String,
  token: String,
  email: String,
  username: String,
  gender: String,
  picture: String,
  provider: String,
  profileUrl: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User