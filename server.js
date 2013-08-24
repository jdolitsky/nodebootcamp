// required modules
var express = require('express');
var engine = require('ejs-locals');
var mongoose = require('mongoose');
var http = require('http');

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
app.use(express.cookieParser());
app.use(express.session({secret: 'coloft'}));

// port that server will listen on
var port = 3000;

// create user model 
var User = mongoose.model('User', {
	username: String,
	password: String,
	image: String,
	bio: String
});

// create status model
var Status = mongoose.model('Status', {
	body: String,
	time: Number,
	username: String,
	image: String,
	comments: Array,
	likes: Array
});

// start listening...
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);

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
				req.session.user = userData;
				console.log('New user '+username+' has been created!');
				res.redirect('/users/'+username);
			});
		}
	});
	
});

app.post('/statuses/:id', function (req,res){
	var id = req.params.id;

	var myUsername = req.session.user.username;

	Status.update({_id: id}, {$pull: {likes: myUsername}}, 
		function (err, status) {
		res.redirect('/');
	});

});

app.get('/logout', function (req, res) {

	if (req.session.user) {
		console.log(req.session.user.username+' has logged out');
		delete req.session.user;
	}

	res.redirect('/');

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
			req.session.user = user;
			res.redirect('/users/'+username);
		}
		
	});
});

app.post('/profile', function (req, res) {

	if(req.session.user){
		var username = req.session.user.username;
		var image = req.body.image;
		var bio = req.body.bio;
		var query = {username: username};
		var change = {bio: bio, image: image};

		User.update(query, change, function (err, user){
			res.redirect('/users/'+username);
		});
	}

});

app.post('/statuses', function (req, res){
	if(req.session.user){
		var username = req.session.user.username;
		var pic = req.session.user.image;
		var status = req.body.status;

		var statusData = { 
			body: status,
			time: new Date().getTime(),
			username: username,
			image: pic,
			comments: [],
			likes: []
		};

		var newStatus = new Status(statusData).save(function (err){
			io.sockets.emit('newStatus', {statusData: statusData});
			res.redirect('/users/'+username);
		});

	}

});





app.get('/users/:username', function (req, res) {
	var username = req.params.username.toLowerCase();
	var query = {username: username};
	var currentUser = req.session.user;

	User.findOne(query, function (err, user) {
		console.log(user);
		if (err || !user) {
			res.send('No user found by id '+username);
		}
		else{
			Status.find(query).sort({time: -1}).execFind(function (err, statuses){
					res.render('profile.ejs', {
						user: user, 
						statuses: statuses, 
						currentUser: currentUser
					});	
				});
			
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
	if(!req.session.user){
		res.redirect('/login');
	}
	else{

		Status.find({}).sort({time: -1}).execFind(function (err, statuses){
			res.render('homepage.ejs', {user: req.session.user, statuses: statuses});
		});
	}

});


