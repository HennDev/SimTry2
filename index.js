const cool = require('cool-ascii-faces')
var express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const loggedIn = false;
var auth = require('./auth');
var admin = require('./routes/admin');
var user = require('./routes/user');
var bodyParser = require('body-parser')
var flash = require('connect-flash');
var session = require('express-session');
const passport = require('passport');
var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : process.env.DBHOST,
	port     : process.env.DBPORT,
	user     : process.env.DBUSER,
	password : process.env.DBPWD,
	database : process.env.DBNAME
});

//connection.connect(function(err) {
//	if (err) throw err;
//	console.log("Connected!");
//});

global.db = connection;

function isAuthenticated(req, res, next) {
	if (req.user && req.isAuthenticated())
		return next();
	res.redirect('/login');
}

var app = express();
app
	.use(express.static(path.join(__dirname, 'public')))
	.use(bodyParser.json({ type: 'application/*+json' }))
	.use(bodyParser.text({ type: 'text/html' }))
	.use(bodyParser.urlencoded({ extended: true }))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

/*  PASSPORT SETUP  */
app.use(flash());
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		//Check if username and password exist
		
		console.log("username " + username + " password "+ password);

		db.query("SELECT * FROM Users  left join Roles on Roles.Role_ID = Users.User_ID where Username = '"+username+"' and Password = '"+password+"'", function (err, results, fields) {
			if (err) throw err;
			if(results.length>0) {
				
					console.log(results[0]);


				return done(null, {username: username, userID: results[0].id, roleID: results[0].Role_ID});
			} else {
				return done(null, false, { message: 'Password failed, try again.' })
			}
		});
	}
));

app.get('/', function(req, res) {
	console.log("app.get / "+req.session);
	
	if(req.user)
	{
		res.render('pages/index', { title: 'Home', myVar : 'help', username: req.user.username, roleID: req.user.roleID });
	}
	else{
		res.render('pages/index', { title: 'Home', myVar : 'help' });
	}
});

app.get('/login', function(req, res) {
	res.render('pages/login', { title: 'Home', myVar : 'help' });
});

app.post('/login', user.login);

app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/signupSuccess', user.signupSuccess);

app.get('/profile', isAuthenticated, user.profileView);

app.get('/logout', function (req, res){
	req.session.destroy(function (err) {
		res.redirect('/'); //Inside a callback… bulletproof!
	});
});

app.get('/admin/teams/all', isAuthenticated, admin.teamsAll);