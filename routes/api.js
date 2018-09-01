var express = require('express');
var router = express.Router();

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

/* GET api Module. */
router.get('/sys/department/list', function(req, res, next) {
	var dataList = [
		{
			'id': 1,
			'name': '市纪委',
			'parentId': 0,
			'parentName': '顶级菜单',
			'code': '600000019',
			'areaId': 1,
			'areaName': '西安市',
			'level': 0,
			'type': 1,
			'typeForShow': '行政机关',
			'sort': 19
		},
		{
			'id': 2,
			'name': '市民政局',
			'parentName': '顶级菜单',
			'parentId': 0,
			'code': '600000018',
			'areaId': 1,
			'areaName': '西安市',
			'level': 0,
			'type': 1,
			'typeForShow': '行政机关',
			'sort': 18
		}
	]
	let data = {
		msg: 'success',
		code: 0,
		count: dataList.length,
		data: dataList
	}
	res.json(data);
	res.end();
});


router.get('/sys/department/type', (req, res, next)=>{
	var dataList = [
        {
          id: 1,
          label: '行政机关'
        },
        {
          id: 2,
          label: '事业单位'
        },
        {
          id: 3,
          label: '社会团体'
        },
        {
          id: 4,
          label: '其他组织机构'
        }
    ]

    let data = {
    	msg: 'success',
		code: 0,
		data: dataList
    }
    res.json(data);
	res.end();
})
module.exports = router;
