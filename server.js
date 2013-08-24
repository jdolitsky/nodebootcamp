// required modules
var express = require('express');
var engine = require('ejs-locals');

// initialize our app
var app = express();


app.engine('ejs', engine);

// app configuation
app.set('views', __dirname+'/views');

app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());

// port that server will listen on
var port = 3000;

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {

	res.send('Hi!');

});
