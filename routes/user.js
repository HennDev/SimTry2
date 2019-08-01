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
		res.render('pages/profile', {userID:req.user.userID, username: req.user.username, roleID: req.user.roleID });
};

exports.signup = function(req, res) {
	message = '';
	var username1 = '';
	if(req.method == "POST"){
		var post  = req.body;
		var username = post.username;
		var password = post.password;
		var fname = post.First_Name;
		var lname = post.Last_Name;
		
		
		//check if username already exists
		db.query("SELECT * FROM users where Username = '"+username+"'", function (err, results, fields) {
			if (err) throw err;
			if(results.length>0) {
				res.render('pages/signup', { data: req.body, message: "Username already exists" });
			} else {
				var sql = "INSERT INTO `users`(`First_Name`,`Last_Name`,`Username`, `Password`) VALUES ('" + fname + "','" + lname + "','" + username + "','" + password + "')";
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
