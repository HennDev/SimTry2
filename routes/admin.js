var express = require('express');
var router = express.Router();
const loggedIn = false;

router.get('/', function(req, res) { //NOTICE THE CHANGE HERE
    res.render('pages/index', {title: 'admin', myVar : 'admin', loggedIn: loggedIn});
});

module.exports = router;