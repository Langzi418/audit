const mongoose = require('mongoose')
const config = require('../config/config')

mongoose.connect(config.mongodb)

var Schema = mongoose.Schema

// user
var userSchema = Schema({
  name: { type: String, require: true },
  passwd: { type: String, require: true }
})

// audit
var auditSchema = Schema({
  ip: { type: String, required: true },
  time: { type: Date, required: true, default: Date.now },
  agent: { type: String, required: true },
  normal: { type: Boolean, required: true, default: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

var settingSchema = Schema({
  location: { type: String },
  duration: { type: String },
  device: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

var User = mongoose.model('User', userSchema)
var Audit = mongoose.model('Audit', auditSchema)

module.exports = {
  User,
  Audit
}
