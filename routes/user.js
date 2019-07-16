const passport = require('passport');

exports.login = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.render('pages/login', { title: 'Home', myVar : 'help', info: info }); }
		
		req.login(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/');
		});
	})(req, res, next);
};

exports.profileView = function(req, res) {
		res.render('pages/profile', {userID:req.user.userID, username: req.user.username });
};

exports.signup = function(req, res) {
	message = '';
	if(req.method == "POST"){
		var post  = req.body;
		var name= post.username;
		var pass= post.password;
		var fname= post.first_name;
		var lname= post.last_name;
		
		//check if username already exists
		db.query("SELECT * FROM users where username = '"+name+"'", function (err, results, fields) {
			if (err) throw err;
			if(results.length>0) {
				res.render('pages/signup', { data: req.body, message: "Username already exists" });
			} else {
				var sql = "INSERT INTO `users`(`first_name`,`last_name`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + name + "','" + pass + "')";
				var query = db.query(sql, function(err, result) {
					message = "Succesfully! Your account has been created.";
					res.render('pages/signupSuccess', { message: message });
				});
			}
		});
	} else {
		res.render('pages/signup', { data: {}, message: message });
	}
};

exports.signupSuccess =  function(req, res) {
	res.render('pages/signupSuccess');
};
