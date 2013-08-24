exports.update = function(req, res) {
	res.send('not in main file!');
};

// app.get('/', mymodule.root);
exports.root = function (req,res) {
	res.send("hi");
});	