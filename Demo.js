// let user = require('./User');

// console.log(`userName:${user.userName}`)
// console.log(`I'm ${user.userName}, I say ${user.sayHello()}`)


let http = require('http');
let url = require('url');
let util = require('util');

var server = http.createServer((req, res)=>{
	res.statusCode = 200
	res.setHeader("Content-Type", "text/plain; charset=utf-8")
	
	// console.log("url: ", req.url) // 字符串
	// console.log("parse: ", url.parse(req.url)) // [object]
	console.log('util.inspect: ', util.inspect(url.parse(req.url))) // 转字符串 调试使用
	//请求结束的返回值
	res.end(util.inspect(url.parse(req.url)))
})

let HOST = "127.0.0.1"
let PORT = 8888

server.listen(PORT, HOST, (res)=>{
	console.log(`服务器已经运行，请访问： ${HOST}:${PORT}`)
})