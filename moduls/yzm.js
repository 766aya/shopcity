// module.exports
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var YZMSchema = new Schema({
	"Username": String,
	"startTime": String,
	"yzm": String
})

module.exports = mongoose.model('yzm', YZMSchema)