'use strict';

var instance = null;

var CommunicationService = function(io){
	this.io = io;
	this.logAllEvents = true;

	return this;
};

CommunicationService.prototype.emit = function(event, data, targetSocketId){
	if(this.logAllEvents) {
		console.log('LOGGING - EMIT', {
			event: event,
			data: data,
			targetSocketId: targetSocketId
		});
	}
	if(targetSocketId) {
		this.io.to(targetSocketId).emit(event, data);
	} else {
		this.io.emit(event, data);
	}
	//console.log('clients count: ', this.io.engine.clientsCount);
	//console.log('all clients: ', this.io.engine.clients);
};

var getInstance = function(io){
	if(!instance){
		instance = new CommunicationService(io);
	}
	return instance;
};

exports.getInstance = getInstance;