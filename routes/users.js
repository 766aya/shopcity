var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../moduls/users');

// 连接MongoDB数据库
mongoose.connect('mongodb://120.77.44.197:27017/users')

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

router.get('/', function(req, res, next) {
	let Username = req.param('Username');
	let Password = req.param('Password');
	if (Username && Password) {
		new Promise((resolve, reject)=>{
			var query  = Users.where({ "Username": Username });
			query.findOne(function (err, doc){
				if (err) {
					reject(err)
				}else if(doc) {
					resolve(doc)
				} else {
					reject('用户名不存在！')
				}
			})
		}).then(result=>{
			console.log(result.Password, Password)
			if (result.Password == Password) {
				res.json({ status: '0', msg: 'login success！'});
				res.end()
			} else {
				res.json({ status: '1', msg: '登陆失败，密码错误！'});
				res.end()
			}
		}).catch(err=>{
			res.json(err)
			res.end()
		})
	} else {
		res.json({ status: '1', msg: '用户名或密码不能为空！' });
		res.end()
	}
})

router.post('/', function(req, res) {
	let Username = req.body.Username;
	let Password = req.body.Password;
	let EmailAddress = req.body.EmailAddress;
	let TelPhoneNumber = req.body.TelPhoneNumber;

	const RezUser = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){4,19}$/;
	const RezPwd  = /^(\w){6,20}$/;
	const ReTelNumber = /^[1][3,4,5,7,8][0-9]{9}$/;
	const ReMail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

	if(Username && Password && EmailAddress && TelPhoneNumber) {
		if(!RezUser.test(Username)) {
			res.json({ status: '1', msg: '用户名不符合要求！'});
			res.end()
		}else if(!RezPwd.test(Password)) {
			res.json({ status: '1', msg: '密码不符合要求！'});
			res.end()
		}else if(!ReTelNumber.test(TelPhoneNumber)) {
			res.json({ status: '1', msg: '手机号不符合要求！'});
			res.end()
		}else if(!ReMail.test(EmailAddress)) {
			res.json({ status: '1', msg: '电子邮箱不符合要求！'});
			res.end()
		} else {
			new Promise((resolve, reject)=>{
				var query  = Users.where({ "Username": Username });
				query.findOne(function (err, doc){
					if (!err && !doc) {
						resolve()
					}else {
						reject()
					}
				})
			}).then(()=>{
				let insertData = new Users({
					"Username": Username,
					"Password": Password,
					"EmailAddress": EmailAddress,
					"EmailAuth": false,
					"TelPhoneNumber": TelPhoneNumber,
					"TelAuth": false
				}, false)
				insertData.save(function (err, doc) {
					if (err) {
						res.json({status: '1', msg: '注册失败，请重试！' });
						res.end()
					} else {
						res.json({status: '0', msg: 'register success' });
						res.end()
					}
				})
			}).catch(()=>{
				res.json({status: '1', msg: '用户名已存在，请重新注册！' });
				res.end()
			})
		}
		
	} else {
		res.json({ status: '1', msg: '所有字段均为必填项，不能为空！' });
		res.end()
	}
})
module.exports = router;