'use strict';

var server = require('./server/webserver').start();
var io = require('socket.io').listen(server);

// DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/the_last_town');
var models = {
	User: require('./server/models/user')
};

// Connection to DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	var userManagement = require('./server/UserManagement.js').getInstance(io, models.User);

});