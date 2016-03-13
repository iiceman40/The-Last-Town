var instance = null;

var ClientNotificationService = function(io){
	this.io = io;
	this.logAllEvents = true;


	return this;
};

ClientNotificationService.prototype.emit = function(event, data, to){
	if(this.logAllEvents) {
		console.log('EMIT', event, data, to);
	}
	if(to) {
		this.io.to(to).emit(event, data);
	} else {
		this.io.emit(event, data);
	}
	console.log(this.io.engine.clientsCount);
	//console.log(this.io.engine.clients);
};

var getInstance = function(io){
	if(!instance){
		instance = new ClientNotificationService(io);
	}
	return instance;
};
exports.getInstance = getInstance;