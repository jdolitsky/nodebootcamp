// required modules
var express = require('express');
var engine = require('ejs-locals');

var mymodule = require('./mymodule.js');

// initialize our app
var app = express();


app.engine('ejs', engine);

// app configuation
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());

// port that server will listen on
var port = 3009;

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

app.get('/update', mymodule.update);

app.get('/',function(req, res) {
	res.redirect('/users/josh');
});

// root route (response for http://localhost:3000/)
app.get('/users/:username', function (req, res) {

	var username = req.params.username;

	var html = '';
	res.send(username);

});