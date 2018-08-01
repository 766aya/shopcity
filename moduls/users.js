// module.exports
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	"Username": String,
	"Password": String,
	"EmailAddress": String,
	"EmailAuth": Boolean,
	"TelPhoneNumber": String,
	"TelAuth": Boolean
})

module.exports = mongoose.model('Users', UserSchema)