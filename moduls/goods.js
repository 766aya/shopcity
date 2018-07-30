// module.exports
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var productSchema = new Schema({
	"productId": Number,
	"productName": String,
	"productDescription": String,
	"salePrice": Number,
	"productImg": String
})

module.exports = mongoose.model('Good', productSchema)