var express = require('express');
var router = express.Router();

/* GET transaction page. */
router.post('/', function(req, res, next) {
  res.json({status: 0, msg: '', result: ''})
  res.end()
});

module.exports = router;
