var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var webgpioreact = exports;

webgpioreact.start = function() {

	app.set('port', (process.env.PORT || 3000));

	app.use('/', express.static(path.join(__dirname, '../public')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.listen(app.get('port'), function() {
	  console.log('web-gpio-react server started: http://localhost:' + app.get('port') + '/');
	});

}