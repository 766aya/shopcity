var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../moduls/users');
var yzm = require('../moduls/yzm');
var sendMail = require('../moduls/sendMail');
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

router.get('/', (req, res, next)=>{
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

router.post('/', (req, res)=>{
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

router.get('/retrieve-password/yzm', (req, res, next)=>{
	// 生成随机验证码
	let r = Math.random()*1000000;
	let rm = Math.round(r)
	if (rm.length < 6) {
		rm = toString(rm) + toString(rm[3]);
	}
	// 接收前端用户信息
	let Username = req.param('Username');
	let EmailAddress = req.param('EmailAddress');

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
		if (result.EmailAddress == EmailAddress) {
			let dt = new Date().getTime()
			var query  = yzm.where({ "Username": Username });
			query.findOne(function (err, doc){
				if (err) {
					res.send(err)
					res.end()
				}else if(doc) {
					yzm.update( {Username: Username}, {Username: Username, startTime: dt, yzm: rm}, {multi: false}, (err, rows_updated)=>{
						if (!err) {
							sendMail(EmailAddress, '商城系统-找回密码', `<h6>用户${Username}您好！<h6><h1>您的验证码是：${rm}，五分钟内有效。</h1>`, (err, result)=>{
								if (!err) {
									res.json({'status': 0, msg: '邮件发送成功！' });
									res.end()
								}else {
									res.json({'status': 1, msg: '邮件发送失败！'+err})
									res.end()
								}
							})
						}
					});
				} else {
					let insertData = new yzm({Username: Username, startTime: dt, yzm: rm}, false);
					insertData.save(function (err, doc) {
						if (err) {
							res.json({status: '1', msg: '请尝试重新发送邮件！' });
							res.end()
						} else {
							sendMail(EmailAddress, '商城系统-找回密码', `<h6>用户${Username}您好！<h6><h1>您的验证码是：${rm}，五分钟内有效。</h1>`, (err, result)=>{
								if (!err) {
									res.json({'status': 0, msg: '邮件发送成功！' });
									res.end()
								}else {
									res.json({'status': 1, msg: '邮件发送失败！'+err})
									res.end()
								}
							})
						}
					})
				}
			})
		} else {
			res.json({'status': 1, msg: 'Email地址不匹配！'})
			res.end()
		}
	}).catch(err=>{
		res.json({'status': 1, msg: '邮件发送失败！'+err})
		res.end()
	})
});

router.post('/retrieve-password', (req, res)=>{
	let username = req.body.Username;
	let password = req.body.password;
	let repassword = req.body.repassword;
	let verificationCode = req.body.verificationCode;

	console.log(username, password, repassword, verificationCode)

	res.json({'status': 0, msg: '密码修改成功！'})
	res.end()
})
module.exports = router;