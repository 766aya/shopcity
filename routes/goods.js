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
	let page = 	req.param('page');
	let pageSize = req.param("pageSize");
	let sort = req.param("sort");
	let Gte = req.param("gte");
	let Lte = req.param("lte");
	let params = {};
	let skip;
	if (page == undefined) {
		res.json({status:1, msg: ''})
		res.end()
	} else if (pageSize == undefined) {
		res.json({status:1, msg: ''})
		res.end()
	} else if (sort == undefined) {
		res.json({status:1, msg: ''})
		res.end()
	} else if (Gte == undefined) {
		res.json({status:1, msg: ''})
		res.end()
	} else if (Lte == undefined) {
		res.json({status:1, msg: ''})
		res.end()
	} else {
		page = parseInt(page)
		pageSize = parseInt(pageSize)
		sort = parseInt(sort)
		Gte = parseInt(Gte)
		Lte = parseInt(Lte)
		skip = (page-1)*pageSize;
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

router.get('/details', function(req, res, next) {
	let productId = req.param('productId');
	if (productId == undefined) {
		res.json({
			status: '1',
			msg: 'productId is undefined',
			result: ''
		});
	}else {
		productId = parseInt(productId);
		let query = Goods.find({"productId": productId});
		query.exec({}, (err, doc)=>{
			if (doc && doc.length != 0) {
				new Promise((resolve, reject)=>{
					let data = {
						"productName": doc[0].productName,
						"productDescription": doc[0].productDescription,
						"salePrice": doc[0].salePrice,
						"salePriceDiscount": (doc[0].salePrice * 0.8),
						"productImgList": [
							'http://img.hb.aicdn.com/7e3d21cd1034bb6b07f6a207348305fb1b4038eb26e4f-qGYDzs_fw658',
						 	'http://img.hb.aicdn.com/5bc2af3f251e29fb904fea6966e0424c6c1699491eaa4-z1IR6E_fw658',
						 	'http://img.hb.aicdn.com/e3ce0bf406df30db5a401fb722b313bfbbade3c13cb23-9mZ5OJ_fw658',
						 	'http://img.hb.aicdn.com/bc043aacfeab60b7e4ef1295af1fa819b8ed5e2e3dedf-hRVHR5_fw658',
						 	'http://img.hb.aicdn.com/40c0eebce2deeb3ab980b99dee58af99c083027c4e069-kbz3bP_fw658'
						],
						"details": 'http://img.hb.aicdn.com/1f43d83bce2501f2037f3ebbbda81f3c473f511a1cef9d-fG6rmw_fw658.jpg'
					}
					resolve(data)
				}).then(result=>{
					res.json({status: 0, msg: 'get detailsInfo success', result:result})
					res.end()
				}).catch(err=>{
					res.json({
						status: 1,
						msg: 'get detailsInfo error',
						result: err
					});
					res.end()
				})
			} else {
				if (err) {
					res.json({
						status: 1,
						msg: 'get productId error',
						result: err
					});
					res.end()
				} else {
					res.json({
						status: 1,
						msg: '该商品ID不存在',
						result: ''
					});
					res.end()
				}
			}
			
		})
	}
});

module.exports = router;
