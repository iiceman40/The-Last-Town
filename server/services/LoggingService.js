"use strict";

var dateFormat = require('dateformat'),
	fs = require('fs'),
	logFile = __dirname + '/debug.log',
	instance = null;

var LoggingService = function () {};

/**
 *
 * @param data
 */
LoggingService.prototype.log = function(data) {
	fs.appendFileSync(logFile, dateFormat(new Date(), "dd-mm-yyyy, H:MM:ss") + ' ---- ' + data + '\n');
};

var getInstance = function(){
	if(!instance){
		instance = new LoggingService();
	}
	return instance;
};

exports.getInstance = getInstance;