// required modules
var express = require('express');
var engine = require('ejs-locals');
var mongoose = require('mongoose');

// connect to MongoDB
var db = 'bootcamp';
mongoose.connect('mongodb://localhost/'+db);


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

// create user model 
var User = mongoose.model('User', {
	username: String,
	password: String,
	image: String,
	bio: String,
	friends: Array
});

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

app.get('/newuser/:username', function (req, res) {
	var username = req.params.username;
	var newUser = new User({
		username: username,
		password: "thisismypass",
		bio: "Just a regular guy",
		image: "https://0.gravatar.com/avatar/79943d1a567466f80e313d18728ea205?d=https%3A%2F%2Fidenticons.github.com%2F42a78e833c8827c576df9398f411616f.png",
		friends: []
	}).save(function (err){
		console.log('New user '+username+' created!');
		res.send('welcome '+username);
	});
	
});

app.get('/allusers',function (req, res){

	var query = {};
	User.find(query, function (err, users) {

		res.send(users);

	});
});

app.get('/updateuser', function (req, res){
	var query = {username: "frank"};
	var changes = {$push: {friends: "friend1" } };
	User.update(query, changes, function (err, users) {

		res.send('updated!');
	});
});

// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {

	var obj = {name: "Josh", city: "LA"};
	res.render('profile.ejs', {user: obj, date: "Aug 24"});

});


