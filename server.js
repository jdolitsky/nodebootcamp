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
	bio: String
});

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

app.get('/login', function (req, res) {
	res.render('login.ejs');
});

app.post('/signup', function (req, res) {
	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var confirm = req.body.confirm;
	var query = {username: username};

	User.findOne(query, function (err, user) {
		if(err){
			res.send('Error:'+err);
		}
		if (user) {
			res.send('Username'+username+'already taken!');
		} else {
			var userData = { 
				username: username,
				password: password,
				image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
				bio: 'Im new to NodeBook!'
			};
			var newUser = new User(userData).save(function (err){
				console.log('New user '+username+' has been created!');
				res.redirect('/users/'+username);

			});
			}
		});
	/*var newUser = new User({
		username: username,
		password: password,
		bio: "Enter profile here",
		image: "https://0.gravatar.com/avatar/79943d1a567466f80e313d18728ea205?d=https%3A%2F%2Fidenticons.github.com%2F42a78e833c8827c576df9398f411616f.png"
	}).save(function (err){
		console.log('New user '+username+' created!');
		res.redirect('/users/'+username);
	});*/
	
});

app.post('/login', function (req, res) {
	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var query = {username: username, password: password};
	User.findOne(query, function (err, user) {
		console.log(user);
		if (err || !user) {
			res.send('No user found by id '+username);
		}
		else{
			res.render('profile.ejs', {user: user});
		}
		
	});
});

app.get('/users/:username', function (req, res) {
	var username = req.params.username.toLowerCase();
	var query = {username: username};
	User.findOne(query, function (err, user) {
		console.log(user);
		if (err || !user) {
			res.send('No user found by id '+username);
		}
		else{
			res.render('profile.ejs', {user: user});
		}
		
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


