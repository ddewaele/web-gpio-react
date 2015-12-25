var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
//var pjson = require('./package.json');
var app = express();

var webgpioreact = exports;

const PUBLIC_PATH = path.join(__dirname, '../public');
const JSON_PATH = path.join(PUBLIC_PATH,"json");


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

webgpioreact.start = function() {

	app.set('port', (process.env.PORT || 3000));

	app.use('/', express.static(PUBLIC_PATH));
	app.use(allowCrossDomain);

	app.get('/boards', function(req, res) {
		var file = fs.readFileSync(path.join(JSON_PATH,"/boards/boards.json"), "UTF-8");
    	res.send(JSON.parse(file));
	});

	app.get("/boards/:boardName", function(req, res) {
    	var boardName = req.params.boardName;
    	var file = fs.readFileSync(path.join(JSON_PATH,"/boards/" + boardName + ".json"), "UTF-8");
		res.send(JSON.parse(file));
	});


	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.listen(app.get('port'), function() {

		
	var version = "0.0.1" // pjson.version; // does not work on heroku.

	  console.log('web-gpio-react server v' + version + ' started: http://localhost:' + app.get('port') + '/');
	});

}