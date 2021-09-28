var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var CORS = require('cors');

var app = express();
app.set('port', 5995);
app.set('mysql', mysql);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());


app.use('/static', express.static('public'));
app.use('/', require('./menuItems.js'));
app.use('/productCategories', require('./productCategories.js'));
app.use('/carts', require('./carts.js'));
app.use('/cartItems', require('./cartItems.js'));
app.use('/payments', require('./payments.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.json('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.json('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});