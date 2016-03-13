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
	console.log('starting webserver...');
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
		'jquery',
		'knockout',
		'babylonjs',
		'bootstrap'
	];
	for (var i = 0; i < modulesForClient.length; i++) {
		//console.log('node_modules/' + modulesForClient[i], path.resolve('node_modules/' + modulesForClient[i]));
		app.use('/modules/' + modulesForClient[i] + '/', express.static(path.resolve('node_modules/' + modulesForClient[i])));
	}

	// if path / is called
	app.get('/', function (req, res) {
		// deploy index.html
		//console.log('path to index: ', pathToIndex);
		res.sendfile(pathToIndex);
	});

	return server;
}
exports.start = start;