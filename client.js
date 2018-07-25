let http = require('http');

http.get('http://127.0.0.1:3000/shopgoods', (res)=>{
	let data = '';
	res.on("data", (chunk)=>{
		data+= chunk;
	})
	res.on("end", ()=>{
		let result = JSON.parse(data);
		console.log("result: "+ data);
	})
})