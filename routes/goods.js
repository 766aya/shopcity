var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../moduls/goods');

// 连接MongoDB数据库
mongoose.connect('mongodb://120.77.44.197:27017/shopping')

// 监听数据库状态
mongoose.connection.on('connected', ()=>{
	console.log('MongoDB connected success')
})
mongoose.connection.on('error', ()=>{
	console.log('MongoDB connected error')
})
mongoose.connection.on('disconnected', ()=>{
	console.log('MongoDB connected disconnected')
})

/* GET Goods Module. */
router.get('/', function(req, res, next) {
	let page = parseInt(req.param('page'));
	let pageSize = parseInt(req.param("pageSize"));
	let sort = parseInt(req.param("sort"));
	let Gte = parseInt(req.param("gte"));
	let Lte = parseInt(req.param("lte"));
	let params = {};
	let skip = (page-1)*pageSize;
	if (page || pageSize || sort || Gte || Lte) {
		res.json({status:1, msg: '参数不全，访问失败！'})
		res.end()
		return false
	}
	var goodsModel;
	var pages;
	if (Gte == Lte) {
		new Promise((resolve, reject)=>{
			goodsModel = Goods.find(params);
			goodsModel.exec({}, (err, doc)=>{
				let pages = doc.length/pageSize
				resolve(pages)
			})
		}).then(response=>{
			goodsModel.skip(skip).limit(pageSize)
			goodsModel.sort({'salePrice': sort});
			goodsModel.exec({}, (err, doc)=>{
				if (!err) {
					res.json({
						status: '0',
						msg: '',
						result: {
							count: doc.length,
							list: doc,
							len: Math.ceil(response)
						}
					})
				}else{
					res.json({
						status: '1',
						msg: err.message
					})
				}
			})
		})
	} else {
		new Promise((resolve, reject)=>{
			goodsModel = Goods.find({"salePrice": {$gte: Gte, $lte: Lte}});
			goodsModel.exec({}, (err, doc)=>{
				let pages = doc.length/pageSize
				resolve(pages)
			})
		}).then(response=>{
			goodsModel.skip(skip).limit(pageSize)
			goodsModel.sort({'salePrice': sort});
			goodsModel.exec({}, (err, doc)=>{
				if (!err) {
					res.json({
						status: '0',
						msg: '',
						result: {
							count: doc.length,
							list: doc,
							len: Math.ceil(response)
						}
					})
				}else{
					res.json({
						status: '1',
						msg: err.message
					})
				}
			})
		})
	}
});

module.exports = router;
