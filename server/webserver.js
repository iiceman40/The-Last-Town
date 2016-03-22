'use strict';

/***********************************************************************
 * WEBSERVER
 ***********************************************************************/

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var path = require('path');

var pathToIndex = path.resolve('public/index.html');
var pathToPublic = path.resolve('public');

function start() {
	var port = process.env.PORT || 5000;
	server.listen(port);

	// static files
	app.use(express.static(pathToPublic));

	// make some modules available for client
	var modulesForClient = [
		'requirejs',
		'text',
		'socket.io',
		'underscore',
		'moment',
		'jquery',
		'knockout',
		'knockout-postbox',
		'babylonjs',
		'bootstrap'
	];
	for (var i = 0; i < modulesForClient.length; i++) {
		app.use('/modules/' + modulesForClient[i] + '/', express.static(path.resolve('node_modules/' + modulesForClient[i])));
	}

	// if path / is called
	app.get('/', function (req, res) {
		res.sendfile(pathToIndex); // deploy index.html
	});

	return server;
}
exports.start = start;