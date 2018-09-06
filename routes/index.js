var express = require('express');
var fs = require("fs");
var ejs = require("ejs");
var products = require("../product");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // HTMLPage.html 파일 읽기
  var htmlPage = fs.readFileSync("HTMLPage.html", "utf8");

  // 응답
  res.send(ejs.render(htmlPage, {
    products: products
  }));

  // res.render('index', { title: 'Express' });
});

module.exports = router;
