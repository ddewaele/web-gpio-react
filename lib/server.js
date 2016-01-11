var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var pjson = require('./package.json');
var app = new (require('express'))()
var port = 3000

var webgpioreact = exports;

const DIST_PATH = path.join(__dirname, "../dist");
const JSON_PATH = path.join(__dirname,"../public","json");
const ENCODING = "UTF-8";

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

webgpioreact.start = function() {

	app.use(allowCrossDomain);

	app.use('/', require('express').static(DIST_PATH));

	app.get("/", function(req, res) {
	  res.sendFile(DIST_PATH + '/index.html') // used for dev. load the index.html from the root folder.
	})

	app.get('/boards', function(req, res) {
		var file = fs.readFileSync(path.join(JSON_PATH,"/boards/boards.json"), ENCODING);
		res.send(JSON.parse(file));
	});

	app.get("/boards/:boardName", function(req, res) {
		var boardName = req.params.boardName;
		var file = fs.readFileSync(path.join(JSON_PATH,"/boards/" + boardName + ".json"), ENCODING);
		res.send(JSON.parse(file));
	});

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	var version = pjson.version; // does not work on heroku.

	app.listen(port, function(error) {
	  if (error) {
	    console.error(error)
	  } else {
	    console.info("==> 🌎  web-gpio-react server v" + version + " listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
	  }
	})
}