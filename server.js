let http = require('http');
let url = require('url');
let util = require('util');

let fs = require('fs')

var server = http.createServer((req, res)=>{
	var pathName = url.parse(req.url).pathname
	fs.readFile(pathName.substring(1), (err, data)=>{
		if (err) {
			res.writeHead(404, {
				'Content-Type': 'text/html'
			});
			res.write(`404 Error`)
		}else{
			res.writeHead(200, {
				'Content-Type': 'text/html'
			})
			res.write(data.toString())
		}
		res.end()
	})
})

let HOST = "127.0.0.1"
let PORT = 8888

server.listen(PORT, HOST, (res)=>{
	console.log(`服务器已经运行，请访问： ${HOST}:${PORT}`)
})